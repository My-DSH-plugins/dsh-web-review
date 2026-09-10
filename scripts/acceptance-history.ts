/** Seed one settled, provider-free conversation for manual Preview testing. */
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

export const ACCEPTANCE_SESSION_ID = 'dsh-web-review-acceptance'

interface SessionEvent {
  seq: number
  type: string
  data: unknown
}

interface SessionRecorder {
  events: SessionEvent[]
  append: (type: string, data: unknown, options?: { surfaceOp: 'append' }) => SessionEvent
}

interface SessionModule {
  SESSION_FORMAT_VERSION: number
  Session: { create: (id: string) => SessionRecorder }
  SessionId: (id: string) => string
  default: unknown
}

interface LlmModule {
  createMessage: (input: unknown) => unknown
  createUserMessage: (input: unknown) => unknown
}

interface SeederContext {
  plugin: (plugin: unknown, config?: unknown) => Promise<unknown>
  sessionPersistence: {
    append: (id: string, events: readonly SessionEvent[]) => Promise<void>
    create: (header: unknown) => Promise<void>
    list: () => Promise<Array<{ id: string }>>
  }
  fiber: { dispose: () => Promise<void> }
}

interface CordisModule {
  Context: new () => SeederContext
}

export interface AcceptanceHistoryOptions {
  harness: string
  dshHome: string
  cwd: string
  demoUrl: string
}

/**
 * Create the fixed acceptance session through the Harness persistence service.
 * Existing history is never replaced or appended to.
 * @param options - Resolved Harness, profile, workspace, and demo locations.
 * @returns Whether this call created the fixed session.
 */
export async function ensureAcceptanceHistory(options: AcceptanceHistoryOptions): Promise<boolean> {
  const { harness, dshHome, cwd, demoUrl } = options
  const moduleUrl = (path: string) => pathToFileURL(path).href
  const cordis = await import(moduleUrl(join(
    harness, 'vendor/cordis/lib/index.js',
  ))) as CordisModule
  const sessionModule = await import(moduleUrl(join(
    harness, 'packages/core/session/lib/index.js',
  ))) as SessionModule
  const llm = await import(moduleUrl(join(
    harness, 'packages/llm/llm/lib/index.js',
  ))) as LlmModule
  const persistenceModule = await import(moduleUrl(join(
    harness, 'packages/session/session-persistence-jsonl/lib/index.js',
  ))) as { default: unknown }

  const ctx = new cordis.Context()
  try {
    await ctx.plugin(sessionModule.default)
    await ctx.plugin(persistenceModule.default, { root: join(dshHome, 'sessions') })
    if ((await ctx.sessionPersistence.list()).some(header => header.id === ACCEPTANCE_SESSION_ID)) return false

    const id = sessionModule.SessionId(ACCEPTANCE_SESSION_ID)
    const session = sessionModule.Session.create(id)
    session.append('turn/start', { turn: 1 })
    const user = session.append('user/message', llm.createUserMessage({
      content: [{ type: 'text', text: 'Open the web annotation acceptance page.' }],
      source: { kind: 'user' },
    }), { surfaceOp: 'append' })
    session.append('session/title', {
      title: 'Web Annotation Acceptance',
      messageSeqs: [user.seq],
      source: { kind: 'fallback' },
    })
    session.append('step/start', { turn: 1, step: 1 })
    session.append('assistant/message', {
      turn: 1,
      step: 1,
      message: llm.createMessage({
        role: 'assistant',
        content: [{
          type: 'text',
          text: [
            'The acceptance environment is ready.',
            '',
            `[Open Web Annotation Demo](${demoUrl})`,
            '',
            'After clicking the link, you enter“Web Preview”, add a page annotation and select an element; in the“Adjust”panel, click the dropdown arrow to the right of properties such as width to verify CSS the keyword menu.',
          ].join('\n'),
        }],
        source: { kind: 'model', provider: 'acceptance-fixture', model: 'acceptance-fixture' },
      }),
    }, { surfaceOp: 'append' })
    session.append('step/end', { turn: 1, step: 1 })
    session.append('turn/end', { turn: 1, reason: { kind: 'completed' } })

    await ctx.sessionPersistence.create({
      version: sessionModule.SESSION_FORMAT_VERSION,
      id,
      createdAt: Date.now(),
      cwd,
      delegationDepth: 0,
    })
    await ctx.sessionPersistence.append(id, session.events)
    return true
  } finally {
    await ctx.fiber.dispose()
  }
}

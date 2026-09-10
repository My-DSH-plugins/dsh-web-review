import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('forms-07', import.meta.url)

export const task: EvalTask = {
  id: 'forms-07',
  fixture: 'forms',
  fixtureKind: 'static',
  category: 'text',
  difficulty: 'medium',
  title: 'Change the email error message copy',
  instruction: 'Change the email error message text to“Please enter a valid email address”',
  capture: {
    target: '.error',
    comment: 'Change the email error message text to“Please enter a valid email address”',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.error', text: 'Please enter a valid email address' }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

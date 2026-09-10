import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-todo-05', import.meta.url)

export const task: EvalTask = {
  id: 'react-todo-05',
  fixture: 'react-todo',
  fixtureKind: 'react',
  category: 'anchor',
  difficulty: 'hard',
  title: 'Change the draft nav item text',
  instruction: 'Change the sidebar"Drafts" item to"Draft Box"',
  capture: {
    target: 'li.nav-item:nth-of-type(3)',
    comment: 'Change the sidebar"Drafts" item to"Draft Box"',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: 'li.nav-item:nth-of-type(3)', text: 'Draft Box' }],
    noRegression: [
      { kind: 'dom', selector: 'li.nav-item:nth-of-type(1)', text: 'Inbox' },
      { kind: 'dom', selector: 'li.nav-item:nth-of-type(2)', text: 'Starred' },
    ],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

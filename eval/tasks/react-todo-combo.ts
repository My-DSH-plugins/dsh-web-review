import { loadFrozenRound } from './frozen.ts'
import type { EvalTask } from '../types.ts'
import { task as todo01 } from './react-todo-01.ts'
import { task as todo02 } from './react-todo-02.ts'
import { task as todo03 } from './react-todo-03.ts'
import { task as todo04 } from './react-todo-04.ts'
import { task as todo05 } from './react-todo-05.ts'

const parts = [todo01, todo02, todo03, todo04, todo05]
const frozen = loadFrozenRound('react-todo-combo', 1, import.meta.url)

export const task: EvalTask = {
  id: 'react-todo-combo',
  fixture: 'react-todo',
  fixtureKind: 'react',
  category: 'multi-target',
  difficulty: 'long',
  title: 'Handle the four annotations on the to-do page together',
  tokenBudget: { expected: 45000, warnAbove: 60000 },
  arms: ['full'],
  rounds: [{
    prompt: 'Modify the frontend implementation based on the page annotations.',
    capture: [{
      target: 'li.nav-item',
      comment: 'Make sidebar list items highlight on hover with a background of #eef2ff',
    }, {
      target: '.todo-item',
      comment: 'Increase the spacing between todo items',
    }, {
      target: '.add-button',
      comment: 'Change“Add task”button copy to“New task”, and give it a soft shadow',
      adjusts: [{ property: 'text', after: 'New task' }],
    }, {
      target: 'li.nav-item:nth-of-type(3)',
      comment: 'Change the sidebar“Drafts” item to“Draft Box”',
    }],
    ...frozen,
  }],
  grader: {
    pass: parts.flatMap(part => part.grader.pass),
    noRegression: parts.flatMap(part => part.grader.noRegression ?? []),
    negative: parts.flatMap(part => part.grader.negative ?? []),
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

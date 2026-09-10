import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-todo-03', import.meta.url)

export const task: EvalTask = {
  id: 'react-todo-03',
  fixture: 'react-todo',
  fixtureKind: 'react',
  category: 'text',
  difficulty: 'easy',
  title: 'Change the add button copy',
  instruction: 'Change"Add task"button copy to"New task"',
  capture: {
    target: '.add-button',
    comment: 'Change"Add task"button copy to"New task"',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.add-button', text: 'New task' }],
    noRegression: [{ kind: 'dom', selector: '.add-button', style: { 'background-color': '#4c6ef5' } }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

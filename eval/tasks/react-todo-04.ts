import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-todo-04', import.meta.url)

export const task: EvalTask = {
  id: 'react-todo-04',
  fixture: 'react-todo',
  fixtureKind: 'react',
  category: 'effects',
  difficulty: 'medium',
  title: 'Add a soft shadow to the add button',
  instruction: 'Add a soft shadow to the add button',
  capture: {
    target: '.add-button',
    comment: 'Add a soft shadow to the add button',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.add-button', boxShadow: { minExtentPx: 5 } }],
    noRegression: [{ kind: 'dom', selector: '.add-button', style: { 'background-color': '#4c6ef5' } }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

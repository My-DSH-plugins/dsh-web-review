import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-todo-02', import.meta.url)

export const task: EvalTask = {
  id: 'react-todo-02',
  fixture: 'react-todo',
  fixtureKind: 'react',
  category: 'spacing',
  difficulty: 'medium',
  title: 'Increase the spacing between todo items',
  instruction: 'Increase the spacing between todo items',
  capture: {
    target: '.todo-item',
    comment: 'Increase the spacing between todo items',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.todo-item', styleGreaterThan: { 'margin-bottom': '4px' }, all: true }],
    noRegression: [{ kind: 'dom', selector: '.todo-item', text: 'Write eval cases' }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

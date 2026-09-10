import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('forms-02', import.meta.url)

export const task: EvalTask = {
  id: 'forms-02',
  fixture: 'forms',
  fixtureKind: 'static',
  category: 'accessibility',
  difficulty: 'medium',
  title: 'Add an accessible name to the search input',
  instruction: 'Add an accessible name to the top search input field“Search”',
  capture: {
    target: 'input[type="search"]',
    comment: 'Add an accessible name to the top search input field“Search”',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: 'input[type="search"]', accessibleName: 'Search' }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

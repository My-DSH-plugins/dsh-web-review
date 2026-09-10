import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('forms-08', import.meta.url)

export const task: EvalTask = {
  id: 'forms-08',
  fixture: 'forms',
  fixtureKind: 'static',
  category: 'effects',
  difficulty: 'medium',
  title: 'Add a focus shadow to the text input',
  instruction: 'Add a light blue shadow when the input field is focused',
  capture: {
    target: 'input[type="text"]',
    comment: 'Add a light blue shadow when the input field is focused',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: 'input[type="text"]', focus: true, boxShadow: { minExtentPx: 2, colorDominance: 'blue', margin: 20, requireFocusChange: true } }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

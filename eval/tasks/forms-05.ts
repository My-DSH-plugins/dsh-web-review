import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('forms-05', import.meta.url)

export const task: EvalTask = {
  id: 'forms-05',
  fixture: 'forms',
  fixtureKind: 'static',
  category: 'layout',
  difficulty: 'hard',
  title: 'Center the form and limit its maximum width',
  instruction: 'Center the form container horizontally and limit its max width to 480px',
  capture: {
    target: '.form',
    comment: 'Center the form container horizontally and limit its max width to 480px',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.form', centered: { maxWidthPx: 528, tolerancePx: 2 } }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

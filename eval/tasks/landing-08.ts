import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('landing-08', import.meta.url)

export const task: EvalTask = {
  id: 'landing-08',
  fixture: 'landing',
  fixtureKind: 'static',
  category: 'spacing',
  difficulty: 'medium',
  title: 'Widen the primary button padding',
  instruction: 'increase the primary button’s padding to top/bottom 10px, left and right 24px',
  capture: {
    target: 'button.btn-primary',
    comment: 'increase the primary button’s padding to top/bottom 10px, left and right 24px',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: 'button.btn-primary', style: { 'padding-top': '10px', 'padding-right': '24px', 'padding-bottom': '10px', 'padding-left': '24px' } }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

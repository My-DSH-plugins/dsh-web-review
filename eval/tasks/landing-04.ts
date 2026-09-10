import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('landing-04', import.meta.url)

export const task: EvalTask = {
  id: 'landing-04',
  fixture: 'landing',
  fixtureKind: 'static',
  category: 'spacing',
  difficulty: 'easy',
  title: 'Increase the spacing between cards',
  instruction: 'Increase the spacing between cards from 16px increased to 24px',
  capture: {
    target: '.cards',
    comment: 'Increase the spacing between cards from 16px increased to 24px',
    adjusts: [{ property: 'gap', after: '24px' }],
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.cards', style: { gap: '24px' } }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

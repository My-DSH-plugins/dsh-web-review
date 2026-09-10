import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('landing-03', import.meta.url)

export const task: EvalTask = {
  id: 'landing-03',
  fixture: 'landing',
  fixtureKind: 'static',
  category: 'typography',
  difficulty: 'medium',
  title: 'Enlarge the hero heading',
  instruction: 'Increase the homepage main heading’s font size from 28px increased to 32px',
  capture: {
    target: '.hero h1',
    comment: 'Increase the homepage main heading’s font size from 28px increased to 32px',
    adjusts: [{ property: 'font-size', after: '32px' }],
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.hero h1', style: { 'font-size': '32px' } }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

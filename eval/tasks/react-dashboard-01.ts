import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-dashboard-01', import.meta.url)

export const task: EvalTask = {
  id: 'react-dashboard-01',
  fixture: 'react-dashboard',
  fixtureKind: 'react',
  category: 'layout',
  difficulty: 'hard',
  title: 'Evenly distribute and align the stat cards',
  instruction: 'Make the stat cards area evenly distributed and aligned on the page',
  capture: {
    target: '.stats',
    comment: 'Make the stat cards area evenly distributed and aligned on the page',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.stats', horizontalCoverage: { childSelector: '.stat-card', minRatio: 0.98, maxTopDeltaPx: 2 } }],
    noRegression: [{ kind: 'dom', selector: '.stat-card', style: { 'border-radius': '12px' } }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-dashboard-04', import.meta.url)

export const task: EvalTask = {
  id: 'react-dashboard-04',
  fixture: 'react-dashboard',
  fixtureKind: 'react',
  category: 'responsive',
  difficulty: 'hard',
  title: 'Stack the stat cards vertically on narrow screens',
  instruction: 'When the window width is less than 768px , the stat cards stack into a single column',
  capture: {
    target: '.stats',
    comment: 'When the window width is less than 768px , the stat cards stack into a single column',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.stats', viewport: { width: 375, height: 800 }, itemsPerRow: { childSelector: '.stat-card', count: 1 } }],
    noRegression: [{ kind: 'dom', selector: '.stats', itemsPerRow: { childSelector: '.stat-card', count: 4 } }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

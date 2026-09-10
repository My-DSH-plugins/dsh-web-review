import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-dashboard-05', import.meta.url)

export const task: EvalTask = {
  id: 'react-dashboard-05',
  fixture: 'react-dashboard',
  fixtureKind: 'react',
  category: 'effects',
  difficulty: 'medium',
  title: 'Enhance the stat card shadow',
  instruction: 'Add a more pronounced shadow to the stat cards',
  capture: {
    target: '.stat-card',
    comment: 'Add a more pronounced shadow to the stat cards',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.stat-card', boxShadow: { minExtentPx: 5 }, all: true }],
    noRegression: [{ kind: 'dom', selector: '.stat-card', style: { padding: '20px' } }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

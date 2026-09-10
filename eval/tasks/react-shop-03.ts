import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-shop-03', import.meta.url)

export const task: EvalTask = {
  id: 'react-shop-03',
  fixture: 'react-shop',
  fixtureKind: 'react',
  category: 'spacing',
  difficulty: 'medium',
  title: 'Increase the spacing between product cards',
  instruction: 'Increase the spacing between product cards',
  capture: {
    target: '.products',
    comment: 'Increase the spacing between product cards',
    adjusts: [{ property: 'gap', after: '24px' }],
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.products', style: { gap: '24px' } }],
    noRegression: [{ kind: 'dom', selector: '.product-card', style: { 'border-radius': '12px' } }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

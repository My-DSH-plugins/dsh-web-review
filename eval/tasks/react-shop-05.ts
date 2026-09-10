import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-shop-05', import.meta.url)

export const task: EvalTask = {
  id: 'react-shop-05',
  fixture: 'react-shop',
  fixtureKind: 'react',
  category: 'batch',
  difficulty: 'hard',
  title: 'Unify the Add to Cart button border radius',
  instruction: 'Change all“Add to cart”buttons’ border radius is uniformly changed to 999px',
  capture: {
    target: '.buy',
    comment: 'Change all“Add to cart”buttons’ border radius is uniformly changed to 999px',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.buy', all: true, style: { 'border-radius': '999px' } }],
    noRegression: [{ kind: 'dom', selector: '.product-card', style: { 'border-radius': '12px' } }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

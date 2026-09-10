import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-shop-04', import.meta.url)

export const task: EvalTask = {
  id: 'react-shop-04',
  fixture: 'react-shop',
  fixtureKind: 'react',
  category: 'layout',
  difficulty: 'medium',
  title: 'Change the product grid to three columns',
  instruction: 'Change the product grid to three columns per row',
  capture: {
    target: '.products',
    comment: 'Change the product grid to three columns per row',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.products', itemsPerRow: { childSelector: '.product-card', count: 3 } }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

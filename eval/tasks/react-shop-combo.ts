import { loadFrozenRound } from './frozen.ts'
import type { EvalTask } from '../types.ts'
import { task as shop01 } from './react-shop-01.ts'
import { task as shop02 } from './react-shop-02.ts'
import { task as shop03 } from './react-shop-03.ts'
import { task as shop04 } from './react-shop-04.ts'
import { task as shop05 } from './react-shop-05.ts'

const parts = [shop01, shop02, shop03, shop04, shop05]
const frozen = loadFrozenRound('react-shop-combo', 1, import.meta.url)

export const task: EvalTask = {
  id: 'react-shop-combo',
  fixture: 'react-shop',
  fixtureKind: 'react',
  category: 'multi-target',
  difficulty: 'long',
  title: 'Handle all four comments on the product page',
  tokenBudget: { expected: 45000, warnAbove: 60000 },
  arms: ['full'],
  rounds: [{
    prompt: 'Modify the frontend implementation based on the page annotations.',
    capture: [{
      target: '.price',
      comment: 'Change the price text color to #e8590c',
    }, {
      target: '.product-title',
      comment: 'Bold the product title font weight to 700',
    }, {
      target: '.products',
      comment: 'Increase the spacing between product cards and change the product grid to three columns per row',
    }, {
      target: '.buy',
      comment: 'Change all“Add to cart”buttons’ border radius is uniformly changed to 999px',
    }],
    ...frozen,
  }],
  grader: {
    pass: parts.flatMap(part => part.grader.pass),
    noRegression: parts.flatMap(part => part.grader.noRegression ?? []),
    negative: parts.flatMap(part => part.grader.negative ?? []),
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

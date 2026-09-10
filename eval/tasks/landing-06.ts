import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('landing-06', import.meta.url)

export const task: EvalTask = {
  id: 'landing-06',
  fixture: 'landing',
  fixtureKind: 'static',
  category: 'effects',
  difficulty: 'medium',
  title: 'Enhance card shadows',
  instruction: 'Give the card a more pronounced shadow',
  capture: {
    target: '.card',
    comment: 'Give the card a more pronounced shadow',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: 'div:nth-of-type(1).card', boxShadow: { minExtentPx: 5 } }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

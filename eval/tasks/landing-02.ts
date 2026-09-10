import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('landing-02', import.meta.url)

export const task: EvalTask = {
  id: 'landing-02',
  fixture: 'landing',
  fixtureKind: 'static',
  category: 'text',
  difficulty: 'easy',
  title: 'Change the Learn more button label',
  instruction: 'In the third card, change the“Learn more”button copy to“View Details”',
  capture: {
    target: '.card:nth-of-type(3) button.btn-ghost',
    comment: 'In the third card, change the“Learn more”button copy to“View Details”',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.card:nth-of-type(3) button.btn-ghost', text: 'View Details' }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

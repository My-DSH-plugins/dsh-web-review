import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('forms-01', import.meta.url)

export const task: EvalTask = {
  id: 'forms-01',
  fixture: 'forms',
  fixtureKind: 'static',
  category: 'text',
  difficulty: 'easy',
  title: 'Change the submit button copy',
  instruction: 'Change the submit button label from“Submit”to“Submit now”',
  capture: {
    target: 'button[type="submit"]',
    comment: 'Change the submit button label from“Submit”to“Submit now”',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: 'button[type="submit"]', text: 'Submit now' }],
    noRegression: [{ kind: 'dom', selector: 'button[type="submit"]', style: { 'background-color': '#4c6ef5' } }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

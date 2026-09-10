import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('forms-04', import.meta.url)

export const task: EvalTask = {
  id: 'forms-04',
  fixture: 'forms',
  fixtureKind: 'static',
  category: 'spacing',
  difficulty: 'medium',
  title: 'Increase the spacing between form fields',
  instruction: 'Increase the vertical spacing between form fields',
  capture: {
    target: '.form-field',
    comment: 'Increase the vertical spacing between form fields',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.form-field', styleGreaterThan: { 'margin-bottom': '12px' } }],
    noRegression: [{ kind: 'dom', selector: '.form', style: { 'background-color': '#fff' } }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

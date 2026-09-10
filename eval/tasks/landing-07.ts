import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('landing-07', import.meta.url)

export const task: EvalTask = {
  id: 'landing-07',
  fixture: 'landing',
  fixtureKind: 'static',
  category: 'color',
  difficulty: 'medium',
  title: 'Lighten the cancel button color',
  instruction: 'Change“Cancel”Change the button’s background to light gray #d7dbe0',
  capture: {
    target: '.card:nth-of-type(2) button.btn-ghost',
    comment: 'Change“Cancel”Change the button’s background to light gray #d7dbe0',
    adjusts: [{ property: 'background-color', after: '#d7dbe0' }],
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.card:nth-of-type(2) button.btn-ghost', style: { 'background-color': '#d7dbe0' } }],
    noRegression: [{ kind: 'dom', selector: '.card:nth-of-type(3) button', style: { 'background-color': '#eef0f3' } }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

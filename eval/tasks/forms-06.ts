import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('forms-06', import.meta.url)

export const task: EvalTask = {
  id: 'forms-06',
  fixture: 'forms',
  fixtureKind: 'static',
  category: 'interaction',
  difficulty: 'medium',
  title: 'Darken the submit button’s hover color',
  instruction: 'Darken the submit button background on hover to #3b5bdb',
  capture: {
    target: 'button[type="submit"]',
    comment: 'Darken the submit button background on hover to #3b5bdb',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: 'button[type="submit"]', hover: true, style: { 'background-color': '#3b5bdb' } }],
    noRegression: [{ kind: 'dom', selector: 'button[type="submit"]', style: { 'background-color': '#4c6ef5' } }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

import { loadFrozenRound } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const frozen = loadFrozenRound('landing-01', 1, import.meta.url)

export const task: EvalTask = {
  id: 'landing-01',
  fixture: 'landing',
  fixtureKind: 'static',
  category: 'protocol-smoke',
  difficulty: 'easy',
  title: 'Darken the primary button color',
  arms: ['full'],
  rounds: [{
    prompt: 'Modify the frontend implementation based on the page annotations.',
    capture: [{
      target: 'button.btn-primary',
      comment: 'Make the homepage primary button background color a bit darker, change it to #224466',
      adjusts: [{ property: 'background-color', after: '#224466' }],
    }],
    ...frozen,
  }],
  grader: {
    pass: [{ kind: 'dom', selector: 'button.btn-primary', style: { 'background-color': '#224466' } }],
    noRegression: [{ kind: 'dom', selector: '.card:nth-of-type(3) button.btn-ghost', style: { 'background-color': '#eef0f3' } }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

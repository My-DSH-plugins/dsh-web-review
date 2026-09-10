import { loadFrozenRound } from './frozen.ts'
import type { EvalTask } from '../types.ts'
import { task as landing01 } from './landing-01.ts'
import { task as landing02 } from './landing-02.ts'
import { task as landing03 } from './landing-03.ts'
import { task as landing04 } from './landing-04.ts'
import { task as landing05 } from './landing-05.ts'
import { task as landing06 } from './landing-06.ts'
import { task as landing07 } from './landing-07.ts'
import { task as landing08 } from './landing-08.ts'
import { task as landing09 } from './landing-09.ts'
import { task as landing10 } from './landing-10.ts'

const parts = [landing01, landing02, landing03, landing04, landing05, landing06, landing07, landing08, landing09, landing10]
const frozen = loadFrozenRound('landing-combo', 1, import.meta.url)

export const task: EvalTask = {
  id: 'landing-combo',
  fixture: 'landing',
  fixtureKind: 'static',
  category: 'multi-target',
  difficulty: 'long',
  title: 'Handle the eight landing page annotations together',
  tokenBudget: { expected: 60000, warnAbove: 80000 },
  arms: ['full'],
  rounds: [{
    prompt: 'Modify the frontend implementation based on the page annotations.',
    capture: [{
      target: 'button.btn-primary',
      comment: 'Make the homepage primary button background color a bit darker, change it to #224466, and increase the padding to top and bottom 10px, left and right 24px',
      adjusts: [{ property: 'background-color', after: '#224466' }],
    }, {
      target: '.card:nth-of-type(3) button.btn-ghost',
      comment: 'In the third card, change the“Learn more”button copy to“View Details”',
    }, {
      target: '.hero h1',
      comment: 'Increase the homepage main heading’s font size from 28px increased to 32px',
    }, {
      target: '.cards',
      comment: 'Increase the spacing between cards from 16px increased to 24px',
    }, {
      target: '.hero',
      comment: 'Left-align the content in the homepage hero',
      targetPosition: { xRatio: 0.08, yRatio: 0.9 },
    }, {
      target: '.card',
      comment: 'Give the cards a more prominent shadow, and change the border radius of all cards from 12px to 8px',
    }, {
      target: '.card:nth-of-type(2) button.btn-ghost',
      comment: 'Change“Cancel”Change the button’s background to light gray #d7dbe0',
    }, {
      target: '.card h3',
      comment: 'Bolden the card title’s font weight to 600',
    }],
    ...frozen,
  }],
  grader: {
    pass: parts.flatMap(part => part.grader.pass),
    noRegression: parts.flatMap(part => part.grader.noRegression ?? []),
    negative: parts.flatMap(part => part.grader.negative ?? []),
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

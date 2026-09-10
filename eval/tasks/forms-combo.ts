import { loadFrozenRound } from './frozen.ts'
import type { EvalTask } from '../types.ts'
import { task as forms01 } from './forms-01.ts'
import { task as forms02 } from './forms-02.ts'
import { task as forms03 } from './forms-03.ts'
import { task as forms04 } from './forms-04.ts'
import { task as forms05 } from './forms-05.ts'
import { task as forms06 } from './forms-06.ts'
import { task as forms07 } from './forms-07.ts'
import { task as forms08 } from './forms-08.ts'
import { task as forms09 } from './forms-09.ts'
import { task as forms10 } from './forms-10.ts'

const parts = [forms01, forms02, forms03, forms04, forms05, forms06, forms07, forms08, forms09, forms10]
const frozen = loadFrozenRound('forms-combo', 1, import.meta.url)

export const task: EvalTask = {
  id: 'forms-combo',
  fixture: 'forms',
  fixtureKind: 'static',
  category: 'multi-target',
  difficulty: 'long',
  title: 'Handle all seven annotations on the form page',
  tokenBudget: { expected: 60000, warnAbove: 80000 },
  arms: ['full'],
  rounds: [{
    prompt: 'Modify the frontend implementation based on the page annotations.',
    capture: [{
      target: 'button[type="submit"]',
      comment: 'Change the submit button label from“Submit”to“Submit now”, and on hover the background darkens to #3b5bdb',
    }, {
      target: 'input[type="search"]',
      comment: 'Add an accessible name to the top search input field“Search”',
    }, {
      target: '.error',
      comment: 'Change the error message text color to #d64545, and change the email error message text to“Please enter a valid email address”',
    }, {
      target: '.form-field',
      comment: 'Increase the vertical spacing between form fields',
    }, {
      target: '.form',
      comment: 'Center the form container horizontally and limit its max width to 480px',
      targetPosition: { xRatio: 0.5, yRatio: 0.02 },
    }, {
      target: '#email',
      comment: 'Add a light blue shadow when an input is focused, and unify all input border radii to 8px',
    }, {
      target: 'label',
      comment: 'Increase the form label font size to 15px and bold to 600',
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

import { loadFrozenRound } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const frozen = loadFrozenRound('static-catalog-01', 1, import.meta.url)

export const task: EvalTask = {
  id: 'static-catalog-01', fixture: 'static-catalog', fixtureKind: 'static', category: 'anchor-fallback', difficulty: 'long',
  title: 'Locating duplicate product nodes without a framework source anchor',
  tokenBudget: { expected: 20_000, warnAbove: 30_000 },
  arms: ['full', 'text-only', 'oracle'],
  rounds: [{
    prompt: 'Modify the frontend implementation based on the page annotations.',
    capture: [
      { target: '.sold-out .a1b2c3_action', comment: 'Only the out-of-stock product’s button copy is changed to“Back-in-stock alert”, while the other three product buttons stay as they are.', adjusts: [{ property: 'text', after: 'Back-in-stock alert' }] },
      { target: '.a1b2c3_price', comment: 'Increase all product prices to 18px, and do not change the font size of product titles or descriptions.', adjusts: [{ property: 'font-size', after: '18px' }] },
      { target: '.a1b2c3_favorite', comment: 'These heart buttons have no accessible name. Each card was given“Favorite + product name”add aria-label, and the icon stays hidden from screen readers.', selectedSkills: ['better-accessibility'] },
      { target: '.a1b2c3_productCard.featured', comment: 'Only add to the first featured card 2px of #7a5af8  border, and the other product cards stay unchanged.', targetPosition: { xRatio: 0.02, yRatio: 0.55 } },
      { target: '.a1b2c3_catalogGrid', comment: 'On mobile, only one product card is shown per row; on desktop, four columns are still kept.', viewport: { width: 390, height: 844 }, targetPosition: { xRatio: 0.5, yRatio: 0.002 } },
    ],
    oracleContext: [
      '- Product markup is in index.html. The sold-out card is the article with class sold-out.',
      '- Shared catalog visuals and the mobile media query are in styles.css.',
      '- Apply price sizing to .a1b2c3_price, the featured border to .a1b2c3_productCard.featured, and the mobile column rule to .a1b2c3_catalogGrid.',
    ].join('\n'),
    ...frozen,
  }],
  grader: {
    pass: [
      { kind: 'dom', selector: '.sold-out .a1b2c3_action', text: 'Back-in-stock alert' },
      { kind: 'dom', selector: '.a1b2c3_price', style: { 'font-size': '18px' }, all: true },
      { kind: 'dom', selector: '.a1b2c3_favorite', accessibleNameFromDescendant: { ancestorSelector: '.a1b2c3_productCard', descendantSelector: 'h2', prefix: 'Favorite' }, all: true },
      { kind: 'dom', selector: '.a1b2c3_favorite span', attr: { name: 'aria-hidden', value: 'true' }, all: true },
      { kind: 'dom', selector: '.a1b2c3_productCard.featured', style: { 'border-width': '2px', 'border-color': '#7a5af8' } },
      { kind: 'dom', selector: '.a1b2c3_catalogGrid', itemsPerRow: { childSelector: '.a1b2c3_productCard', count: 1 }, viewport: { width: 390, height: 844 } },
    ],
    noRegression: [
      { kind: 'dom', selector: '.a1b2c3_productCard:not(.featured)', style: { 'border-width': '1px', 'border-color': '#ded9d0' }, all: true },
      { kind: 'dom', selector: '.a1b2c3_productCard:not(.sold-out) .a1b2c3_action', text: 'Add to Bag', all: true },
      { kind: 'dom', selector: '.a1b2c3_productCard h2', style: { 'font-size': '17px' }, all: true },
      { kind: 'dom', selector: '.a1b2c3_catalogGrid', itemsPerRow: { childSelector: '.a1b2c3_productCard', count: 4 }, viewport: { width: 1120, height: 900 } },
    ],
    negative: ['!important'],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

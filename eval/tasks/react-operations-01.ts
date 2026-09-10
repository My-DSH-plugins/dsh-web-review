import { loadFrozenRound } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const frozen = loadFrozenRound('react-operations-01', 1, import.meta.url)

export const task: EvalTask = {
  id: 'react-operations-01',
  fixture: 'react-operations',
  fixtureKind: 'react',
  category: 'multi-target',
  difficulty: 'long',
  title: 'Handle the six related annotations on the operations console',
  tokenBudget: { expected: 35_000, warnAbove: 50_000 },
  arms: ['full', 'text-only', 'oracle'],
  rounds: [{
    prompt: 'Modify the frontend implementation based on the page annotations.',
    capture: [
      {
        target: '.nav-link.active',
        comment: 'The current section is not prominent enough. Only strengthen the selected state: add a slightly darker background, and add on the left a #7aa2ff  accent line; do not change other nav items.',
        selectedSkills: ['better-interface'],
      },
      {
        target: '.filter-bar',
        comment: 'The filter area and the result cards are mixed together. Make this a separate light blue-gray filter panel with a clearer border, and increase the inner padding to 20px.',
        adjusts: [{ property: 'background-color', after: '#eef3fb' }],
        targetPosition: { xRatio: 0.5, yRatio: 0.08 },
      },
      {
        target: '.metrics',
        comment: 'The three metric cards are too cramped; the card spacing and this group’s vertical padding are both adjusted to 24px.',
        adjusts: [{ property: 'gap', after: '24px' }],
        targetPosition: { xRatio: 0.335, yRatio: 0.5 },
      },
      {
        target: 'tbody tr:first-child .cancel-order',
        comment: '“Cancel order”is a destructive action, so this action in every order row uses the danger button style; do not affect“Export data”and“New Order”.',
      },
      {
        target: '.drawer h2',
        comment: 'At phone widths the title is too long and squeezes out the close button. On narrow screens keep it on a single line and truncate with an ellipsis; the close button must always stay visible.',
        viewport: { width: 390, height: 844 },
      },
      {
        target: '.filter-heading span',
        comment: 'On mobile the filter area keeps only the title and description, hiding the status, search box and apply button first; the desktop layout stays complete.',
        viewport: { width: 390, height: 844 },
      },
    ],
    oracleContext: [
      '- Navigation selected-state styles live in src/styles.css and the item markup is owned by src/components/Sidebar.tsx.',
      '- Filter and responsive rules live in src/styles.css; FilterBar markup is in src/components/FilterBar.tsx.',
      '- Shared order action markup is in src/components/OrderTable.tsx. Add a danger variant rather than changing every primary button.',
      '- Drawer markup is in src/components/OrderDrawer.tsx and its narrow-screen behavior belongs in the existing media query.',
    ].join('\n'),
    ...frozen,
  }],
  grader: {
    pass: [
      {
        kind: 'dom', selector: '.nav-link.active',
        styleDiffersFrom: { selector: '.nav-link:not(.active)', properties: ['background-color'] },
        colorLuminance: { property: 'background-color', max: 100 },
        leftAccentColor: '#7aa2ff',
      },
      { kind: 'dom', selector: '.filter-bar', style: { 'background-color': '#eef3fb', padding: '20px' }, styleGreaterThan: { 'border-width': '0px' } },
      { kind: 'dom', selector: '.metrics', style: { gap: '24px', 'margin-top': '24px', 'margin-bottom': '24px' } },
      { kind: 'dom', selector: '.actions button:last-child', text: 'Cancel order', dangerStyle: { margin: 20 }, all: true },
      { kind: 'dom', selector: '.drawer h2', style: { overflow: 'hidden', 'text-overflow': 'ellipsis', 'white-space': 'nowrap' }, viewport: { width: 390, height: 844 } },
      { kind: 'dom', selector: '.drawer .icon-button', visible: true, doesNotOverlap: '.drawer h2', viewport: { width: 390, height: 844 } },
      { kind: 'dom', selector: '.filter-bar label', visible: false, viewport: { width: 390, height: 844 }, all: true },
      { kind: 'dom', selector: '.filter-bar .button', visible: false, viewport: { width: 390, height: 844 } },
      { kind: 'dom', selector: '.filter-heading strong', visible: true, viewport: { width: 390, height: 844 } },
      { kind: 'dom', selector: '.filter-heading span', visible: true, viewport: { width: 390, height: 844 } },
    ],
    noRegression: [
      { kind: 'dom', selector: '.page-heading .primary', style: { 'background-color': '#3267d6' } },
      { kind: 'dom', selector: '.results-heading .primary', style: { 'background-color': '#3267d6' } },
      { kind: 'dom', selector: '.nav-link:not(.active)', style: { 'background-color': 'rgba(0, 0, 0, 0)' } },
      { kind: 'dom', selector: '.filter-bar label', style: { display: 'grid' }, viewport: { width: 1280, height: 900 }, all: true },
    ],
    negative: ['!important'],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

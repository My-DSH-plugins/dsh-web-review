import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('landing-10', import.meta.url)

export const task: EvalTask = {
  id: 'landing-10',
  fixture: 'landing',
  fixtureKind: 'static',
  category: 'batch',
  difficulty: 'hard',
  title: 'Reduce card border radius',
  instruction: 'Change the border radius of all cards from 12px to 8px',
  capture: {
    target: '.card',
    comment: 'Change the border radius of all cards from 12px to 8px',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.card', all: true, style: { 'border-radius': '8px' } }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('landing-05', import.meta.url)

export const task: EvalTask = {
  id: 'landing-05',
  fixture: 'landing',
  fixtureKind: 'static',
  category: 'layout',
  difficulty: 'hard',
  title: 'Left-align the hero content',
  instruction: 'Left-align the content in the homepage hero',
  capture: {
    target: '.hero',
    comment: 'Left-align the content in the homepage hero',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.hero', style: { 'text-align': 'left' } }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

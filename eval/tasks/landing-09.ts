import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('landing-09', import.meta.url)

export const task: EvalTask = {
  id: 'landing-09',
  fixture: 'landing',
  fixtureKind: 'static',
  category: 'typography',
  difficulty: 'medium',
  title: 'Bold the card titles',
  instruction: 'Bolden the card title’s font weight to 600',
  capture: {
    target: '.card h3',
    comment: 'Bolden the card title’s font weight to 600',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.card h3', style: { 'font-weight': '600' }, all: true }],
  },
  golden: { kind: 'html-dir', dir: 'golden' },
}

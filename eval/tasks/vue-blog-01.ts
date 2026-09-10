import { loadFrozenRound } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const frozen = loadFrozenRound('vue-blog-01', 1, import.meta.url)

export const task: EvalTask = {
  id: 'vue-blog-01',
  fixture: 'vue-blog',
  fixtureKind: 'vue',
  category: 'protocol-smoke',
  difficulty: 'easy',
  title: 'Change the blog title copy',
  arms: ['full'],
  rounds: [{
    prompt: 'Modify the frontend implementation based on the page annotations.',
    capture: [{
      target: 'h1.title',
      comment: 'Change the blog’s main heading My Blog to Daily Notes',
    }],
    ...frozen,
  }],
  grader: {
    pass: [{ kind: 'dom', selector: 'h1.title', text: 'Daily Notes' }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

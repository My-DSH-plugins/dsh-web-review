import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-profile-01', import.meta.url)

export const task: EvalTask = {
  id: 'react-profile-01',
  fixture: 'react-profile',
  fixtureKind: 'react',
  category: 'text',
  difficulty: 'easy',
  title: 'Change the bio text',
  instruction: 'Change the bio text to“Passionate about frontend engineering and interface design”',
  capture: {
    target: '.bio',
    comment: 'Change the bio text to“Passionate about frontend engineering and interface design”',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.bio', text: 'Passionate about frontend engineering and interface design' }],
    noRegression: [{ kind: 'dom', selector: '.name', text: 'Li Lei' }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

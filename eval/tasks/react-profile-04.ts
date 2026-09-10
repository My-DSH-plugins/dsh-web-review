import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-profile-04', import.meta.url)

export const task: EvalTask = {
  id: 'react-profile-04',
  fixture: 'react-profile',
  fixtureKind: 'react',
  category: 'accessibility',
  difficulty: 'medium',
  title: 'Add an accessible name to the avatar',
  instruction: 'Add an accessible name to the avatar“User avatar”',
  capture: {
    target: '.avatar',
    comment: 'Add an accessible name to the avatar“User avatar”',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.avatar', accessibleName: 'User avatar' }],
    noRegression: [{ kind: 'dom', selector: '.name', text: 'Li Lei' }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

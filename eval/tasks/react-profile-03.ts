import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-profile-03', import.meta.url)

export const task: EvalTask = {
  id: 'react-profile-03',
  fixture: 'react-profile',
  fixtureKind: 'react',
  category: 'size',
  difficulty: 'easy',
  title: 'Enlarge the avatar',
  instruction: 'Change the avatar size to 96px',
  capture: {
    target: '.avatar',
    comment: 'Change the avatar size to 96px',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.avatar', style: { width: '96px', height: '96px' } }],
    noRegression: [{ kind: 'dom', selector: '.avatar', style: { 'border-radius': '50%' } }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

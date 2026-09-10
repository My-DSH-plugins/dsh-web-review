import { loadFrozen } from './frozen.ts'
import type { EvalTask } from '../types.ts'

const { snapshot, captureMeta } = loadFrozen('react-profile-05', import.meta.url)

export const task: EvalTask = {
  id: 'react-profile-05',
  fixture: 'react-profile',
  fixtureKind: 'react',
  category: 'layout',
  difficulty: 'medium',
  title: 'Stack and center the profile information',
  instruction: 'Make the personal info row stack vertically and be centered',
  capture: {
    target: '.info',
    comment: 'Make the personal info row stack vertically and be centered',
  },
  snapshot,
  captureMeta,
  grader: {
    pass: [{ kind: 'dom', selector: '.info', style: { 'flex-direction': 'column', 'align-items': 'center' } }],
    noRegression: [{ kind: 'dom', selector: '.name', text: 'Li Lei' }],
  },
  golden: { kind: 'git-patch', patchFile: 'golden.patch' },
}

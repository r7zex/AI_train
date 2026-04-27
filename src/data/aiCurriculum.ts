import type { FlowTopic } from './aiCurriculumTypes'
import { curriculumBlocks } from './curriculum/helpers'
import { introTopics } from './curriculum/intro'
import { numpyTopics } from './curriculum/numpy'

export { curriculumBlocks }

export const flowTopics: FlowTopic[] = [
  ...introTopics,
  ...numpyTopics,
]

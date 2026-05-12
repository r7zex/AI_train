import type { FlowTopic } from './aiCurriculumTypes'
import { curriculumBlocks } from './curriculum/helpers'
import { introTopics } from './curriculum/intro'
import { topicMetricsPrf } from './curriculum/metrics'
import { topicGradientDescent } from './curriculum/optimization'
import { numpyTopics } from './curriculum/numpy/index'

export { curriculumBlocks }

export const flowTopics: FlowTopic[] = [
  ...introTopics,
  topicMetricsPrf,
  topicGradientDescent,
  ...numpyTopics,
]

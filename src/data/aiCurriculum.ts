import type { FlowTopic } from './aiCurriculumTypes'
import { curriculumBlocks } from './curriculum/helpers'
import { topicAiMlDlV2, topicMlTypes } from './curriculum/intro_v2'
import { topicMlProjectLifecycle, topicMetricsDeep } from './curriculum/intro_v2_part2'
import { numpyTopics } from './curriculum/numpy/index'
import { pandasTopics } from './curriculum/pandas'

export { curriculumBlocks }

export const flowTopics: FlowTopic[] = [
  topicAiMlDlV2,
  topicMlTypes,
  topicMlProjectLifecycle,
  topicMetricsDeep,
  ...numpyTopics,
  ...pandasTopics,
]

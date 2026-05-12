import type { FlowTopic } from './aiCurriculumTypes'
import { curriculumBlocks } from './curriculum/helpers'
import { topicAiMlDlV2, topicMlTypes } from './curriculum/intro_v2'
import { topicMlProjectLifecycle, topicMetricsDeep } from './curriculum/intro_v2_part2'
import { topicBiasVariance } from './curriculum/intro_v2_advanced'
import { topicMetricsPrf } from './curriculum/metrics'
import { topicGradientDescent } from './curriculum/optimization'
import { topicGiniImpurity } from './curriculum/trees'
import { numpyTopics } from './curriculum/numpy/index'
import { topicPandasBasics } from './curriculum/pandas'

export { curriculumBlocks }

export const flowTopics: FlowTopic[] = [
  topicAiMlDlV2,
  topicMlTypes,
  topicMlProjectLifecycle,
  topicMetricsDeep,
  topicBiasVariance,
  topicGradientDescent,
  topicGiniImpurity,
  ...numpyTopics,
  topicPandasBasics,
]

import type { FlowTopic } from '../../aiCurriculumTypes'
import { topicMlProblemTypes } from './problem_types'
import { topicMlDataTarget } from './data_target'
import { topicMlModelFitPredict } from './model_fit_predict'
import { topicMlTrainTestBaselineMetrics } from './train_test_baseline_metrics'
import { topicMlProjectCycle } from './project_cycle'

export const mlFoundationsTopics: FlowTopic[] = [
  topicMlProblemTypes,
  topicMlDataTarget,
  topicMlModelFitPredict,
  topicMlTrainTestBaselineMetrics,
  topicMlProjectCycle,
]

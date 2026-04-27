import type { FlowTopic } from '../../aiCurriculumTypes'
import { topicNumpyWhy, topicNumpyShape } from './basics'
import { topicNumpyCreation } from './creation'
import { topicNumpyIndexing } from './indexing'
import { topicNumpyVectorOps, topicNumpyBroadcasting } from './operations'
import { topicNumpyAggregations, topicNumpyAxis } from './statistics'
import { topicNumpyMasks, topicNumpyRandom } from './advanced'

export const numpyTopics: FlowTopic[] = [
  topicNumpyWhy,
  topicNumpyCreation,
  topicNumpyShape,
  topicNumpyIndexing,
  topicNumpyVectorOps,
  topicNumpyAggregations,
  topicNumpyAxis,
  topicNumpyMasks,
  topicNumpyBroadcasting,
  topicNumpyRandom,
]

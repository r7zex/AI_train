import type { FlowTopic } from '../../aiCurriculumTypes'
import { topicPandasWhy } from './basics'
import { topicPandasReadInspect } from './loading'
import { topicPandasSelection } from './selection'
import { topicPandasFilteringSorting } from './filtering'
import { topicPandasMissingDuplicates } from './cleaning'
import { topicPandasGroupby } from './grouping'
import { topicPandasTypesAndPreparation } from './preparation'

export const pandasTopics: FlowTopic[] = [
  topicPandasWhy,
  topicPandasReadInspect,
  topicPandasSelection,
  topicPandasFilteringSorting,
  topicPandasMissingDuplicates,
  topicPandasGroupby,
  topicPandasTypesAndPreparation,
]

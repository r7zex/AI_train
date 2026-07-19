import type { FlowTopic } from '../../aiCurriculumTypes'
import { biomedicalMlTopics } from './biomedical_ml'
import { capstoneTopics } from './capstone'
import { capstoneQ3Topics } from './capstone_q3'
import { genomicsTopics } from './genomics'
import { proteinTopics } from './proteins'
import { statisticsTopics } from './statistics'

export const researchTopics: FlowTopic[] = [
  ...statisticsTopics,
  ...biomedicalMlTopics,
  ...genomicsTopics,
  ...proteinTopics,
  ...capstoneTopics,
  ...capstoneQ3Topics,
]

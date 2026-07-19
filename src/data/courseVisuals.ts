import type { FlowTopic } from './aiCurriculumTypes'

export interface CourseVisual {
  src: string
  alt: string
}

export const extraVisualTopicIds = new Set([
  'matplotlib-basics',
  'matplotlib-lines-scatter',
  'matplotlib-distributions',
  'matplotlib-layout-export',
  'eda-correlation',
  'ml-problem-types',
  'validation-split',
  'cross-validation-search',
  'metrics-confusion-matrix',
  'linear-regression',
  'regularization-l1-l2',
  'logistic-regression',
  'decision-trees',
  'bagging-random-forest',
  'gradient-boosting',
  'support-vector-machines',
  'kmeans-clustering',
])

function plainTopicTitle(title: string) {
  return title.replace(/^\d+\.\d+\s+/, '')
}

export function getCourseVisuals(topic: FlowTopic): CourseVisual[] {
  const title = plainTopicTitle(topic.title)
  const visuals: CourseVisual[] = [
    {
      src: `/course-visuals/${topic.id}.png`,
      alt: `Учебная иллюстрация к теме «${title}»`,
    },
  ]

  if (extraVisualTopicIds.has(topic.id)) {
    visuals.push({
      src: `/course-visuals/${topic.id}-2.png`,
      alt: `Дополнительная учебная иллюстрация к теме «${title}»`,
    })
  }

  return visuals
}

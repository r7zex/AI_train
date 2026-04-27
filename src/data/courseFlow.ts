import { curriculumBlocks, flowTopics } from './aiCurriculum'
import { stepTypeMeta } from './aiCurriculumTypes'
import type {
  ConceptCard,
  ConceptCodeExample,
  DefinitionCard,
  FlowStep,
  FlowStepType,
  FlowTopic,
  FormulaCard,
  LessonSection,
  ParameterInfo,
  PracticeTask,
  PracticeTestCase,
  SourceLink,
} from './aiCurriculumTypes'

export { flowTopics, stepTypeMeta }
export type {
  ConceptCard,
  ConceptCodeExample,
  DefinitionCard,
  FlowStep,
  FlowStepType,
  FlowTopic,
  FormulaCard,
  LessonSection,
  ParameterInfo,
  PracticeTask,
  PracticeTestCase,
  SourceLink,
}

function blockThemes(blockId: string) {
  return flowTopics.filter((topic) => topic.blockId === blockId)
}

export const flowCourseBlocks = curriculumBlocks.map((meta) => {
  const themes = blockThemes(meta.id)
  const subblocks = Array.from(new Map(themes.map((topic) => [topic.subblockId, topic])).values()).map((subblockTopic, index) => {
    const subblockThemes = themes.filter((topic) => topic.subblockId === subblockTopic.subblockId)
    return {
      id: subblockTopic.subblockId,
      title: subblockTopic.subblockTitle,
      order: index + 1,
      description: subblockThemes[0]?.summary ?? 'Материалы блока.',
      themes: subblockThemes,
      cheatsheet: subblockThemes.flatMap((topic) => topic.themeCheatsheet),
    }
  })

  return {
    id: meta.id,
    title: meta.title,
    order: meta.order,
    icon: meta.icon,
    description: meta.description,
    subblocks,
    cheatsheet: themes.flatMap((topic) => topic.themeCheatsheet),
  }
})

export function getFlowTopicById(topicId: string) {
  return flowTopics.find((topic) => topic.id === topicId) ?? null
}

export function getFlowStep(topicId: string, stepId: string) {
  return getFlowTopicById(topicId)?.steps.find((step) => step.id === stepId) ?? null
}

export function getFlowStepHref(topicId: string, stepId: string) {
  return `/topics/${topicId}/${stepId}`
}

export function getFlowPrevNextTopic(topicId: string) {
  const index = flowTopics.findIndex((topic) => topic.id === topicId)
  return {
    prev: index > 0 ? flowTopics[index - 1] : null,
    next: index >= 0 && index < flowTopics.length - 1 ? flowTopics[index + 1] : null,
  }
}

export function getFlowPrevNextStep(topicId: string, stepId: string) {
  const topic = getFlowTopicById(topicId)
  if (!topic) return { prev: null, next: null }
  const index = topic.steps.findIndex((step) => step.id === stepId)
  return {
    prev: index > 0 ? topic.steps[index - 1] : null,
    next: index >= 0 && index < topic.steps.length - 1 ? topic.steps[index + 1] : null,
  }
}

export const searchIndex = flowTopics.flatMap((topic) => [
  {
    id: `${topic.id}-topic`,
    type: 'topic',
    title: topic.title,
    href: `/topics/${topic.id}`,
    subtitle: `${topic.blockTitle} -> ${topic.subblockTitle}`,
    text: [
      topic.summary,
      topic.simpleExplanation,
      ...topic.terminology,
      ...topic.formulas,
      ...topic.themeCheatsheet,
      ...topic.sources.map((source) => `${source.label} ${source.why}`),
    ].join(' '),
  },
  ...topic.steps.map((step) => ({
    id: step.id,
    type: 'step',
    title: `${topic.title} · ${step.title}`,
    href: getFlowStepHref(topic.id, step.id),
    subtitle: step.summary,
    text: [
      step.summary,
      step.mainIdea ?? '',
      ...(step.paragraphs ?? []),
      ...(step.bullets ?? []),
      ...(step.sections?.flatMap((section) => [
        section.title,
        ...section.paragraphs,
        ...(section.bullets ?? []),
        ...(section.callouts?.map((callout) => `${callout.title} ${callout.body}`) ?? []),
      ]) ?? []),
      ...(step.conceptCards?.flatMap((concept) => [
        concept.title,
        concept.theory,
        concept.what,
        concept.why,
        concept.where,
        concept.formula.expression,
        concept.formula.meaning,
        concept.howToUse,
        ...concept.params.map((param) => `${param.name} ${param.meaning}`),
        concept.codeExample.code,
        ...concept.commonMistakes.map((mistake) => `${mistake.title} ${mistake.explanation}`),
      ]) ?? []),
      ...(step.formulaCards?.flatMap((formula) => [formula.label, formula.expression, formula.meaning, ...formula.notation]) ?? []),
      ...(step.codeExample ? [step.codeExample.code, ...step.codeExample.explanation] : []),
      ...(step.quiz?.questions.map((question) => `${question.question} ${question.explanation}`) ?? []),
      ...(step.sources?.map((source) => `${source.label} ${source.why}`) ?? []),
    ].join(' '),
  })),
])

import { useEffect, useMemo, useState } from 'react'
import { flowCourseBlocks, getFlowTopicById } from '../data/courseFlow'

const STORAGE_KEY = 'ml-trainer-progress-v3'
const LEGACY_KEYS = ['ml-trainer-progress-v2', 'ml-trainer-progress', 'stepik-like-progress']

export interface ProgressState {
  version: 3
  completedSteps: string[]
  passedQuizzes: string[]
  passedPractices: string[]
  completedTopics: string[]
  completedSubtopics: string[]
  lastVisitedStep: Record<string, string>
}

const defaultState: ProgressState = {
  version: 3,
  completedSteps: [],
  passedQuizzes: [],
  passedPractices: [],
  completedTopics: [],
  completedSubtopics: [],
  lastVisitedStep: {},
}

function dedupe(values: string[]) {
  return Array.from(new Set(values))
}

function deriveState(base: Omit<ProgressState, 'completedTopics' | 'completedSubtopics' | 'version'> & Partial<Pick<ProgressState, 'completedTopics' | 'completedSubtopics' | 'version'>>): ProgressState {
  const normalizedBase = {
    ...defaultState,
    ...base,
    completedSteps: dedupe(base.completedSteps ?? []),
    passedQuizzes: dedupe(base.passedQuizzes ?? []),
    passedPractices: dedupe(base.passedPractices ?? []),
    lastVisitedStep: base.lastVisitedStep ?? {},
  }

  const completedTopics = flowCourseBlocks.flatMap((block) =>
    block.subblocks.flatMap((subblock) =>
      subblock.themes
        .filter((topic) => topic.steps.every((step) => normalizedBase.completedSteps.includes(step.id)))
        .map((topic) => topic.id),
    ),
  )

  const completedSubtopics = flowCourseBlocks.flatMap((block) =>
    block.subblocks
      .filter((subblock) => subblock.themes.every((topic) => completedTopics.includes(topic.id)))
      .map((subblock) => subblock.id),
  )

  return {
    ...normalizedBase,
    version: 3,
    completedTopics,
    completedSubtopics,
  }
}

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ProgressState>
      return deriveState({
        completedSteps: parsed.completedSteps ?? [],
        passedQuizzes: parsed.passedQuizzes ?? [],
        passedPractices: parsed.passedPractices ?? [],
        lastVisitedStep: parsed.lastVisitedStep ?? {},
      })
    }

    const migrated = LEGACY_KEYS.flatMap((key) => {
      const item = localStorage.getItem(key)
      if (!item) return [] as string[]

      try {
        const parsed = JSON.parse(item) as Partial<ProgressState> | string[] | Record<string, boolean>
        if (Array.isArray(parsed)) return parsed
        if ('completedSteps' in (parsed as object)) {
          return (parsed as Partial<ProgressState>).completedSteps ?? []
        }
        return Object.entries(parsed as Record<string, boolean>)
          .filter(([, value]) => Boolean(value))
          .map(([stepId]) => stepId)
      } catch {
        return []
      }
    })

    return deriveState({ completedSteps: migrated, passedPractices: [], passedQuizzes: [], lastVisitedStep: {} })
  } catch {
    return defaultState
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const markStepCompleted = (stepId: string) => {
    setProgress((prev) => deriveState({ ...prev, completedSteps: [...prev.completedSteps, stepId] }))
  }

  const markQuizPassed = (stepId: string) => {
    setProgress((prev) => deriveState({ ...prev, passedQuizzes: [...prev.passedQuizzes, stepId] }))
  }

  const markPracticePassed = (stepId: string) => {
    setProgress((prev) => deriveState({ ...prev, passedPractices: [...prev.passedPractices, stepId] }))
  }

  const setLastVisitedStep = (topicId: string, stepId: string) => {
    setProgress((prev) => {
      if (prev.lastVisitedStep[topicId] === stepId) return prev
      return deriveState({
        ...prev,
        lastVisitedStep: {
          ...prev.lastVisitedStep,
          [topicId]: stepId,
        },
      })
    })
  }

  const helpers = useMemo(() => ({
    isStepCompleted: (stepId: string) => progress.completedSteps.includes(stepId),
    isQuizPassed: (stepId: string) => progress.passedQuizzes.includes(stepId),
    isPracticePassed: (stepId: string) => progress.passedPractices.includes(stepId),
    getTopicProgress: (topicId: string) => {
      const topic = getFlowTopicById(topicId)
      if (!topic) return 0
      const done = topic.steps.filter((step) => progress.completedSteps.includes(step.id)).length
      return topic.steps.length ? done / topic.steps.length : 0
    },
    getSubblockProgress: (subblockId: string) => {
      const subblock = flowCourseBlocks.flatMap((block) => block.subblocks).find((item) => item.id === subblockId)
      if (!subblock) return 0
      const total = subblock.themes.reduce((sum, topic) => sum + topic.steps.length, 0)
      const done = subblock.themes.reduce((sum, topic) => sum + topic.steps.filter((step) => progress.completedSteps.includes(step.id)).length, 0)
      return total ? done / total : 0
    },
    getBlockProgress: (blockId: string) => {
      const block = flowCourseBlocks.find((item) => item.id === blockId)
      if (!block) return 0
      const total = block.subblocks.reduce((sum, subblock) => sum + subblock.themes.reduce((acc, topic) => acc + topic.steps.length, 0), 0)
      const done = block.subblocks.reduce((sum, subblock) => sum + subblock.themes.reduce((acc, topic) => acc + topic.steps.filter((step) => progress.completedSteps.includes(step.id)).length, 0), 0)
      return total ? done / total : 0
    },
    getCourseProgress: () => {
      const total = flowCourseBlocks.reduce((sum, block) => sum + block.subblocks.reduce((acc, subblock) => acc + subblock.themes.reduce((topicAcc, topic) => topicAcc + topic.steps.length, 0), 0), 0)
      return total ? progress.completedSteps.length / total : 0
    },
  }), [progress])

  return {
    progress,
    markStepCompleted,
    markQuizPassed,
    markPracticePassed,
    setLastVisitedStep,
    clearProgress: () => setProgress(defaultState),
    ...helpers,
  }
}

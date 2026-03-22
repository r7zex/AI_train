import { useProgress } from '../hooks/useProgress'

export default function ProgressButton({ topicId, stepId }: { topicId: string; stepId?: string }) {
  const { getTopicProgress, markStepCompleted, isStepCompleted } = useProgress()
  const done = stepId ? isStepCompleted(stepId) : getTopicProgress(topicId) === 1

  return (
    <button
      onClick={() => stepId && markStepCompleted(stepId)}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${done ? 'border-green-300 bg-green-100 text-green-700' : 'border-gray-200 bg-gray-100 text-gray-600'}`}
    >
      {done ? '✅ Выполнено' : '⬜ Отметить шаг'}
    </button>
  )
}

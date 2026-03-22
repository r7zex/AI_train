import { flowCourseBlocks } from '../data/courseFlow'
import { useProgress } from '../hooks/useProgress'

export default function ProgressPage() {
  const { progress, getCourseProgress, getBlockProgress, clearProgress } = useProgress()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-gray-900">Progress Dashboard</h1>
      <p className="mb-8 text-gray-600">Детальный прогресс по step-based курсу хранится локально в браузере.</p>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-5">
          <div className="text-sm text-blue-700">Прогресс курса</div>
          <div className="mt-2 text-3xl font-bold text-blue-900">{Math.round(getCourseProgress() * 100)}%</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div className="text-sm text-emerald-700">Зачтённых шагов</div>
          <div className="mt-2 text-3xl font-bold text-emerald-900">{progress.completedSteps.length}</div>
        </div>
        <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50 p-5">
          <div className="text-sm text-fuchsia-700">Квизов / практик</div>
          <div className="mt-2 text-3xl font-bold text-fuchsia-900">{progress.passedQuizzes.length} / {progress.passedPractices.length}</div>
        </div>
      </div>

      <div className="space-y-4">
        {flowCourseBlocks.map((block) => (
          <div key={block.id} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xl font-semibold text-gray-900">{block.icon} {block.title}</div>
                <div className="mt-2 text-sm text-gray-600">{block.description}</div>
              </div>
              <div className="text-lg font-bold text-gray-900">{Math.round(getBlockProgress(block.id) * 100)}%</div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={clearProgress} className="mt-8 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 font-medium text-red-700">
        Сбросить прогресс
      </button>
    </div>
  )
}

import { useMemo } from 'react'
import { sections } from '../data/topics'
import { quizzes } from '../data/quizzes'
import { useProgress } from '../hooks/useProgress'

interface StoredQuizResult {
  quizId: string
  score: number
  total: number
  completedAt: string
}

function loadQuizResults(): StoredQuizResult[] {
  try {
    const raw = localStorage.getItem('ml-quiz-results')
    if (!raw) return []
    return JSON.parse(raw) as StoredQuizResult[]
  } catch {
    return []
  }
}

export default function ProgressPage() {
  const { isCompleted, clearProgress } = useProgress()

  const topicStats = useMemo(() => {
    const allTopics = sections.flatMap((s) => s.topics)
    const completedCount = allTopics.filter((t) => isCompleted(t.id)).length
    return {
      total: allTopics.length,
      completed: completedCount,
      pct: allTopics.length === 0 ? 0 : Math.round((completedCount / allTopics.length) * 100),
    }
  }, [isCompleted])

  const sectionStats = useMemo(
    () =>
      sections.map((section) => {
        const done = section.topics.filter((t) => isCompleted(t.id)).length
        const pct = section.topics.length === 0 ? 0 : Math.round((done / section.topics.length) * 100)
        return { id: section.id, title: section.title, done, total: section.topics.length, pct }
      }),
    [isCompleted],
  )

  const quizStats = useMemo(() => {
    const results = loadQuizResults()
    const byId = new Map(results.map((r) => [r.quizId, r]))
    const latest = results
      .sort((a, b) => +new Date(b.completedAt) - +new Date(a.completedAt))
      .slice(0, 10)
      .map((r) => {
        const quiz = quizzes.find((q) => q.id === r.quizId)
        return {
          ...r,
          title: quiz?.title ?? r.quizId,
          percent: r.total === 0 ? 0 : Math.round((r.score / r.total) * 100),
        }
      })

    const uniqueResults = [...byId.values()]
    const average =
      uniqueResults.length === 0
        ? 0
        : Math.round(
            uniqueResults.reduce((sum, r) => sum + (r.total === 0 ? 0 : r.score / r.total), 0) * (100 / uniqueResults.length),
          )

    return {
      done: uniqueResults.length,
      total: quizzes.length,
      average,
      latest,
    }
  }, [])

  const resetQuizzes = () => {
    localStorage.removeItem('ml-quiz-results')
    window.location.reload()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress Dashboard</h1>
        <p className="text-gray-600">
          Сводка по изученным темам и квизам. Данные хранятся локально в браузере (<code>localStorage</code>).
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <div className="text-sm text-blue-700 mb-1">Темы изучены</div>
          <div className="text-3xl font-bold text-blue-900">{topicStats.completed} / {topicStats.total}</div>
          <div className="text-sm text-blue-700 mt-1">{topicStats.pct}%</div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
          <div className="text-sm text-indigo-700 mb-1">Квизы пройдены</div>
          <div className="text-3xl font-bold text-indigo-900">{quizStats.done} / {quizStats.total}</div>
          <div className="text-sm text-indigo-700 mt-1">
            {quizStats.total === 0 ? 0 : Math.round((quizStats.done / quizStats.total) * 100)}%
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <div className="text-sm text-green-700 mb-1">Средний балл квизов</div>
          <div className="text-3xl font-bold text-green-900">{quizStats.average}%</div>
          <div className="text-sm text-green-700 mt-1">по последним попыткам</div>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Прогресс по разделам</h2>
        <div className="space-y-3">
          {sectionStats.map((section) => (
            <div key={section.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{section.title}</span>
                <span className="text-gray-500">
                  {section.done} / {section.total} ({section.pct}%)
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full">
                <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${section.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Последние квизы</h2>
        {quizStats.latest.length === 0 ? (
          <div className="text-sm text-gray-500">Попыток пока нет.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Квиз</th>
                  <th className="px-3 py-2 text-right">Результат</th>
                  <th className="px-3 py-2 text-right">Дата</th>
                </tr>
              </thead>
              <tbody>
                {quizStats.latest.map((item) => (
                  <tr key={`${item.quizId}-${item.completedAt}`} className="border-t border-gray-100">
                    <td className="px-3 py-2">{item.title}</td>
                    <td className="px-3 py-2 text-right font-medium">{item.score}/{item.total} ({item.percent}%)</td>
                    <td className="px-3 py-2 text-right text-gray-500">{new Date(item.completedAt).toLocaleString('ru-RU')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Управление прогрессом</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={clearProgress}
            className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 font-medium hover:bg-red-100 transition-colors"
          >
            Сбросить прогресс тем
          </button>
          <button
            onClick={resetQuizzes}
            className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-2.5 font-medium hover:bg-red-100 transition-colors"
          >
            Сбросить результаты квизов
          </button>
        </div>
      </section>
    </div>
  )
}


import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { quizzes } from '../data/quizzes'
import type { Quiz } from '../data/quizzes'

interface QuizResult {
  quizId: string
  score: number
  total: number
  completedAt: string
}

function loadResults(): Record<string, QuizResult> {
  try {
    const raw = localStorage.getItem('ml-quiz-results')
    if (!raw) return {}
    const arr = JSON.parse(raw) as QuizResult[]
    return Object.fromEntries(arr.map(r => [r.quizId, r]))
  } catch {
    return {}
  }
}

const sectionLabels: Record<string, string> = {
  'block-5': 'Предобработка данных',
  'block-6': 'Метрики качества',
  'block-8': 'Базовые алгоритмы ML',
  'block-9': 'Ансамбли и бустинг',
  'block-11': 'Валидация и выбор модели',
  'block-14': 'Основы нейронных сетей',
  'block-15': 'PyTorch с нуля',
}

const sectionColors: Record<string, string> = {
  'block-5': 'bg-rose-100 text-rose-700',
  'block-6': 'bg-indigo-100 text-indigo-700',
  'block-8': 'bg-sky-100 text-sky-700',
  'block-9': 'bg-orange-100 text-orange-700',
  'block-11': 'bg-teal-100 text-teal-700',
  'block-14': 'bg-violet-100 text-violet-700',
  'block-15': 'bg-amber-100 text-amber-700',
}

const sectionIcons: Record<string, string> = {
  'block-5': '🔧',
  'block-6': '📊',
  'block-8': '🌳',
  'block-9': '🎯',
  'block-11': '✅',
  'block-14': '🧠',
  'block-15': '🔥',
}

function getDifficultySummary(quiz: Quiz): string {
  const counts: Record<string, number> = { easy: 0, medium: 0, hard: 0 }
  quiz.questions.forEach(q => counts[q.difficulty]++)
  const parts: string[] = []
  if (counts.easy) parts.push(`${counts.easy} лёгк.`)
  if (counts.medium) parts.push(`${counts.medium} средн.`)
  if (counts.hard) parts.push(`${counts.hard} слож.`)
  return parts.join(' · ')
}

const QuizPage: React.FC = () => {
  const [sectionFilter, setSectionFilter] = useState<string>('all')
  const results = useMemo(() => loadResults(), [])

  const sections = useMemo(() => {
    const ids = [...new Set(quizzes.map(q => q.sectionId))]
    return ids.map(id => ({ id, label: sectionLabels[id] ?? id }))
  }, [])

  const filtered = useMemo(
    () => sectionFilter === 'all' ? quizzes : quizzes.filter(q => q.sectionId === sectionFilter),
    [sectionFilter],
  )

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Тесты по теории</h1>
        <p className="text-gray-500 text-base max-w-2xl">
          Проверьте знания по ключевым темам машинного обучения. Каждый тест содержит вопросы
          разного уровня сложности с подробными объяснениями.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-5 py-3 flex items-center gap-2">
          <span className="text-2xl font-bold text-indigo-700">{quizzes.length}</span>
          <span className="text-sm text-indigo-600">тестов</span>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl px-5 py-3 flex items-center gap-2">
          <span className="text-2xl font-bold text-green-700">
            {quizzes.reduce((s, q) => s + q.questions.length, 0)}
          </span>
          <span className="text-sm text-green-600">вопросов</span>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-3 flex items-center gap-2">
          <span className="text-2xl font-bold text-amber-700">
            {Object.keys(results).length}
          </span>
          <span className="text-sm text-amber-600">пройдено</span>
        </div>
      </div>

      {/* Section filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSectionFilter('all')}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            sectionFilter === 'all'
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
          }`}
        >
          Все разделы
        </button>
        {sections.map(s => (
          <button
            key={s.id}
            onClick={() => setSectionFilter(s.id)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              sectionFilter === s.id
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
            }`}
          >
            {sectionIcons[s.id]} {s.label}
          </button>
        ))}
      </div>

      {/* Quiz grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(quiz => {
          const result = results[quiz.id]
          const pct = result ? Math.round((result.score / result.total) * 100) : null
          const colCls = sectionColors[quiz.sectionId] ?? 'bg-gray-100 text-gray-700'

          return (
            <Link
              key={quiz.id}
              to={`/quiz/${quiz.id}`}
              className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all overflow-hidden flex flex-col"
            >
              {/* Top stripe */}
              <div className={`h-1.5 w-full ${colCls.split(' ')[0]}`} />

              <div className="p-5 flex flex-col flex-1 gap-3">
                {/* Section badge */}
                <span className={`self-start text-xs font-semibold px-2 py-0.5 rounded-full ${colCls}`}>
                  {sectionIcons[quiz.sectionId]} {sectionLabels[quiz.sectionId] ?? quiz.sectionId}
                </span>

                {/* Title & description */}
                <div>
                  <h2 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors leading-snug">
                    {quiz.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">{quiz.description}</p>
                </div>

                {/* Meta */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-auto">
                  <span>📝 {quiz.questions.length} вопросов</span>
                  <span>{getDifficultySummary(quiz)}</span>
                </div>

                {/* Completion */}
                {result ? (
                  <div className="mt-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-medium ${(pct ?? 0) >= 80 ? 'text-green-600' : (pct ?? 0) >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {pct}% — {result.score}/{result.total} правильно
                      </span>
                      <span className="text-gray-400">
                        {new Date(result.completedAt).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${(pct ?? 0) >= 80 ? 'bg-green-500' : (pct ?? 0) >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
                        style={{ width: `${pct ?? 0}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400 mt-1">Не пройден</div>
                )}
              </div>

              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs font-medium text-indigo-600 group-hover:text-indigo-800 transition-colors">
                {result ? 'Пройти ещё раз →' : 'Начать тест →'}
              </div>
            </Link>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-medium">Тестов не найдено</p>
          <p className="text-sm">Попробуйте выбрать другой раздел</p>
        </div>
      )}
    </div>
  )
}

export default QuizPage

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { SubTopic } from '../data/steps'
import { stepTypeConfig } from '../data/steps'
import QuizWidget from '../features/quiz/QuizWidget'
import { getQuizById } from '../data/quizzes'

const PROGRESS_KEY = 'ml-trainer-step-progress'

function loadProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

function saveProgress(progress: Record<string, boolean>): void {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
}

interface StepNavigatorProps {
  subTopic: SubTopic
}

export default function StepNavigator({ subTopic }: StepNavigatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState<Record<string, boolean>>(loadProgress)

  const steps = subTopic.steps
  const currentStep = steps[currentIndex]

  const markCompleted = (stepId: string) => {
    setProgress(prev => {
      const next = { ...prev, [stepId]: true }
      saveProgress(next)
      return next
    })
  }

  const handleNext = () => {
    markCompleted(currentStep.id)
    if (currentIndex < steps.length - 1) {
      setCurrentIndex(i => i + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(i => i - 1)
  }

  const completedCount = steps.filter(s => progress[s.id]).length
  const progressPct = steps.length > 0 ? (completedCount / steps.length) * 100 : 0

  useEffect(() => {
    setProgress(loadProgress())
  }, [subTopic.id])

  const cfg = stepTypeConfig[currentStep.type]

  return (
    <div className="space-y-4">
      {/* Step pills */}
      <div className="flex flex-wrap gap-2">
        {steps.map((step, i) => {
          const c = stepTypeConfig[step.type]
          const isActive = i === currentIndex
          const isDone = progress[step.id]
          return (
            <button
              key={step.id}
              onClick={() => setCurrentIndex(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                isActive
                  ? `${c.color} ring-2 ring-offset-1 ring-current scale-105`
                  : isDone
                  ? 'bg-green-50 border-green-300 text-green-700'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-400'
              }`}
            >
              <span>{isDone && !isActive ? '✓' : c.icon}</span>
              <span>{c.label}</span>
            </button>
          )
        })}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Прогресс: {completedCount}/{steps.length} шагов</span>
          <span>{Math.round(progressPct)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Current step card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Step header */}
        <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
          <h3 className="font-semibold text-gray-800 text-sm flex-1">{currentStep.title}</h3>
          <span className="text-xs text-gray-400">
            {currentIndex + 1} / {steps.length}
          </span>
        </div>

        {/* Step content */}
        <div className="p-5">
          {/* Theory / Formula / Intuition / Manual / Recap / Pitfalls / Sources */}
          {currentStep.content && (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed bg-transparent p-0 m-0">
                {currentStep.content}
              </pre>
            </div>
          )}

          {/* Quiz step */}
          {currentStep.type === 'quiz' && currentStep.quizId && (() => {
            const quiz = getQuizById(currentStep.quizId)
            return quiz ? (
              <QuizWidget quiz={quiz} />
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Квиз не найден: {currentStep.quizId}</p>
                <Link to="/quiz" className="text-blue-600 hover:underline text-sm mt-2 block">
                  Открыть все квизы →
                </Link>
              </div>
            )
          })()}

          {/* Code step */}
          {(currentStep.type === 'code' || currentStep.type === 'fill-in-code' || currentStep.type === 'debugging') && currentStep.codeTaskId && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">💻</div>
              <p className="text-gray-600 mb-4">Задача доступна в Code Practice Hub</p>
              <Link
                to="/code-practice"
                className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Открыть Code Practice →
              </Link>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Назад
          </button>

          {progress[currentStep.id] ? (
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              ✓ Шаг пройден
            </span>
          ) : (
            <button
              onClick={() => markCompleted(currentStep.id)}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
            >
              Отметить пройденным
            </button>
          )}

          <button
            onClick={handleNext}
            disabled={currentIndex === steps.length - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Далее →
          </button>
        </div>
      </div>
    </div>
  )
}

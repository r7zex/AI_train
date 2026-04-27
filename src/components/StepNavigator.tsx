import { useState } from 'react'
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

  const cfg = stepTypeConfig[currentStep.type]

  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-[270px,1fr] gap-4">
        <aside className="bg-gray-900 text-white rounded-xl p-3 h-fit">
          <div className="text-sm font-semibold mb-2">{subTopic.title}</div>
          <div className="text-xs text-gray-300 mb-3">
            Прогресс: {completedCount}/{steps.length}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5 mb-3">
            <div
              className="bg-emerald-400 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="space-y-1.5">
            {steps.map((step, i) => {
              const c = stepTypeConfig[step.type]
              const isActive = i === currentIndex
              const isDone = progress[step.id]
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full text-left rounded-lg px-2.5 py-2 text-xs border transition-colors ${
                    isActive
                      ? 'bg-white text-gray-900 border-white'
                      : isDone
                      ? 'bg-emerald-950/40 text-emerald-200 border-emerald-800'
                      : 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-1.5">{isDone && !isActive ? '✓' : c.icon}</span>
                  <span>{step.title}</span>
                </button>
              )
            })}
          </div>
        </aside>

        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{cfg.icon} {cfg.label}</span>
            <span>{currentIndex + 1} / {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </span>
          <h3 className="font-semibold text-gray-800 text-sm flex-1">{currentStep.title}</h3>
          <span className="text-xs text-gray-400">
            {currentIndex + 1} / {steps.length}
          </span>
        </div>

        <div className="p-5">
          {currentStep.content && (
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 leading-relaxed bg-transparent p-0 m-0">
                {currentStep.content}
              </pre>
            </div>
          )}

          {currentStep.type === 'quiz' && currentStep.quizId && (() => {
            const quiz = getQuizById(currentStep.quizId)
            return quiz ? (
              <QuizWidget key={quiz.id} quiz={quiz} />
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>Квиз не найден: {currentStep.quizId}</p>
                <Link to="/quiz" className="text-blue-600 hover:underline text-sm mt-2 block">
                  Открыть все квизы →
                </Link>
              </div>
            )
          })()}

          {currentStep.type === 'code' && currentStep.codeTaskId && (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">💻</div>
              <p className="text-gray-600 mb-4">Задача доступна в Code Practice Hub</p>
              <Link
                to={`/code-practice?task=${currentStep.codeTaskId}`}
                className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Открыть Code Practice →
              </Link>
            </div>
          )}
        </div>

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

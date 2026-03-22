import React, { useState, useCallback, useEffect } from 'react'
import type { Quiz, QuizQuestion } from '../../data/quizzes'

interface QuizResult {
  quizId: string
  score: number
  total: number
  completedAt: string
  answers: Record<string, string | string[] | number>
}

interface QuizWidgetProps {
  quiz: Quiz
}

type AnswerValue = string | string[] | number

function normalizeFormula(s: string): string {
  return s.replace(/\s+/g, '').toLowerCase()
}

function isCorrect(question: QuizQuestion, answer: AnswerValue): boolean {
  if (question.type === 'numeric' && typeof answer === 'number' && typeof question.correctAnswer === 'number') {
    const tol = question.tolerance ?? 0
    return Math.abs(answer - question.correctAnswer) <= tol
  }
  if (question.type === 'multiple' && Array.isArray(answer) && Array.isArray(question.correctAnswer)) {
    const a = [...answer].sort()
    const b = [...(question.correctAnswer as string[])].sort()
    return a.length === b.length && a.every((v, i) => v === b[i])
  }
  if (question.type === 'fillblank' && typeof answer === 'string' && typeof question.correctAnswer === 'string') {
    return answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
  }
  if (question.type === 'matching' && Array.isArray(answer) && question.pairs) {
    return question.pairs.every((pair, i) => (answer as string[])[i] === pair.right)
  }
  if (question.type === 'ordering' && Array.isArray(answer) && question.correctOrder) {
    const userOrder = (answer as string[]).map(Number)
    return userOrder.length === question.correctOrder.length &&
      userOrder.every((v, i) => v === question.correctOrder![i])
  }
  if (question.type === 'formula' && typeof answer === 'string' && question.formulaAnswer) {
    return normalizeFormula(answer) === normalizeFormula(question.formulaAnswer)
  }
  return answer === question.correctAnswer
}

function getPartialScore(question: QuizQuestion, answer: AnswerValue): number {
  if (question.type === 'matching' && Array.isArray(answer) && question.pairs) {
    const matched = question.pairs.filter((pair, i) => (answer as string[])[i] === pair.right).length
    return matched / question.pairs.length
  }
  if (question.type === 'ordering' && Array.isArray(answer) && question.correctOrder) {
    const userOrder = (answer as string[]).map(Number)
    const correct = question.correctOrder.filter((v, i) => userOrder[i] === v).length
    return correct / question.correctOrder.length
  }
  return isCorrect(question, answer) ? 1 : 0
}

const difficultyLabel: Record<string, string> = {
  easy: 'Лёгкий',
  medium: 'Средний',
  hard: 'Сложный',
}

const difficultyColor: Record<string, string> = {
  easy: 'text-green-600 bg-green-50',
  medium: 'text-yellow-700 bg-yellow-50',
  hard: 'text-red-600 bg-red-50',
}

const QuizWidget: React.FC<QuizWidgetProps> = ({ quiz }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const [drafts, setDrafts] = useState<Record<string, AnswerValue>>({})
  const [showAll, setShowAll] = useState(false)
  const [finished, setFinished] = useState(false)

  const questions = quiz.questions
  const currentQ = questions[currentIndex]
  const answeredCount = Object.keys(submitted).length
  const score = questions.reduce((acc, q) => {
    if (!submitted[q.id]) return acc
    if (q.type === 'matching' || q.type === 'ordering') {
      return acc + getPartialScore(q, answers[q.id])
    }
    return acc + (isCorrect(q, answers[q.id]) ? 1 : 0)
  }, 0)
  const currentDraft: AnswerValue = drafts[currentQ?.id] ?? (
    currentQ?.type === 'multiple' ? [] :
    currentQ?.type === 'ordering' && currentQ?.items ? currentQ.items.map((_, i) => String(i)) :
    ''
  )

  const saveResults = useCallback(() => {
    const finalScore = quiz.questions.reduce((acc, q) => {
      if (!submitted[q.id]) return acc
      if (q.type === 'matching' || q.type === 'ordering') {
        return acc + getPartialScore(q, answers[q.id])
      }
      return acc + (isCorrect(q, answers[q.id]) ? 1 : 0)
    }, 0)
    const stored = localStorage.getItem('ml-quiz-results')
    const all: QuizResult[] = stored ? (JSON.parse(stored) as QuizResult[]) : []
    const filtered = all.filter(r => r.quizId !== quiz.id)
    const result: QuizResult = {
      quizId: quiz.id,
      score: finalScore,
      total: quiz.questions.length,
      completedAt: new Date().toISOString(),
      answers,
    }
    localStorage.setItem('ml-quiz-results', JSON.stringify([...filtered, result]))
  }, [quiz, submitted, answers])

  useEffect(() => {
    if (finished) saveResults()
  }, [finished, saveResults])

  const handleReset = () => {
    setAnswers({})
    setSubmitted({})
    setDrafts({})
    setCurrentIndex(0)
    setFinished(false)
  }

  const isDraftEmpty = (type: string, draft: AnswerValue): boolean => {
    if (type === 'multiple' && Array.isArray(draft)) return (draft as string[]).length === 0
    if (type === 'matching' && Array.isArray(draft)) return (draft as string[]).every(v => v === '')
    if (type === 'ordering') return false
    return draft === '' || draft === undefined
  }

  const handleSubmitAnswer = (qId: string) => {
    const q = questions.find(qst => qst.id === qId)
    if (!q) return
    const defaultDraft: AnswerValue = q.type === 'multiple' ? [] : q.type === 'ordering' && q.items ? q.items.map((_, i) => String(i)) : ''
    const draft = drafts[qId] ?? defaultDraft
    if (isDraftEmpty(q.type, draft)) return
    setAnswers(prev => ({ ...prev, [qId]: draft }))
    setSubmitted(prev => ({ ...prev, [qId]: true }))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1)
    } else {
      setFinished(true)
    }
  }

  const renderInput = (q: QuizQuestion, isSubmitted: boolean) => {
    const draft: AnswerValue = drafts[q.id] ?? (q.type === 'multiple' ? [] : '')
    const answer = isSubmitted ? answers[q.id] : draft
    const correct = isSubmitted ? isCorrect(q, answers[q.id]) : null

    const feedbackBorder = isSubmitted
      ? correct ? 'border-green-500' : 'border-red-500'
      : 'border-gray-200'

    if (q.type === 'single' && q.options) {
      return (
        <div className="space-y-2">
          {q.options.map(opt => {
            const isSelected = (isSubmitted ? answers[q.id] : draft) === opt.id
            const isRight = q.correctAnswer === opt.id
            let cls = 'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors '
            if (isSubmitted) {
              if (isRight) cls += 'border-green-500 bg-green-50'
              else if (isSelected && !isRight) cls += 'border-red-500 bg-red-50'
              else cls += 'border-gray-200 bg-white'
            } else {
              cls += isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
            }
            return (
              <label key={opt.id} className={cls}>
                <input
                  type="radio"
                  name={q.id}
                  value={opt.id}
                  checked={isSelected}
                  disabled={isSubmitted}
                  onChange={() => !isSubmitted && setDrafts(prev => ({ ...prev, [q.id]: opt.id }))}
                  className="mt-0.5 shrink-0"
                />
                <span className="text-sm text-gray-800">{opt.text}</span>
                {isSubmitted && isRight && <span className="ml-auto text-green-600 text-xs font-medium shrink-0">✓ верно</span>}
              </label>
            )
          })}
        </div>
      )
    }

    if (q.type === 'multiple' && q.options) {
      const selected = Array.isArray(answer) ? answer as string[] : []
      return (
        <div className="space-y-2">
          {q.options.map(opt => {
            const isSelected = selected.includes(opt.id)
            const isRight = Array.isArray(q.correctAnswer) && (q.correctAnswer as string[]).includes(opt.id)
            let cls = 'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors '
            if (isSubmitted) {
              if (isRight) cls += 'border-green-500 bg-green-50'
              else if (isSelected && !isRight) cls += 'border-red-500 bg-red-50'
              else cls += 'border-gray-200 bg-white'
            } else {
              cls += isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
            }
            return (
              <label key={opt.id} className={cls}>
                <input
                  type="checkbox"
                  value={opt.id}
                  checked={isSelected}
                  disabled={isSubmitted}
                  onChange={() => {
                    if (isSubmitted) return
                    setDrafts(prev => {
                      const arr = Array.isArray(prev[q.id]) ? prev[q.id] as string[] : []
                      return { ...prev, [q.id]: arr.includes(opt.id) ? arr.filter(x => x !== opt.id) : [...arr, opt.id] }
                    })
                  }}
                  className="mt-0.5 shrink-0"
                />
                <span className="text-sm text-gray-800">{opt.text}</span>
                {isSubmitted && isRight && <span className="ml-auto text-green-600 text-xs font-medium shrink-0">✓ верно</span>}
              </label>
            )
          })}
        </div>
      )
    }

    if (q.type === 'truefalse') {
      const val = isSubmitted ? answers[q.id] : draft
      return (
        <div className="flex gap-3">
          {(['true', 'false'] as const).map(v => {
            const label = v === 'true' ? 'Верно' : 'Неверно'
            const isSelected = val === v
            const isRight = q.correctAnswer === v
            let cls = 'flex-1 py-3 px-4 rounded-lg border-2 font-medium text-sm transition-colors '
            if (isSubmitted) {
              if (isRight) cls += 'border-green-500 bg-green-100 text-green-800'
              else if (isSelected && !isRight) cls += 'border-red-500 bg-red-100 text-red-800'
              else cls += 'border-gray-200 bg-white text-gray-600'
            } else {
              cls += isSelected
                ? 'border-blue-500 bg-blue-50 text-blue-800'
                : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 cursor-pointer'
            }
            return (
              <button
                key={v}
                className={cls}
                disabled={isSubmitted}
                onClick={() => !isSubmitted && setDrafts(prev => ({ ...prev, [q.id]: v }))}
              >
                {label}
              </button>
            )
          })}
        </div>
      )
    }

    if (q.type === 'numeric') {
      const rawVal = isSubmitted ? answers[q.id] : draft
      const val = rawVal === undefined || rawVal === '' ? '' : String(rawVal)
      return (
        <div className="flex flex-col gap-2">
          <input
            type="number"
            step="any"
            value={val}
            disabled={isSubmitted}
            onChange={e => !isSubmitted && setDrafts(prev => ({ ...prev, [q.id]: e.target.value === '' ? '' : Number(e.target.value) }))}
            placeholder="Введите числовой ответ"
            className={`border-2 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-blue-500 ${feedbackBorder}`}
          />
          {isSubmitted && (
            <p className="text-xs text-gray-500">
              Правильный ответ: <strong>{String(q.correctAnswer)}</strong>
              {(q.tolerance ?? 0) > 0 && ` (±${q.tolerance})`}
            </p>
          )}
        </div>
      )
    }

    if (q.type === 'fillblank') {
      const rawVal = isSubmitted ? answers[q.id] : draft
      const val = rawVal === undefined ? '' : String(rawVal)
      return (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={val}
            disabled={isSubmitted}
            onChange={e => !isSubmitted && setDrafts(prev => ({ ...prev, [q.id]: e.target.value }))}
            placeholder="Введите ответ"
            className={`border-2 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-blue-500 ${feedbackBorder}`}
          />
          {isSubmitted && (
            <p className="text-xs text-gray-500">
              Правильный ответ: <strong>{String(q.correctAnswer)}</strong>
            </p>
          )}
        </div>
      )
    }

    if (q.type === 'matching' && q.pairs) {
      const selected: string[] = Array.isArray(answer) ? answer as string[] : q.pairs.map(() => '')
      const rightOptions = q.pairs.map(p => p.right)
      return (
        <div className="space-y-2">
          {q.pairs.map((pair, i) => {
            const selectedVal = isSubmitted ? ((answers[q.id] as string[])[i] ?? '') : (selected[i] ?? '')
            const isRight = selectedVal === pair.right
            let rowCls = 'flex items-center gap-3 p-3 rounded-lg border '
            if (isSubmitted) {
              rowCls += isRight ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
            } else {
              rowCls += 'border-gray-200 bg-white'
            }
            return (
              <div key={i} className={rowCls}>
                <span className="text-sm font-medium text-gray-700 w-40 shrink-0">{pair.left}</span>
                <span className="text-gray-400">→</span>
                <select
                  value={selectedVal}
                  disabled={isSubmitted}
                  onChange={e => {
                    if (isSubmitted) return
                    setDrafts(prev => {
                      const arr: string[] = Array.isArray(prev[q.id]) ? [...(prev[q.id] as string[])] : q.pairs!.map(() => '')
                      arr[i] = e.target.value
                      return { ...prev, [q.id]: arr }
                    })
                  }}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500 disabled:bg-gray-50"
                >
                  <option value="">-- выберите --</option>
                  {rightOptions.map((opt, j) => (
                    <option key={j} value={opt}>{opt}</option>
                  ))}
                </select>
                {isSubmitted && (
                  <span className={`text-xs font-medium shrink-0 ${isRight ? 'text-green-600' : 'text-red-600'}`}>
                    {isRight ? '✓' : `→ ${pair.right}`}
                  </span>
                )}
              </div>
            )
          })}
          {isSubmitted && (
            <p className="text-xs text-gray-500">
              Частичная оценка: {Math.round(getPartialScore(q, answers[q.id]) * q.pairs.length)} / {q.pairs.length}
            </p>
          )}
        </div>
      )
    }

    if (q.type === 'ordering' && q.items) {
      const currentOrder: number[] = Array.isArray(answer)
        ? (answer as string[]).map(Number)
        : q.items.map((_, i) => i)

      const moveItem = (from: number, to: number) => {
        if (isSubmitted) return
        setDrafts(prev => {
          const arr: number[] = Array.isArray(prev[q.id])
            ? [...(prev[q.id] as string[]).map(Number)]
            : q.items!.map((_, i) => i)
          const [moved] = arr.splice(from, 1)
          arr.splice(to, 0, moved)
          return { ...prev, [q.id]: arr.map(String) }
        })
      }

      return (
        <div className="space-y-2">
          {currentOrder.map((itemIdx, pos) => {
            const isCorrectPos = isSubmitted && q.correctOrder != null && q.correctOrder[pos] === itemIdx
            let cls = 'flex items-center gap-2 p-3 rounded-lg border text-sm '
            if (isSubmitted) {
              cls += isCorrectPos ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
            } else {
              cls += 'border-gray-200 bg-white'
            }
            return (
              <div key={itemIdx} className={cls}>
                <span className="text-gray-400 font-mono text-xs w-5">{pos + 1}.</span>
                <span className="flex-1 text-gray-800">{q.items![itemIdx]}</span>
                {!isSubmitted && (
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => pos > 0 && moveItem(pos, pos - 1)}
                      disabled={pos === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                    >▲</button>
                    <button
                      onClick={() => pos < currentOrder.length - 1 && moveItem(pos, pos + 1)}
                      disabled={pos === currentOrder.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-xs"
                    >▼</button>
                  </div>
                )}
                {isSubmitted && isCorrectPos && <span className="text-green-600 text-xs">✓</span>}
                {isSubmitted && !isCorrectPos && q.correctOrder != null && (
                  <span className="text-red-600 text-xs">→ поз. {q.correctOrder.indexOf(itemIdx) + 1}</span>
                )}
              </div>
            )
          })}
          {isSubmitted && (
            <p className="text-xs text-gray-500">
              Частичная оценка: {q.correctOrder != null ? q.correctOrder.filter((v, i) => currentOrder[i] === v).length : 0} / {q.items.length}
            </p>
          )}
        </div>
      )
    }

    if (q.type === 'formula') {
      const rawVal = isSubmitted ? answers[q.id] : draft
      const val = rawVal === undefined ? '' : String(rawVal)
      return (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={val}
            disabled={isSubmitted}
            onChange={e => !isSubmitted && setDrafts(prev => ({ ...prev, [q.id]: e.target.value }))}
            placeholder="Введите формулу (пробелы игнорируются)"
            className={`border-2 rounded-lg px-3 py-2 text-sm w-full font-mono focus:outline-none focus:border-blue-500 ${feedbackBorder}`}
          />
          {isSubmitted && (
            <p className="text-xs text-gray-500">
              Правильный ответ: <strong className="font-mono">{q.formulaAnswer ?? String(q.correctAnswer)}</strong>
              <span className="ml-2 text-gray-400">(пробелы и регистр игнорируются)</span>
            </p>
          )}
        </div>
      )
    }

    return null
  }

  const renderQuestion = (q: QuizQuestion, idx: number) => {
    const isSubmitted = !!submitted[q.id]
    const partial = isSubmitted && (q.type === 'matching' || q.type === 'ordering')
      ? getPartialScore(q, answers[q.id])
      : null
    const correct = isSubmitted ? (partial != null ? partial === 1 : isCorrect(q, answers[q.id])) : null
    const isPartialScore = partial != null && partial > 0 && partial < 1
    const isActive = !showAll && idx === currentIndex

    return (
      <div key={q.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Question header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
          <span className="text-xs font-medium text-gray-500">
            Вопрос {idx + 1} из {questions.length}
          </span>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor[q.difficulty]}`}>
              {difficultyLabel[q.difficulty]}
            </span>
            {isSubmitted && (
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${correct ? 'text-green-700 bg-green-100' : isPartialScore ? 'text-yellow-700 bg-yellow-100' : 'text-red-700 bg-red-100'}`}>
                {correct ? '✓ Верно' : isPartialScore ? `~ ${Math.round(partial! * 100)}%` : '✗ Неверно'}
              </span>
            )}
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-gray-900 font-medium leading-snug">{q.question}</p>

          {renderInput(q, isSubmitted)}

          {/* Explanation */}
          {isSubmitted && (
            <div className={`rounded-lg p-4 border-l-4 text-sm ${correct ? 'bg-green-50 border-green-500 text-green-900' : isPartialScore ? 'bg-yellow-50 border-yellow-500 text-yellow-900' : 'bg-red-50 border-red-500 text-red-900'}`}>
              <p className="font-semibold mb-1">{correct ? '✓ Правильно!' : isPartialScore ? `~ Частично верно (${Math.round(partial! * 100)}%)` : '✗ Неправильно'}</p>
              <p className="text-gray-700 leading-relaxed">{q.explanation}</p>
            </div>
          )}

          {/* Submit / Next buttons for current question in step mode */}
          {isActive && (
            <div className="flex gap-2 pt-1">
              {!isSubmitted ? (
                <button
                  onClick={() => handleSubmitAnswer(q.id)}
                  disabled={isDraftEmpty(currentQ.type, currentDraft)}
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Проверить
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {currentIndex < questions.length - 1 ? 'Следующий вопрос →' : 'Завершить тест'}
                </button>
              )}
            </div>
          )}

          {/* Submit button in show-all mode */}
          {showAll && !isSubmitted && (
            <button
              onClick={() => handleSubmitAnswer(q.id)}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Проверить
            </button>
          )}
        </div>
      </div>
    )
  }

  // ─── Finished screen ────────────────────────────────────────────────────────
  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const grade = pct >= 80 ? { label: 'Отлично!', color: 'text-green-700', bg: 'bg-green-50 border-green-200' }
      : pct >= 60 ? { label: 'Хорошо', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' }
      : { label: 'Нужно повторить', color: 'text-red-700', bg: 'bg-red-50 border-red-200' }

    return (
      <div className="space-y-6">
        <div className={`rounded-2xl border p-8 text-center ${grade.bg}`}>
          <div className="text-5xl font-black mb-2">
            <span className={grade.color}>{pct}%</span>
          </div>
          <p className={`text-xl font-bold mb-1 ${grade.color}`}>{grade.label}</p>
          <p className="text-gray-600 text-sm">
            Правильных ответов: {score} из {questions.length}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {questions.map((q, i) => {
            const partial = (q.type === 'matching' || q.type === 'ordering')
              ? getPartialScore(q, answers[q.id])
              : null
            const ok = partial != null ? partial === 1 : isCorrect(q, answers[q.id])
            const isPartial = partial != null && partial > 0 && partial < 1
            return (
              <div key={q.id} className={`flex items-start gap-3 p-4 rounded-lg border ${ok ? 'border-green-200 bg-green-50' : isPartial ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
                <span className={`mt-0.5 text-lg ${ok ? 'text-green-600' : isPartial ? 'text-yellow-600' : 'text-red-500'}`}>{ok ? '✓' : isPartial ? '~' : '✗'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 leading-snug">{i + 1}. {q.question}</p>
                  {isPartial && partial != null && (
                    <p className="text-xs text-yellow-700 mt-1">
                      Частично верно: {Math.round(partial * 100)}%
                    </p>
                  )}
                  {!ok && !isPartial && (
                    <p className="text-xs text-gray-500 mt-1">
                      Верный ответ: <strong>
                        {Array.isArray(q.correctAnswer) ? (q.correctAnswer as string[]).join(', ') : String(q.correctAnswer)}
                      </strong>
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={handleReset}
          className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
        >
          Начать заново
        </button>
      </div>
    )
  }

  // ─── Quiz screen ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">
            Отвечено: {answeredCount} / {questions.length}
          </span>
          {answeredCount > 0 && (
            <span className="text-sm text-gray-400">
              Правильно: {score}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowAll(v => !v)}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline"
        >
          {showAll ? 'По одному' : 'Все вопросы'}
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      {/* Questions */}
      {showAll
        ? questions.map((q, i) => renderQuestion(q, i))
        : renderQuestion(currentQ, currentIndex)
      }

      {/* Navigation dots in step mode */}
      {!showAll && (
        <div className="flex flex-wrap gap-1.5 justify-center pt-2">
          {questions.map((q, i) => {
            const isAns = !!submitted[q.id]
            const partial = isAns && (q.type === 'matching' || q.type === 'ordering')
              ? getPartialScore(q, answers[q.id])
              : null
            const ok = isAns ? (partial != null ? partial === 1 : isCorrect(q, answers[q.id])) : null
            const isPartial = partial != null && partial > 0 && partial < 1
            return (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                className={`w-7 h-7 rounded-full text-xs font-semibold transition-colors border ${
                  i === currentIndex
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : isAns
                    ? ok
                      ? 'bg-green-100 text-green-700 border-green-400'
                      : isPartial
                      ? 'bg-yellow-100 text-yellow-700 border-yellow-400'
                      : 'bg-red-100 text-red-700 border-red-400'
                    : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400'
                }`}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default QuizWidget

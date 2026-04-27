import React, { useCallback, useEffect, useMemo, useState } from 'react'
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

function normalizeFormula(value: string): string {
  return value.replace(/\s+/g, '').toLowerCase()
}

function defaultDraft(question: QuizQuestion): AnswerValue {
  if (question.type === 'multiple') return []
  if (question.type === 'matching' && question.pairs) return question.pairs.map(() => '')
  if (question.type === 'ordering' && question.items) return question.items.map((_, index) => String(index))
  return ''
}

function isCorrect(question: QuizQuestion, answer: AnswerValue): boolean {
  if (question.type === 'numeric' && typeof answer === 'number' && typeof question.correctAnswer === 'number') {
    const tolerance = question.tolerance ?? 0
    return Math.abs(answer - question.correctAnswer) <= tolerance
  }
  if (question.type === 'multiple' && Array.isArray(answer) && Array.isArray(question.correctAnswer)) {
    const actual = [...answer].sort()
    const expected = [...question.correctAnswer].sort()
    return actual.length === expected.length && actual.every((value, index) => value === expected[index])
  }
  if (question.type === 'fillblank' && typeof answer === 'string' && typeof question.correctAnswer === 'string') {
    return answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()
  }
  if (question.type === 'matching' && Array.isArray(answer) && question.pairs) {
    return question.pairs.every((pair, index) => answer[index] === pair.right)
  }
  if (question.type === 'ordering' && Array.isArray(answer) && question.correctOrder) {
    const actual = answer.map(Number)
    return actual.length === question.correctOrder.length && actual.every((value, index) => value === question.correctOrder![index])
  }
  if (question.type === 'formula' && typeof answer === 'string' && question.formulaAnswer) {
    return normalizeFormula(answer) === normalizeFormula(question.formulaAnswer)
  }
  return answer === question.correctAnswer
}

function getPartialScore(question: QuizQuestion, answer: AnswerValue): number {
  if (question.type === 'matching' && Array.isArray(answer) && question.pairs) {
    const matched = question.pairs.filter((pair, index) => answer[index] === pair.right).length
    return matched / question.pairs.length
  }
  if (question.type === 'ordering' && Array.isArray(answer) && question.correctOrder) {
    const actual = answer.map(Number)
    const matched = question.correctOrder.filter((value, index) => actual[index] === value).length
    return matched / question.correctOrder.length
  }
  return isCorrect(question, answer) ? 1 : 0
}

function isDraftEmpty(question: QuizQuestion, draft: AnswerValue): boolean {
  if (question.type === 'multiple' && Array.isArray(draft)) return draft.length === 0
  if (question.type === 'matching' && Array.isArray(draft)) return draft.every((value) => value === '')
  if (question.type === 'ordering') return false
  return draft === '' || draft === undefined
}

function formatCorrectAnswer(question: QuizQuestion) {
  if (question.type === 'single' && question.options) {
    return question.options.find((option) => option.id === question.correctAnswer)?.text ?? String(question.correctAnswer)
  }
  if (question.type === 'multiple' && question.options && Array.isArray(question.correctAnswer)) {
    return question.correctAnswer
      .map((id) => question.options?.find((option) => option.id === id)?.text ?? id)
      .join(', ')
  }
  if (question.type === 'truefalse') {
    return question.correctAnswer === 'true' ? 'Верно' : 'Неверно'
  }
  if (question.type === 'matching' && question.pairs) {
    return question.pairs.map((pair) => `${pair.left} -> ${pair.right}`).join('; ')
  }
  if (question.type === 'ordering' && question.items && question.correctOrder) {
    return question.correctOrder.map((index) => question.items?.[index]).join(' -> ')
  }
  if (question.type === 'formula') {
    return question.formulaAnswer ?? String(question.correctAnswer)
  }
  return String(question.correctAnswer)
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

const QuizAttempt: React.FC<QuizWidgetProps> = ({ quiz }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})
  const [drafts, setDrafts] = useState<Record<string, AnswerValue>>({})
  const [explanationsShown, setExplanationsShown] = useState<Record<string, boolean>>({})
  const [showAll, setShowAll] = useState(false)
  const [finished, setFinished] = useState(false)

  const questions = quiz.questions
  const currentQuestion = questions[currentIndex]

  const resetAttempt = useCallback(() => {
    setCurrentIndex(0)
    setAnswers({})
    setSubmitted({})
    setDrafts({})
    setExplanationsShown({})
    setShowAll(false)
    setFinished(false)
  }, [])

  const answeredCount = Object.keys(submitted).length
  const score = useMemo(() => questions.reduce((acc, question) => {
    if (!submitted[question.id]) return acc
    if (question.type === 'matching' || question.type === 'ordering') {
      return acc + getPartialScore(question, answers[question.id])
    }
    return acc + (isCorrect(question, answers[question.id]) ? 1 : 0)
  }, 0), [answers, questions, submitted])

  const currentDraft = currentQuestion ? drafts[currentQuestion.id] ?? defaultDraft(currentQuestion) : ''

  const saveResults = useCallback(() => {
    const stored = localStorage.getItem('ml-quiz-results')
    const all: QuizResult[] = stored ? (JSON.parse(stored) as QuizResult[]) : []
    const filtered = all.filter((result) => result.quizId !== quiz.id)
    const result: QuizResult = {
      quizId: quiz.id,
      score,
      total: questions.length,
      completedAt: new Date().toISOString(),
      answers,
    }
    localStorage.setItem('ml-quiz-results', JSON.stringify([...filtered, result]))
  }, [answers, questions.length, quiz.id, score])

  useEffect(() => {
    if (finished) saveResults()
  }, [finished, saveResults])

  if (!currentQuestion) {
    return <div className="text-[14px] text-gray-500">В тесте пока нет вопросов.</div>
  }

  const handleSubmitAnswer = (questionId: string) => {
    const question = questions.find((item) => item.id === questionId)
    if (!question) return
    const draft = drafts[questionId] ?? defaultDraft(question)
    if (isDraftEmpty(question, draft)) return
    setAnswers((prev) => ({ ...prev, [questionId]: draft }))
    setSubmitted((prev) => ({ ...prev, [questionId]: true }))
    setExplanationsShown((prev) => ({ ...prev, [questionId]: false }))
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((index) => index + 1)
      return
    }
    setFinished(true)
  }

  const toggleExplanation = (questionId: string) => {
    setExplanationsShown((prev) => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const renderInput = (question: QuizQuestion, isSubmitted: boolean, canReveal: boolean) => {
    const draft = drafts[question.id] ?? defaultDraft(question)
    const answer = isSubmitted ? answers[question.id] : draft
    const correct = isSubmitted ? isCorrect(question, answers[question.id]) : null
    const feedbackBorder = isSubmitted ? (correct ? 'border-green-500' : 'border-red-500') : 'border-gray-200'

    if (question.type === 'single' && question.options) {
      return (
        <div className="space-y-2">
          {question.options.map((option) => {
            const isSelected = answer === option.id
            const isRight = question.correctAnswer === option.id
            let cls = 'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors '
            if (isSubmitted) {
              if (isSelected) cls += isRight ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              else if (canReveal && isRight) cls += 'border-green-500 bg-green-50'
              else cls += 'border-gray-200 bg-white'
            } else {
              cls += isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
            }

            return (
              <label key={option.id} className={cls}>
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={isSelected}
                  disabled={isSubmitted}
                  onChange={() => !isSubmitted && setDrafts((prev) => ({ ...prev, [question.id]: option.id }))}
                  className="mt-0.5 shrink-0"
                />
                <span className="text-sm text-gray-800">{option.text}</span>
                {isSubmitted && isSelected && <span className="ml-auto shrink-0 text-xs font-medium text-gray-500">ваш ответ</span>}
                {isSubmitted && canReveal && !isSelected && isRight && <span className="ml-auto shrink-0 text-xs font-medium text-green-700">правильный</span>}
              </label>
            )
          })}
        </div>
      )
    }

    if (question.type === 'multiple' && question.options) {
      const selected = Array.isArray(answer) ? answer : []
      return (
        <div className="space-y-2">
          {question.options.map((option) => {
            const isSelected = selected.includes(option.id)
            const isRight = Array.isArray(question.correctAnswer) && question.correctAnswer.includes(option.id)
            let cls = 'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors '
            if (isSubmitted) {
              if (isSelected) cls += isRight ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              else if (canReveal && isRight) cls += 'border-green-500 bg-green-50'
              else cls += 'border-gray-200 bg-white'
            } else {
              cls += isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-blue-300'
            }

            return (
              <label key={option.id} className={cls}>
                <input
                  type="checkbox"
                  value={option.id}
                  checked={isSelected}
                  disabled={isSubmitted}
                  onChange={() => {
                    if (isSubmitted) return
                    setDrafts((prev) => {
                      const prevSelected = Array.isArray(prev[question.id]) ? prev[question.id] as string[] : []
                      return {
                        ...prev,
                        [question.id]: prevSelected.includes(option.id)
                          ? prevSelected.filter((item) => item !== option.id)
                          : [...prevSelected, option.id],
                      }
                    })
                  }}
                  className="mt-0.5 shrink-0"
                />
                <span className="text-sm text-gray-800">{option.text}</span>
                {isSubmitted && isSelected && <span className="ml-auto shrink-0 text-xs font-medium text-gray-500">ваш ответ</span>}
                {isSubmitted && canReveal && !isSelected && isRight && <span className="ml-auto shrink-0 text-xs font-medium text-green-700">правильный</span>}
              </label>
            )
          })}
        </div>
      )
    }

    if (question.type === 'truefalse') {
      const value = isSubmitted ? answers[question.id] : draft
      return (
        <div className="flex gap-3">
          {(['true', 'false'] as const).map((option) => {
            const label = option === 'true' ? 'Верно' : 'Неверно'
            const isSelected = value === option
            const isRight = question.correctAnswer === option
            let cls = 'flex-1 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-colors '
            if (isSubmitted) {
              if (isSelected) cls += isRight ? 'border-green-500 bg-green-100 text-green-800' : 'border-red-500 bg-red-100 text-red-800'
              else if (canReveal && isRight) cls += 'border-green-500 bg-green-100 text-green-800'
              else cls += 'border-gray-200 bg-white text-gray-600'
            } else {
              cls += isSelected
                ? 'border-blue-500 bg-blue-50 text-blue-800'
                : 'cursor-pointer border-gray-200 bg-white text-gray-700 hover:border-blue-300'
            }
            return (
              <button
                key={option}
                className={cls}
                disabled={isSubmitted}
                onClick={() => !isSubmitted && setDrafts((prev) => ({ ...prev, [question.id]: option }))}
              >
                {label}
              </button>
            )
          })}
        </div>
      )
    }

    if (question.type === 'numeric') {
      const rawValue = isSubmitted ? answers[question.id] : draft
      const value = rawValue === undefined || rawValue === '' ? '' : String(rawValue)
      return (
        <input
          type="number"
          step="any"
          value={value}
          disabled={isSubmitted}
          onChange={(event) => !isSubmitted && setDrafts((prev) => ({ ...prev, [question.id]: event.target.value === '' ? '' : Number(event.target.value) }))}
          placeholder="Введите числовой ответ"
          className={`w-full rounded-lg border-2 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none ${feedbackBorder}`}
        />
      )
    }

    if (question.type === 'fillblank') {
      const rawValue = isSubmitted ? answers[question.id] : draft
      const value = rawValue === undefined ? '' : String(rawValue)
      return (
        <input
          type="text"
          value={value}
          disabled={isSubmitted}
          onChange={(event) => !isSubmitted && setDrafts((prev) => ({ ...prev, [question.id]: event.target.value }))}
          placeholder="Введите ответ"
          className={`w-full rounded-lg border-2 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none ${feedbackBorder}`}
        />
      )
    }

    if (question.type === 'matching' && question.pairs) {
      const selected = Array.isArray(answer) ? answer : question.pairs.map(() => '')
      const rightOptions = question.pairs.map((pair) => pair.right)
      return (
        <div className="space-y-2">
          {question.pairs.map((pair, index) => {
            const selectedValue = selected[index] ?? ''
            const isRight = selectedValue === pair.right
            let rowCls = 'flex items-center gap-3 rounded-lg border p-3 '
            if (isSubmitted) rowCls += isRight ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
            else rowCls += 'border-gray-200 bg-white'

            return (
              <div key={pair.left} className={rowCls}>
                <span className="w-40 shrink-0 text-sm font-medium text-gray-700">{pair.left}</span>
                <span className="text-gray-400">→</span>
                <select
                  value={selectedValue}
                  disabled={isSubmitted}
                  onChange={(event) => {
                    if (isSubmitted) return
                    setDrafts((prev) => {
                      const next = Array.isArray(prev[question.id]) ? [...(prev[question.id] as string[])] : question.pairs!.map(() => '')
                      next[index] = event.target.value
                      return { ...prev, [question.id]: next }
                    })
                  }}
                  className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                >
                  <option value="">-- выберите --</option>
                  {rightOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {isSubmitted && <span className={`shrink-0 text-xs font-medium ${isRight ? 'text-green-600' : 'text-red-600'}`}>{isRight ? 'верно' : 'неверно'}</span>}
                {isSubmitted && canReveal && !isRight && <span className="shrink-0 text-xs text-gray-500">нужно: {pair.right}</span>}
              </div>
            )
          })}
        </div>
      )
    }

    if (question.type === 'ordering' && question.items) {
      const currentOrder = Array.isArray(answer) ? answer.map(Number) : question.items.map((_, index) => index)
      const moveItem = (from: number, to: number) => {
        if (isSubmitted) return
        setDrafts((prev) => {
          const next = Array.isArray(prev[question.id])
            ? [...(prev[question.id] as string[]).map(Number)]
            : question.items!.map((_, index) => index)
          const [moved] = next.splice(from, 1)
          next.splice(to, 0, moved)
          return { ...prev, [question.id]: next.map(String) }
        })
      }

      return (
        <div className="space-y-2">
          {currentOrder.map((itemIndex, position) => {
            const isCorrectPosition = isSubmitted && question.correctOrder != null && question.correctOrder[position] === itemIndex
            let cls = 'flex items-center gap-2 rounded-lg border p-3 text-sm '
            if (isSubmitted) cls += isCorrectPosition ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
            else cls += 'border-gray-200 bg-white'

            return (
              <div key={itemIndex} className={cls}>
                <span className="w-5 font-mono text-xs text-gray-400">{position + 1}.</span>
                <span className="min-w-0 flex-1 text-gray-800">{question.items![itemIndex]}</span>
                {!isSubmitted && (
                  <div className="flex flex-col gap-0.5">
                    <button onClick={() => position > 0 && moveItem(position, position - 1)} disabled={position === 0} className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30">▲</button>
                    <button onClick={() => position < currentOrder.length - 1 && moveItem(position, position + 1)} disabled={position === currentOrder.length - 1} className="text-xs text-gray-400 hover:text-gray-600 disabled:opacity-30">▼</button>
                  </div>
                )}
                {isSubmitted && <span className={`text-xs ${isCorrectPosition ? 'text-green-600' : 'text-red-600'}`}>{isCorrectPosition ? 'верно' : 'неверно'}</span>}
                {isSubmitted && canReveal && !isCorrectPosition && question.correctOrder && (
                  <span className="text-xs text-gray-500">позиция {question.correctOrder.indexOf(itemIndex) + 1}</span>
                )}
              </div>
            )
          })}
        </div>
      )
    }

    if (question.type === 'formula') {
      const rawValue = isSubmitted ? answers[question.id] : draft
      const value = rawValue === undefined ? '' : String(rawValue)
      return (
        <input
          type="text"
          value={value}
          disabled={isSubmitted}
          onChange={(event) => !isSubmitted && setDrafts((prev) => ({ ...prev, [question.id]: event.target.value }))}
          placeholder="Введите формулу (пробелы игнорируются)"
          className={`w-full rounded-lg border-2 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none ${feedbackBorder}`}
        />
      )
    }

    return null
  }

  const renderQuestion = (question: QuizQuestion, index: number) => {
    const isSubmitted = !!submitted[question.id]
    const answer = answers[question.id]
    const partial = isSubmitted && (question.type === 'matching' || question.type === 'ordering')
      ? getPartialScore(question, answer)
      : null
    const correct = isSubmitted ? (partial != null ? partial === 1 : isCorrect(question, answer)) : null
    const isPartialScore = partial != null && partial > 0 && partial < 1
    const isActive = !showAll && index === currentIndex
    const explanationShown = !!explanationsShown[question.id]

    return (
      <div key={question.id} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-5 py-3">
          <span className="text-xs font-medium text-gray-500">Вопрос {index + 1} из {questions.length}</span>
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${difficultyColor[question.difficulty]}`}>
              {difficultyLabel[question.difficulty]}
            </span>
            {isSubmitted && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${correct ? 'bg-green-100 text-green-700' : isPartialScore ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {correct ? 'Верно' : isPartialScore ? `Частично ${Math.round(partial! * 100)}%` : 'Неверно'}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4 p-5">
          <p className="font-medium leading-snug text-gray-900">{question.question}</p>

          {renderInput(question, isSubmitted, explanationShown)}

          {isSubmitted && (
            <div className={`rounded-lg border-l-4 p-4 text-sm ${correct ? 'border-green-500 bg-green-50 text-green-900' : isPartialScore ? 'border-yellow-500 bg-yellow-50 text-yellow-900' : 'border-red-500 bg-red-50 text-red-900'}`}>
              <p className="font-semibold">{correct ? 'Верно' : isPartialScore ? `Частично верно (${Math.round(partial! * 100)}%)` : 'Неверно'}</p>
              {!explanationShown ? (
                <button
                  type="button"
                  onClick={() => toggleExplanation(question.id)}
                  className="mt-2 text-sm font-medium text-indigo-700 underline underline-offset-2 hover:text-indigo-900"
                >
                  Показать объяснение
                </button>
              ) : (
                <div className="mt-2 space-y-2 text-gray-700">
                  <p className="leading-relaxed">{question.explanation}</p>
                  <p className="text-xs">
                    Правильный ответ: <strong>{formatCorrectAnswer(question)}</strong>
                    {question.type === 'numeric' && (question.tolerance ?? 0) > 0 && <span> (±{question.tolerance})</span>}
                    {question.type === 'formula' && <span className="ml-2 text-gray-400">(пробелы и регистр игнорируются)</span>}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleExplanation(question.id)}
                    className="text-xs font-medium text-gray-500 underline underline-offset-2 hover:text-gray-700"
                  >
                    Скрыть объяснение
                  </button>
                </div>
              )}
            </div>
          )}

          {isActive && (
            <div className="flex gap-2 pt-1">
              {!isSubmitted ? (
                <button
                  onClick={() => handleSubmitAnswer(question.id)}
                  disabled={isDraftEmpty(currentQuestion, currentDraft)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Проверить
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  {currentIndex < questions.length - 1 ? 'Следующий вопрос →' : 'Завершить тест'}
                </button>
              )}
            </div>
          )}

          {showAll && !isSubmitted && (
            <button
              onClick={() => handleSubmitAnswer(question.id)}
              disabled={isDraftEmpty(question, drafts[question.id] ?? defaultDraft(question))}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Проверить
            </button>
          )}
        </div>
      </div>
    )
  }

  if (finished) {
    const percent = Math.round((score / questions.length) * 100)
    const grade = percent >= 80
      ? { label: 'Отлично', color: 'text-green-700', bg: 'bg-green-50 border-green-200' }
      : percent >= 60
        ? { label: 'Хорошо', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' }
        : { label: 'Нужно повторить', color: 'text-red-700', bg: 'bg-red-50 border-red-200' }

    return (
      <div className="space-y-6">
        <div className={`rounded-2xl border p-8 text-center ${grade.bg}`}>
          <div className="mb-2 text-5xl font-black">
            <span className={grade.color}>{percent}%</span>
          </div>
          <p className={`mb-1 text-xl font-bold ${grade.color}`}>{grade.label}</p>
          <p className="text-sm text-gray-600">Правильных ответов: {score} из {questions.length}</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {questions.map((question, index) => {
            const partial = (question.type === 'matching' || question.type === 'ordering')
              ? getPartialScore(question, answers[question.id])
              : null
            const ok = partial != null ? partial === 1 : isCorrect(question, answers[question.id])
            const isPartial = partial != null && partial > 0 && partial < 1
            return (
              <div key={question.id} className={`flex items-start gap-3 rounded-lg border p-4 ${ok ? 'border-green-200 bg-green-50' : isPartial ? 'border-yellow-200 bg-yellow-50' : 'border-red-200 bg-red-50'}`}>
                <span className={`mt-0.5 text-lg ${ok ? 'text-green-600' : isPartial ? 'text-yellow-600' : 'text-red-500'}`}>{ok ? '✓' : isPartial ? '~' : '✗'}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug text-gray-800">{index + 1}. {question.question}</p>
                  <p className="mt-1 text-xs text-gray-600">
                    {ok ? 'Ответ засчитан.' : 'Ответ не засчитан. Откройте объяснение в вопросе, чтобы увидеть разбор.'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <button
          onClick={resetAttempt}
          className="w-full rounded-xl bg-indigo-600 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Начать заново
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Отвечено: {answeredCount} / {questions.length}</span>
          {answeredCount > 0 && <span className="text-sm text-gray-400">Правильно: {score}</span>}
        </div>
        <button
          onClick={() => setShowAll((value) => !value)}
          className="text-xs font-medium text-indigo-600 underline hover:text-indigo-800"
        >
          {showAll ? 'По одному' : 'Все вопросы'}
        </button>
      </div>

      <div className="h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${(answeredCount / questions.length) * 100}%` }}
        />
      </div>

      {showAll ? questions.map((question, index) => renderQuestion(question, index)) : renderQuestion(currentQuestion, currentIndex)}

      {!showAll && (
        <div className="flex flex-wrap justify-center gap-1.5 pt-2">
          {questions.map((question, index) => {
            const isAnswered = !!submitted[question.id]
            const partial = isAnswered && (question.type === 'matching' || question.type === 'ordering')
              ? getPartialScore(question, answers[question.id])
              : null
            const ok = isAnswered ? (partial != null ? partial === 1 : isCorrect(question, answers[question.id])) : null
            const isPartial = partial != null && partial > 0 && partial < 1
            return (
              <button
                key={question.id}
                onClick={() => setCurrentIndex(index)}
                className={`h-7 w-7 rounded-full border text-xs font-semibold transition-colors ${
                  index === currentIndex
                    ? 'border-indigo-600 bg-indigo-600 text-white'
                    : isAnswered
                      ? ok
                        ? 'border-green-400 bg-green-100 text-green-700'
                        : isPartial
                          ? 'border-yellow-400 bg-yellow-100 text-yellow-700'
                          : 'border-red-400 bg-red-100 text-red-700'
                      : 'border-gray-300 bg-white text-gray-500 hover:border-gray-400'
                }`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

const QuizWidget: React.FC<QuizWidgetProps> = ({ quiz }) => {
  return <QuizAttempt key={quiz.id} quiz={quiz} />
}

export default QuizWidget

import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { courseBlocks, getPrevNextTheme, getThemeById, type CodeTask, type LessonStep, type QuizQuestion } from '../data/course'

const STEP_PROGRESS_KEY = 'stepik-like-progress'

function loadStepProgress(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STEP_PROGRESS_KEY)
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

function saveStepProgress(progress: Record<string, boolean>) {
  localStorage.setItem(STEP_PROGRESS_KEY, JSON.stringify(progress))
}

function QuizStepCard({ question, stepId, onComplete }: { question: QuizQuestion; stepId: string; onComplete: () => void }) {
  const [answer, setAnswer] = useState<string>('')
  const [submitted, setSubmitted] = useState(false)

  const normalizedCorrect = String(question.correctAnswer).trim().toLowerCase()
  const isCorrect = useMemo(() => {
    if (!submitted) return false
    if (question.kind === 'numeric') {
      const userValue = Number(answer)
      const correctValue = Number(question.correctAnswer)
      return Number.isFinite(userValue) && Math.abs(userValue - correctValue) <= (question.tolerance ?? 0)
    }
    return answer.trim().toLowerCase() === normalizedCorrect
  }, [answer, normalizedCorrect, question.correctAnswer, question.kind, question.tolerance, submitted])

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-black/8 bg-white p-8">
        <div className="mb-4 inline-flex rounded-full bg-[#eef8ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#2e7d32]">
          Step quiz
        </div>
        <h3 className="text-[30px] font-bold leading-tight text-[#111]">{question.prompt}</h3>

        <div className="mt-8 space-y-3">
          {question.kind === 'single' && question.options?.map((option) => (
            <label key={option} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/10 bg-[#fbfbfa] p-4 transition hover:border-[#69d05c]">
              <input type="radio" name={stepId} checked={answer === option} onChange={() => setAnswer(option)} className="mt-1" />
              <span className="text-base leading-7 text-[#2a2a2a]">{option}</span>
            </label>
          ))}

          {question.kind === 'truefalse' && ['true', 'false'].map((option) => (
            <label key={option} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/10 bg-[#fbfbfa] p-4 transition hover:border-[#69d05c]">
              <input type="radio" name={stepId} checked={answer === option} onChange={() => setAnswer(option)} className="mt-1" />
              <span className="text-base leading-7 text-[#2a2a2a]">{option === 'true' ? 'Верно' : 'Неверно'}</span>
            </label>
          ))}

          {(question.kind === 'fillblank' || question.kind === 'numeric') && (
            <input
              type={question.kind === 'numeric' ? 'number' : 'text'}
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              placeholder={question.kind === 'numeric' ? 'Введите число' : 'Введите ответ'}
              className="w-full rounded-2xl border border-black/10 bg-[#fbfbfa] px-4 py-4 text-base outline-none transition focus:border-[#69d05c]"
            />
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setSubmitted(true)
              if ((question.kind === 'numeric' && Number.isFinite(Number(answer)) && isCorrect) || (question.kind !== 'numeric' && isCorrect)) {
                onComplete()
              }
            }}
            className="rounded-xl bg-[#69d05c] px-6 py-3 text-sm font-semibold text-[#101010]"
          >
            Отправить
          </button>
          {submitted && (
            <span className={`rounded-full px-4 py-2 text-sm font-semibold ${isCorrect ? 'bg-[#eef8ea] text-[#2e7d32]' : 'bg-[#fff0f0] text-[#b64c4c]'}`}>
              {isCorrect ? 'Верно' : 'Пока неверно'}
            </span>
          )}
        </div>
      </div>

      {submitted && (
        <div className="rounded-[24px] border border-black/8 bg-[#f7f7f5] p-6">
          <div className="text-sm font-semibold text-[#202020]">Разбор ответа</div>
          <p className="mt-2 text-sm leading-7 text-[#5d5d5d]">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}

function CodeStepCard({ task, onComplete }: { task: CodeTask; onComplete: () => void }) {
  const [code, setCode] = useState(task.starterCode)
  const [checked, setChecked] = useState<null | { passed: boolean; matched: string[]; missed: string[] }>(null)

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-black/8 bg-white p-8">
        <div className="flex flex-col gap-4 border-b border-black/8 pb-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-sm font-semibold text-[#2e7d32]">Практика stdin → stdout</div>
            <h3 className="mt-2 text-[32px] font-bold leading-tight text-[#111]">{task.title}</h3>
            <p className="mt-3 max-w-4xl text-base leading-8 text-[#595959]">{task.statement}</p>
          </div>
          <div className="rounded-[18px] bg-[#eef8ea] px-4 py-4 text-sm leading-7 text-[#204f28]">
            <div><strong>Hidden tests:</strong> {task.hiddenTests.length}</div>
            <div><strong>Формат:</strong> Python 3.10</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr,320px]">
          <div className="space-y-5">
            <div className="rounded-2xl border border-black/8 bg-[#fafaf8] p-5">
              <div className="text-sm font-semibold text-[#111]">Формат ввода</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-[#5b5b5b]">
                {task.inputFormat.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="rounded-2xl border border-black/8 bg-[#fafaf8] p-5">
              <div className="text-sm font-semibold text-[#111]">Формат вывода</div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-7 text-[#5b5b5b]">
                {task.outputFormat.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-black/8 bg-[#fafaf8] p-5">
                <div className="text-sm font-semibold text-[#111]">Sample Input</div>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-white p-4 font-mono text-sm leading-7 text-[#222]">{task.sampleInput}</pre>
              </div>
              <div className="rounded-2xl border border-black/8 bg-[#fafaf8] p-5">
                <div className="text-sm font-semibold text-[#111]">Sample Output</div>
                <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl bg-white p-4 font-mono text-sm leading-7 text-[#222]">{task.sampleOutput}</pre>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-black/8 bg-[#f8fbf6] p-5">
            <div className="text-sm font-semibold text-[#111]">Hidden-тесты</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-[#5b5b5b]">
              {task.hiddenTests.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </aside>
        </div>

        <div className="mt-8 grid gap-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold text-[#111]">Напишите программу. Тестируется через stdin → stdout</div>
            <div className="rounded-xl border border-black/10 bg-[#fafaf8] px-4 py-2 text-sm font-semibold text-[#2f2f2f]">Python 3.10</div>
          </div>
          <textarea
            value={code}
            onChange={(event) => setCode(event.target.value)}
            spellCheck={false}
            className="min-h-[320px] w-full rounded-[24px] border border-black/10 bg-[#fffefc] p-5 font-mono text-sm leading-7 text-[#222] outline-none transition focus:border-[#69d05c]"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                const matched = task.checks.filter((check) => code.includes(check))
                const missed = task.checks.filter((check) => !code.includes(check))
                const passed = missed.length === 0
                setChecked({ passed, matched, missed })
                if (passed) onComplete()
              }}
              className="rounded-xl bg-[#69d05c] px-6 py-3 text-sm font-semibold text-[#101010]"
            >
              Отправить
            </button>
            <button
              type="button"
              onClick={() => setCode(task.starterCode)}
              className="rounded-xl bg-[#111] px-6 py-3 text-sm font-semibold text-white"
            >
              Сбросить код
            </button>
          </div>
        </div>
      </div>

      {checked && (
        <div className={`rounded-[24px] border p-6 ${checked.passed ? 'border-[#caebc5] bg-[#eef8ea]' : 'border-[#f0d5d5] bg-[#fff7f7]'}`}>
          <div className="text-sm font-semibold text-[#111]">Результат проверки</div>
          <p className="mt-2 text-sm leading-7 text-[#4f4f4f]">
            {checked.passed
              ? 'Все ключевые шаблоны обнаружены: базовый локальный checker считает шаг выполненным.'
              : 'Проверка не пройдена: в коде не хватает некоторых ключевых элементов решения.'}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-[#2e7d32]">Найдено</div>
              <ul className="mt-2 list-disc pl-5 text-sm leading-7 text-[#4f4f4f]">
                {checked.matched.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#b64c4c]">Нужно добавить</div>
              <ul className="mt-2 list-disc pl-5 text-sm leading-7 text-[#4f4f4f]">
                {checked.missed.length > 0 ? checked.missed.map((item) => <li key={item}>{item}</li>) : <li>Ничего — всё ок.</li>}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function TheoryStep({ step }: { step: LessonStep }) {
  return (
    <article className="rounded-[24px] border border-black/8 bg-white p-8">
      <h3 className="text-[34px] font-bold leading-tight text-[#111]">{step.title}</h3>
      {step.note && <div className="mt-3 rounded-2xl bg-[#eef4fb] px-4 py-3 text-sm text-[#3b5b78]">{step.note}</div>}
      <div className="mt-6 space-y-4 text-[18px] leading-9 text-[#2a2a2a]">
        {step.content?.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      {step.codeExample && (
        <pre className="mt-8 overflow-x-auto rounded-[20px] bg-[#f3f3f0] p-5 font-mono text-sm leading-7 text-[#1e1e1e]">{step.codeExample}</pre>
      )}
    </article>
  )
}

function ListStep({ step }: { step: LessonStep }) {
  return (
    <article className="rounded-[24px] border border-black/8 bg-white p-8">
      <h3 className="text-[34px] font-bold leading-tight text-[#111]">{step.title}</h3>
      <div className="mt-6 space-y-4">
        {step.content?.map((line) => (
          <div key={line} className="rounded-2xl border border-black/8 bg-[#fafaf8] p-5 text-base leading-8 text-[#2e2e2e] whitespace-pre-line">
            {line}
          </div>
        ))}
      </div>
    </article>
  )
}

function renderStep(step: LessonStep, markCompleted: () => void) {
  switch (step.type) {
    case 'quiz':
      return step.quiz ? <QuizStepCard question={step.quiz} stepId={step.id} onComplete={markCompleted} /> : null
    case 'code':
      return step.codeTask ? <CodeStepCard task={step.codeTask} onComplete={markCompleted} /> : null
    case 'pitfalls':
    case 'interview':
    case 'cheatsheet':
      return <ListStep step={step} />
    case 'theory':
    default:
      return <TheoryStep step={step} />
  }
}

export default function TopicDetailPage() {
  const { topicId } = useParams<{ topicId: string }>()
  const theme = topicId ? getThemeById(topicId) : null
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState<Record<string, boolean>>(loadStepProgress)

  if (!theme) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-[#111]">Тема не найдена</h1>
        <Link to="/topics" className="mt-4 inline-block text-[#2e7d32] hover:underline">Вернуться к структуре курса</Link>
      </div>
    )
  }

  const block = courseBlocks.find((item) => item.id === theme.blockId)
  const subblock = block?.subblocks.find((item) => item.id === theme.subblockId)
  const step = theme.steps[stepIndex]
  const completedSteps = theme.steps.filter((item) => progress[item.id]).length
  const stats = getPrevNextTheme(theme.id)

  const markCompleted = () => {
    setProgress((prev) => {
      const next = { ...prev, [step.id]: true }
      saveStepProgress(next)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-[#f4f4f1]">
      <div className="border-b border-black/10 bg-[#202020] text-white">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-4 lg:px-6">
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
            {theme.steps.map((item, index) => {
              const active = index === stepIndex
              const done = progress[item.id]
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStepIndex(index)}
                  className={`relative h-8 min-w-8 rounded-[6px] border text-xs font-bold transition ${
                    active
                      ? 'border-[#d8f3d0] bg-[#69d05c] text-[#101010] shadow-[0_0_0_2px_rgba(255,255,255,0.18)]'
                      : done
                      ? 'border-[#7ad86d] bg-[#69d05c] text-[#101010]'
                      : 'border-[#7ad86d] bg-transparent text-[#8ae179]'
                  }`}
                >
                  {step.type === 'quiz' ? '?' : step.type === 'code' ? '▸' : index + 1}
                  {active && <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[9px] border-t-[10px] border-x-transparent border-t-white/95" />}
                </button>
              )
            })}
          </div>

          <div className="flex flex-col gap-3 border-t border-white/10 pt-4 md:flex-row md:items-center md:justify-between">
            <div className="text-2xl font-semibold">{block?.order}.{subblock?.order}.{theme.order} {theme.title}</div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <span>{completedSteps} из {theme.steps.length} шагов пройдено</span>
              <span>{theme.quizQuestions.length} из {theme.quizQuestions.length} квизов доступно</span>
              <span>{theme.codeTasks.length} из {theme.codeTasks.length} код-практик доступно</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1440px] gap-0 lg:grid-cols-[300px,1fr]">
        <aside className="border-r border-black/10 bg-[#1f1f1f] text-white">
          <div className="sticky top-[72px] max-h-[calc(100vh-72px)] overflow-y-auto px-4 py-6 lg:px-5">
            <div className="rounded-[24px] bg-white/6 p-4">
              <div className="text-lg font-bold">{block?.title}</div>
              <div className="mt-1 text-sm leading-6 text-white/65">{block?.description}</div>
              <div className="mt-4 text-sm font-semibold text-white">Прогресс по теме: {completedSteps}/{theme.steps.length}</div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-[#69d05c]" style={{ width: `${(completedSteps / theme.steps.length) * 100}%` }} />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {block?.subblocks.map((sidebarSubblock) => (
                <div key={sidebarSubblock.id}>
                  <div className="mb-2 text-sm font-semibold text-white/90">{block.order}.{sidebarSubblock.order} {sidebarSubblock.title}</div>
                  <div className="space-y-2">
                    {sidebarSubblock.themes.map((sidebarTheme) => (
                      <Link
                        key={sidebarTheme.id}
                        to={`/topics/${sidebarTheme.id}`}
                        className={`block rounded-r-[18px] border-l-4 px-4 py-3 text-sm leading-6 transition ${
                          sidebarTheme.id === theme.id
                            ? 'border-[#69d05c] bg-[#69d05c] text-[#101010]'
                            : 'border-transparent bg-white/5 text-white/72 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {block.order}.{sidebarSubblock.order}.{sidebarTheme.order} {sidebarTheme.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="px-4 py-6 lg:px-8">
          <div className="mb-5 rounded-[24px] border border-black/10 bg-white px-6 py-5">
            <div className="text-sm font-semibold text-[#2e7d32]">{block?.title} → {subblock?.title}</div>
            <h1 className="mt-2 text-3xl font-bold text-[#111]">{theme.title}</h1>
            <p className="mt-3 max-w-4xl text-base leading-8 text-[#5f5f5f]">{theme.summary}</p>
          </div>

          {renderStep(step, markCompleted)}

          <div className="mt-6 flex flex-col gap-4 rounded-[24px] border border-black/10 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
                className="rounded-xl border border-black/10 bg-[#fafaf8] px-5 py-3 text-sm font-semibold text-[#222]"
              >
                Назад
              </button>
              <button
                type="button"
                onClick={() => {
                  markCompleted()
                  setStepIndex((current) => Math.min(theme.steps.length - 1, current + 1))
                }}
                className="rounded-xl bg-[#69d05c] px-5 py-3 text-sm font-semibold text-[#101010]"
              >
                Следующий шаг
              </button>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              {stats.prev && (
                <Link to={`/topics/${stats.prev.id}`} className="rounded-xl border border-black/10 bg-[#fafaf8] px-4 py-3 font-semibold text-[#222]">
                  ← {stats.prev.title}
                </Link>
              )}
              {stats.next && (
                <Link to={`/topics/${stats.next.id}`} className="rounded-xl border border-black/10 bg-[#fafaf8] px-4 py-3 font-semibold text-[#222]">
                  {stats.next.title} →
                </Link>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-[24px] border border-black/10 bg-[#1f1f1f] p-6 text-white">
            <div className="text-lg font-bold">Шпаргалка подблока</div>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              {subblock?.cheatsheet.slice(0, 10).map((item) => (
                <div key={item} className="rounded-2xl bg-white/8 px-4 py-3 text-sm leading-7 text-white/78">{item}</div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

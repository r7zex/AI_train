import { useEffect, useMemo, useState } from 'react'
import CodeEditor from '../components/CodeEditor'
import { Link, useParams } from 'react-router-dom'
import QuizWidget from '../features/quiz/QuizWidget'
import { flowCourseBlocks, getFlowPrevNextTopic, getFlowTopicById, stepTypeMeta, type FlowStep, type PracticeTask } from '../data/courseFlow'
import { judgeTask, type JudgeRunResult } from '../lib/practiceEngine'
import { useProgress } from '../hooks/useProgress'

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} />
    </div>
  )
}

function FlowSidebar({
  topicId,
  activeStepId,
  progress,
  getTopicProgress,
  getSubblockProgress,
  getBlockProgress,
}: {
  topicId: string
  activeStepId: string
  progress: ReturnType<typeof useProgress>['progress']
  getTopicProgress: ReturnType<typeof useProgress>['getTopicProgress']
  getSubblockProgress: ReturnType<typeof useProgress>['getSubblockProgress']
  getBlockProgress: ReturnType<typeof useProgress>['getBlockProgress']
}) {
  const [openBlocks, setOpenBlocks] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(flowCourseBlocks.map((block) => [block.id, true])),
  )
  const [openSubblocks, setOpenSubblocks] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(flowCourseBlocks.flatMap((block) => block.subblocks.map((subblock) => [subblock.id, true]))),
  )

  const completedSteps = new Set(progress.completedSteps)

  return (
    <aside className="sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto border-r border-slate-200 bg-[#0f172a] text-slate-100">
      <div className="w-[330px] space-y-5 px-5 py-5">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">Course navigation</div>
          <div className="mt-2 text-xl font-semibold">Локальный ML/DL-тренажёр</div>
          <p className="mt-2 text-sm leading-6 text-slate-300">Структура курса разворачивается по блокам, подблокам и темам. Внутри выбранной темы шаги отображаются прямо в дереве слева.</p>
        </div>

        {flowCourseBlocks.map((block) => {
          const blockOpen = openBlocks[block.id]
          const blockProgress = getBlockProgress(block.id)
          return (
            <div key={block.id} className="space-y-3">
              <button
                type="button"
                onClick={() => setOpenBlocks((prev) => ({ ...prev, [block.id]: !prev[block.id] }))}
                className="flex w-full items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left hover:bg-white/10"
              >
                <div>
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Блок {block.order}</div>
                  <div className="mt-1 text-base font-semibold">{block.icon} {block.title}</div>
                </div>
                <span className="text-sm text-slate-300">{blockOpen ? '−' : '+'}</span>
              </button>
              <ProgressBar value={blockProgress} />

              {blockOpen && (
                <div className="space-y-4 pl-2">
                  {block.subblocks.map((subblock) => {
                    const subOpen = openSubblocks[subblock.id]
                    const subProgress = getSubblockProgress(subblock.id)
                    return (
                      <div key={subblock.id} className="space-y-2">
                        <button
                          type="button"
                          onClick={() => setOpenSubblocks((prev) => ({ ...prev, [subblock.id]: !prev[subblock.id] }))}
                          className="flex w-full items-start justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 text-left hover:bg-white/10"
                        >
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Подблок</div>
                            <div className="mt-1 text-sm font-medium text-slate-100">{block.order}.{subblock.order} {subblock.title}</div>
                          </div>
                          <span className="text-sm text-slate-300">{subOpen ? '−' : '+'}</span>
                        </button>
                        <ProgressBar value={subProgress} />

                        {subOpen && (
                          <div className="space-y-2 pl-4">
                            {subblock.themes.map((theme) => {
                              const active = theme.id === topicId
                              const topicProgress = getTopicProgress(theme.id)
                              const isComplete = progress.completedTopics.includes(theme.id)
                              const isInProgress = topicProgress > 0 && topicProgress < 1
                              return (
                                <div key={theme.id} className="space-y-2">
                                  <Link
                                    to={`/topics/${theme.id}`}
                                    className={`block rounded-2xl border px-4 py-3 transition ${
                                      active
                                        ? 'border-emerald-400 bg-emerald-400/20 text-white'
                                        : 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div>
                                        <div className="text-sm font-medium">{theme.title}</div>
                                        <div className="mt-1 text-xs text-slate-400">{Math.round(topicProgress * 100)}% завершено</div>
                                      </div>
                                      <div className={`rounded-full px-2 py-1 text-[10px] font-semibold ${isComplete ? 'bg-emerald-400 text-slate-950' : isInProgress ? 'bg-amber-300 text-slate-950' : 'bg-slate-700 text-slate-100'}`}>
                                        {isComplete ? 'done' : isInProgress ? 'in progress' : 'todo'}
                                      </div>
                                    </div>
                                  </Link>

                                  {active && (
                                    <div className="space-y-2 pl-3">
                                      {theme.steps.map((step, index) => {
                                        const meta = stepTypeMeta[step.type]
                                        const done = completedSteps.has(step.id)
                                        const selected = step.id === activeStepId
                                        return (
                                          <a
                                            key={step.id}
                                            href={`#${step.id}`}
                                            className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                                              selected
                                                ? 'border-emerald-300 bg-emerald-300/15 text-white'
                                                : done
                                                ? 'border-emerald-900 bg-emerald-500/10 text-emerald-200'
                                                : 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10'
                                            }`}
                                          >
                                            <span className="grid h-8 w-8 place-items-center rounded-full bg-slate-900/50 text-sm">{meta.icon}</span>
                                            <span className="min-w-0 flex-1">
                                              <span className="block truncate font-medium">{index + 1}. {step.title}</span>
                                              <span className="block text-xs text-slate-400">{meta.short}</span>
                                            </span>
                                            <span className="text-xs">{done ? '✓' : '○'}</span>
                                          </a>
                                        )
                                      })}
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}

function PracticeRunner({ task, onPassed }: { task: PracticeTask; onPassed: () => void }) {
  const [code, setCode] = useState(task.starterCode)
  const [result, setResult] = useState<JudgeRunResult | null>(null)

  const runJudge = (includeHidden: boolean) => {
    const next = judgeTask(task, code, includeHidden)
    setResult(next)
    if (includeHidden && next.passed) onPassed()
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px,1fr,320px]">
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-fuchsia-600">Statement panel</div>
          <h4 className="mt-2 text-xl font-semibold text-slate-900">{task.title}</h4>
          <p className="mt-3 text-sm leading-7 text-slate-600">{task.statement}</p>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-900">Что проверяет judge</div>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
            {task.tips.map((tip) => <li key={tip}>{tip}</li>)}
          </ul>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm font-semibold text-slate-900">Sample tests</div>
          <div className="mt-3 space-y-3 text-xs text-slate-600">
            {task.sampleTests.map((sample) => (
              <div key={sample.id} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="font-semibold text-slate-800">{sample.description}</div>
                {'input' in sample && sample.input && <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-2">{sample.input}</pre>}
                {'args' in sample && sample.args && <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-2">args: {JSON.stringify(sample.args)}</pre>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-indigo-600">Editor panel</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">JavaScript sandbox</div>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Tab = indent</div>
        </div>

        <CodeEditor value={code} onChange={setCode} height={420} />

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => runJudge(false)} className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Запустить код
          </button>
          <button type="button" onClick={() => runJudge(true)} className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950">
            Отправить решение
          </button>
          <button type="button" onClick={() => setCode(task.starterCode)} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700">
            Сбросить
          </button>
          {task.solution && (
            <details className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
              <summary className="cursor-pointer font-semibold">Показать решение</summary>
              <pre className="mt-3 overflow-auto whitespace-pre-wrap rounded-xl bg-white p-3 text-xs">{task.solution}</pre>
            </details>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-emerald-600">Result panel</div>
          <div className="mt-1 text-lg font-semibold text-slate-900">Результат запуска</div>
        </div>

        <div className="rounded-2xl bg-slate-50 p-4">
          <div className="text-sm font-semibold text-slate-900">Hidden tests panel</div>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
            {task.hiddenTests.map((hidden) => <li key={hidden.id}>{hidden.description}</li>)}
          </ul>
        </div>

        {result ? (
          <div className="space-y-4">
            <div className={`rounded-2xl border px-4 py-3 text-sm ${result.passed ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
              <div className="font-semibold">{result.passed ? 'passed' : 'failed'} · score {result.score}%</div>
              {result.runtimeError && <div className="mt-2 whitespace-pre-wrap font-mono text-xs">{result.runtimeError}</div>}
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900">Structural checks</div>
              <ul className="mt-2 space-y-2 text-sm text-slate-600">
                {result.structuralFeedback.length > 0 ? result.structuralFeedback.map((line) => <li key={line}>{line}</li>) : <li>Дополнительных structural checks нет.</li>}
              </ul>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900">Sample tests</div>
              <div className="mt-2 space-y-3">
                {result.sampleResults.map((sample) => (
                  <div key={sample.id} className="rounded-2xl border border-slate-200 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-slate-800">{sample.description}</span>
                      <span className={sample.passed ? 'text-emerald-600' : 'text-rose-600'}>{sample.passed ? '✓' : '✗'}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">expected: {sample.expected}</div>
                    <div className="text-xs text-slate-500">actual: {sample.actual}</div>
                    {sample.diff && <pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-2 text-xs text-slate-700">{sample.diff}</pre>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-slate-900">Hidden tests</div>
              <div className="mt-2 space-y-3">
                {result.hiddenResults.length > 0 ? result.hiddenResults.map((hidden) => (
                  <div key={hidden.id} className="rounded-2xl border border-slate-200 p-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-slate-800">{hidden.description}</span>
                      <span className={hidden.passed ? 'text-emerald-600' : 'text-rose-600'}>{hidden.passed ? '✓' : '✗'}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">expected: {hidden.expected}</div>
                    <div className="text-xs text-slate-500">actual: {hidden.actual}</div>
                    {hidden.diff && <pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-2 text-xs text-slate-700">{hidden.diff}</pre>}
                  </div>
                )) : <div className="text-sm text-slate-500">Нажмите «Отправить решение», чтобы запустить hidden tests.</div>}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">Сначала нажмите «Запустить код» на sample tests или сразу «Отправить решение» для полной проверки.</div>
        )}
      </section>
    </div>
  )
}

function StepCard({
  step,
  topicId,
  onStepComplete,
  isCompleted,
}: {
  step: FlowStep
  topicId: string
  onStepComplete: (stepId: string) => void
  isCompleted: boolean
}) {
  const meta = stepTypeMeta[step.type]
  const [taskIndex, setTaskIndex] = useState(0)

  return (
    <article id={step.id} className="scroll-mt-24 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.accent}`}>
            <span>{meta.icon}</span>
            <span>{meta.label}</span>
          </div>
          <h2 className="mt-3 text-3xl font-bold text-slate-950">{step.title}</h2>
          <p className="mt-3 max-w-4xl text-base leading-8 text-slate-600">{step.summary}</p>
        </div>
        <button
          type="button"
          onClick={() => onStepComplete(step.id)}
          className={`rounded-2xl px-4 py-3 text-sm font-semibold ${isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-900 text-white'}`}
        >
          {isCompleted ? 'Шаг зачтён ✓' : 'Отметить шаг выполненным'}
        </button>
      </div>

      {step.paragraphs && (
        <div className="mt-6 space-y-4 text-[17px] leading-8 text-slate-700">
          {step.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      )}

      {step.bullets && (
        <div className="mt-6 space-y-3">
          {step.bullets.map((bullet) => (
            <div key={bullet} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">
              {bullet}
            </div>
          ))}
        </div>
      )}

      {step.formulaCards && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {step.formulaCards.map((card) => (
            <div key={card.expression} className="rounded-3xl border border-violet-100 bg-violet-50/70 p-5">
              <div className="text-xs uppercase tracking-[0.18em] text-violet-600">{card.label}</div>
              <div className="mt-3 overflow-auto rounded-2xl bg-white px-4 py-3 font-mono text-sm text-slate-900">{card.expression}</div>
              <p className="mt-3 text-sm leading-7 text-slate-700">{card.meaning}</p>
            </div>
          ))}
        </div>
      )}

      {step.workedExample && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {step.workedExample.map((item) => (
            <div key={item.title} className="rounded-3xl border border-cyan-100 bg-cyan-50/70 p-5">
              <div className="text-lg font-semibold text-slate-900">{item.title}</div>
              <p className="mt-2 text-sm leading-7 text-slate-700">{item.body}</p>
            </div>
          ))}
        </div>
      )}

      {step.quiz && (
        <div className="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50/30 p-4">
          <QuizWidget quiz={step.quiz} />
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={() => onStepComplete(step.id)} className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950">
              Зачесть квизовый шаг
            </button>
          </div>
        </div>
      )}

      {step.codeExample && (
        <div className="mt-6 space-y-4">
          <pre className="overflow-auto rounded-3xl bg-slate-950 p-5 text-sm leading-7 text-slate-100">{step.codeExample.code}</pre>
          <div className="grid gap-3 lg:grid-cols-2">
            {step.codeExample.explanation.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">{item}</div>
            ))}
          </div>
        </div>
      )}

      {step.practiceTasks && step.practiceTasks.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            {step.practiceTasks.map((task, index) => (
              <button
                key={task.id}
                type="button"
                onClick={() => setTaskIndex(index)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${index === taskIndex ? 'bg-fuchsia-500 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                {task.kind}
              </button>
            ))}
          </div>
          <PracticeRunner key={step.practiceTasks[taskIndex].id} task={step.practiceTasks[taskIndex]} onPassed={() => onStepComplete(step.id)} />
        </div>
      )}

      {step.sources && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {step.sources.map((source) => (
            <a key={source.url} href={source.url} target={source.url.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="rounded-3xl border border-stone-200 bg-stone-50 p-5 hover:bg-white">
              <div className="text-xs uppercase tracking-[0.18em] text-stone-600">{source.type}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{source.label}</div>
              <p className="mt-2 text-sm leading-7 text-slate-700">{source.why}</p>
              <div className="mt-3 break-all text-sm font-medium text-emerald-700">{source.url}</div>
            </a>
          ))}
        </div>
      )}

      {step.type === 'recap' && (
        <div className="mt-6 rounded-3xl border border-teal-100 bg-teal-50 p-5">
          <div className="text-sm font-semibold text-teal-800">Дополнительная практика с решениями</div>
          <div className="mt-3 space-y-3 text-sm leading-7 text-slate-700">
            {[
              'Объясните тему человеку без ML-бэкграунда за 60 секунд.',
              'Сравните тему с ближайшим альтернативным понятием и назовите одно ключевое отличие.',
              'Подберите один edge-case, на котором формула или код могут сломаться.',
            ].map((task) => (
              <details key={task} className="rounded-2xl border border-white/70 bg-white px-4 py-3">
                <summary className="cursor-pointer font-semibold text-slate-900">{task}</summary>
                <p className="mt-2">Решение-шаблон: дайте определение, привяжите к примеру, выпишите формулу и завершите ответ типичной ошибкой/ограничением.</p>
              </details>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-xs uppercase tracking-[0.16em] text-slate-400">Topic id: {topicId}</div>
    </article>
  )
}

export default function TopicDetailPage() {
  const { topicId = '' } = useParams()
  const topic = getFlowTopicById(topicId)
  const { markStepCompleted, setLastVisitedStep, progress, getTopicProgress, getSubblockProgress, getBlockProgress } = useProgress()
  const [activeStepId, setActiveStepId] = useState<string>('')
  const preferredStepId = topic ? (activeStepId || progress.lastVisitedStep[topic.id] || topic.steps[0]?.id || '') : ''

  useEffect(() => {
    const onScroll = () => {
      if (!topic) return
      const visible = topic.steps.find((step) => {
        const element = document.getElementById(step.id)
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return rect.top <= 180 && rect.bottom >= 180
      })
      if (visible && visible.id !== activeStepId) {
        setActiveStepId(visible.id)
        setLastVisitedStep(topic.id, visible.id)
      }
    }

    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [topic, activeStepId, setLastVisitedStep])

  const prevNext = useMemo(() => (topic ? getFlowPrevNextTopic(topic.id) : { prev: null, next: null }), [topic])

  if (!topic) {
    return <div className="p-10 text-center text-xl">Тема не найдена.</div>
  }

  const topicProgress = getTopicProgress(topic.id)
  const completedSteps = topic.steps.filter((step) => progress.completedSteps.includes(step.id)).length

  return (
    <div className="bg-slate-100">
      <div className="flex items-start">
        <FlowSidebar topicId={topic.id} activeStepId={preferredStepId} progress={progress} getTopicProgress={getTopicProgress} getSubblockProgress={getSubblockProgress} getBlockProgress={getBlockProgress} />

        <main className="min-w-0 flex-1">
          <div className="border-b border-slate-200 bg-white">
            <div className="px-6 py-6 lg:px-10">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span>{topic.blockTitle}</span>
                <span>•</span>
                <span>{topic.subblockTitle}</span>
                <span>•</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">{topic.level}</span>
              </div>
              <h1 className="mt-3 max-w-5xl text-4xl font-bold tracking-tight text-slate-950 lg:text-5xl">{topic.title}</h1>
              <p className="mt-4 max-w-5xl text-lg leading-8 text-slate-600">{topic.summary}</p>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="text-xs uppercase tracking-[0.18em] text-emerald-700">Progress</div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="text-3xl font-bold text-slate-950">{Math.round(topicProgress * 100)}%</div>
                    <div className="text-sm text-slate-500">{completedSteps} / {topic.steps.length} шагов зачтено</div>
                  </div>
                  <div className="mt-4"><ProgressBar value={topicProgress} /></div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Step navigation</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {topic.steps.map((step, index) => {
                      const meta = stepTypeMeta[step.type]
                      const done = progress.completedSteps.includes(step.id)
                      const selected = step.id === preferredStepId
                      return (
                        <a
                          key={step.id}
                          href={`#${step.id}`}
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm ${selected ? 'border-slate-900 bg-slate-900 text-white' : done ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-700'}`}
                        >
                          <span>{meta.icon}</span>
                          <span>{index + 1}</span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-8 lg:px-10 xl:grid-cols-[minmax(0,1fr),280px]">
            <div className="space-y-6">
              {topic.steps.map((step) => (
                <StepCard key={step.id} step={step} topicId={topic.id} onStepComplete={markStepCompleted} isCompleted={progress.completedSteps.includes(step.id)} />
              ))}

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200 bg-white p-6">
                <div className="flex gap-3">
                  {prevNext.prev && <Link to={`/topics/${prevNext.prev.id}`} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">← {prevNext.prev.title}</Link>}
                  {prevNext.next && <Link to={`/topics/${prevNext.next.id}`} className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">{prevNext.next.title} →</Link>}
                </div>
                <Link to="/topics" className="text-sm font-semibold text-emerald-700">Вернуться к карте курса</Link>
              </div>
            </div>

            <aside className="sticky top-[92px] h-fit space-y-4">
              <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">TOC</div>
                <div className="mt-4 space-y-2">
                  {topic.steps.map((step, index) => (
                    <a key={step.id} href={`#${step.id}`} className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm ${preferredStepId === step.id ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700'}`}>
                      <span>{index + 1}</span>
                      <span className="line-clamp-2">{step.title}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-5">
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Шпаргалка темы</div>
                <div className="mt-4 space-y-3">
                  {topic.themeCheatsheet.slice(0, 8).map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">{item}</div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}

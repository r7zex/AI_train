import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor'
import CourseSidebar from '../components/CourseSidebar'
import Formula from '../components/Formula'
import QuizWidget from '../features/quiz/QuizWidget'
import { getFlowPrevNextStep, getFlowPrevNextTopic, getFlowStep, getFlowStepHref, getFlowTopicById, stepTypeMeta, type FlowStep, type PracticeTask } from '../data/courseFlow'
import { judgeTask, type JudgeRunResult } from '../lib/practiceEngine'
import { useProgress } from '../hooks/useProgress'
import { parseCheatsheetItem, toLatex } from '../lib/latex'

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-slate-200">
      <div className="h-2 rounded-full bg-emerald-500 transition-all" style={{ width: `${Math.max(0, Math.min(100, value * 100))}%` }} />
    </div>
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
    <section className="mx-auto w-full max-w-5xl rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="text-sm text-slate-500">
            Практическое задание · Тестируется через {task.kind === 'stdin-stdout' ? 'stdin → stdout' : `${task.functionName ?? 'function'}(...)`}
          </div>
          <h3 className="mt-2 text-3xl font-semibold text-slate-950">{task.title}</h3>
        </div>
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          Сначала нажмите «Запустить код», потом — «Отправить».
        </div>
      </div>

      <div className="mt-8 space-y-8">
        <div className="space-y-4 text-lg leading-8 text-slate-800">
          <p>{task.statement}</p>
          {task.tips.length > 0 && (
            <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-slate-700">
              {task.tips.map((tip) => <li key={tip}>{tip}</li>)}
            </ul>
          )}
        </div>

        {task.sampleTests.length > 0 && (
          <div className="space-y-4 border-y border-slate-200 py-6">
            {task.sampleTests.map((sample) => (
              <div key={sample.id} className="space-y-2">
                {sample.input && (
                  <div>
                    <div className="text-2xl font-semibold text-black">Sample Input:</div>
                    <pre className="mt-2 whitespace-pre-wrap border-t border-slate-200 pt-3 font-mono text-xl text-slate-900">{sample.input}</pre>
                  </div>
                )}
                {sample.args && (
                  <div>
                    <div className="text-2xl font-semibold text-black">Sample Args:</div>
                    <pre className="mt-2 whitespace-pre-wrap border-t border-slate-200 pt-3 font-mono text-xl text-slate-900">{JSON.stringify(sample.args)}</pre>
                  </div>
                )}
                {(sample.expectedOutput ?? sample.expectedValue) !== undefined && (
                  <div>
                    <div className="text-2xl font-semibold text-black">Sample Output:</div>
                    <pre className="mt-2 whitespace-pre-wrap border-t border-slate-200 pt-3 font-mono text-xl text-slate-900">{sample.expectedOutput ?? JSON.stringify(sample.expectedValue)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-4xl font-semibold text-slate-950">Напишите программу. Тестируется через {task.kind === 'stdin-stdout' ? 'stdin → stdout' : `${task.functionName ?? 'function'}(...)`} </div>
            <div className="mt-4 space-y-1 text-xl text-slate-900">
              <div><span className="font-semibold">Time Limit:</span> 15 секунд</div>
              <div><span className="font-semibold">Memory Limit:</span> 256 MB</div>
            </div>
          </div>

          <div className="min-w-[170px] rounded-sm border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-slate-900 shadow-sm">
            JavaScript (Node.js)
          </div>
        </div>

        <div className="space-y-4">
          <CodeEditor value={code} onChange={setCode} height={190} />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => runJudge(true)}
                className="rounded-sm bg-emerald-500 px-8 py-3 text-xl font-semibold text-white transition hover:bg-emerald-600"
              >
                Отправить
              </button>
              <button
                type="button"
                onClick={() => setCode(task.starterCode)}
                className="rounded-sm border border-slate-300 bg-white px-6 py-3 text-lg font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Сбросить
              </button>
            </div>
            <button
              type="button"
              onClick={() => runJudge(false)}
              className="rounded-sm bg-black px-8 py-3 text-xl font-semibold text-white transition hover:bg-slate-900"
            >
              Запустить код
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-4 border-t border-slate-200 pt-6">
            <div className={`rounded-2xl border px-4 py-3 text-sm ${result.passed ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
              <div className="font-semibold">{result.passed ? 'Проверка пройдена' : 'Есть ошибки'} · score {result.score}%</div>
              {result.runtimeError && <pre className="mt-3 overflow-auto whitespace-pre-wrap rounded-xl bg-white/80 p-3 font-mono text-xs text-rose-900">{result.runtimeError}</pre>}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-lg font-semibold text-slate-900">Sample tests</div>
                <div className="mt-3 space-y-3">
                  {result.sampleResults.length > 0 ? result.sampleResults.map((sample) => (
                    <div key={sample.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-slate-800">{sample.description}</span>
                        <span className={sample.passed ? 'text-emerald-600' : 'text-rose-600'}>{sample.passed ? '✓' : '✗'}</span>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">expected: {sample.expected}</div>
                      <div className="text-xs text-slate-500">actual: {sample.actual}</div>
                    </div>
                  )) : <div className="text-sm text-slate-500">Пока нет результатов sample tests.</div>}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-lg font-semibold text-slate-900">Hidden tests</div>
                <div className="mt-3 space-y-3">
                  {result.hiddenResults.length > 0 ? result.hiddenResults.map((hidden) => (
                    <div key={hidden.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-semibold text-slate-800">{hidden.description}</span>
                        <span className={hidden.passed ? 'text-emerald-600' : 'text-rose-600'}>{hidden.passed ? '✓' : '✗'}</span>
                      </div>
                      <div className="mt-2 text-xs text-slate-500">expected: {hidden.expected}</div>
                      <div className="text-xs text-slate-500">actual: {hidden.actual}</div>
                    </div>
                  )) : <div className="text-sm text-slate-500">Hidden tests запускаются после нажатия «Отправить».</div>}
                </div>
              </div>
            </div>

            {result.structuralFeedback.length > 0 && (
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-lg font-semibold text-slate-900">Дополнительные проверки</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                  {result.structuralFeedback.map((line) => <li key={line}>{line}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function StepContent({ step, onStepComplete, isCompleted }: { step: FlowStep; onStepComplete: (stepId: string) => void; isCompleted: boolean }) {
  const meta = stepTypeMeta[step.type]
  const [taskIndex, setTaskIndex] = useState(0)

  return (
    <article className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
      <header className="border-b border-slate-100 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.accent}`}>
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{step.title}</h2>
            <p className="mt-3 max-w-4xl text-base leading-7 text-slate-600">{step.summary}</p>
          </div>
          <button
            type="button"
            onClick={() => onStepComplete(step.id)}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-950 text-white'}`}
          >
            {isCompleted ? 'Шаг зачтён ✓' : 'Отметить шаг выполненным'}
          </button>
        </div>

        {step.mainIdea && (
          <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-emerald-700">Главная мысль</div>
            <p className="mt-2 text-lg font-semibold leading-8 text-slate-900">{step.mainIdea}</p>
          </div>
        )}
      </header>

      {step.paragraphs && (
        <div className="grid gap-4 lg:grid-cols-2">
          {step.paragraphs.map((paragraph) => (
            <div key={paragraph} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-[15px] leading-7 text-slate-700">
              {paragraph}
            </div>
          ))}
        </div>
      )}

      {step.definitions && (
        <div className="grid gap-4 lg:grid-cols-2">
          {step.definitions.map((item) => (
            <div key={item.term} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="text-lg font-semibold text-slate-950">{item.term}</div>
              <p className="mt-2 text-sm leading-7 text-slate-700">{item.definition}</p>
              <div className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm leading-6 text-slate-600">
                <span className="font-semibold text-slate-900">Зачем помнить:</span> {item.whyItMatters}
              </div>
            </div>
          ))}
        </div>
      )}

      {step.bullets && (
        <div className="space-y-3">
          {step.bullets.map((bullet) => (
            <div key={bullet} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">{bullet}</div>
          ))}
        </div>
      )}

      {step.formulaCards && (
        <div className="grid gap-4 xl:grid-cols-2">
          {step.formulaCards.map((card) => (
            <div key={card.expression} className="rounded-3xl border border-violet-100 bg-violet-50/60 p-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-violet-700">{card.label}</div>
              <div className="mt-3 overflow-auto rounded-2xl bg-white px-4 py-4 text-slate-900">
                <Formula math={toLatex(card.expression)} block className="text-base" />
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">{card.meaning}</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                {card.notation.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {step.workedExample && (
        <div className="grid gap-4 lg:grid-cols-3">
          {step.workedExample.map((item) => (
            <div key={item.title} className="rounded-3xl border border-cyan-100 bg-cyan-50/70 p-5">
              <div className="text-lg font-semibold text-slate-900">{item.title}</div>
              <p className="mt-2 text-sm leading-7 text-slate-700">{item.body}</p>
            </div>
          ))}
        </div>
      )}

      {step.quiz && (
        <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-4">
          <QuizWidget quiz={step.quiz} />
          <div className="mt-4 flex justify-end">
            <button type="button" onClick={() => onStepComplete(step.id)} className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950">Зачесть шаг после прохождения квиза</button>
          </div>
        </div>
      )}

      {step.codeExample && (
        <div className="space-y-4">
          <pre className="overflow-auto rounded-3xl bg-slate-950 p-5 text-sm leading-7 text-slate-100">{step.codeExample.code}</pre>
          <div className="grid gap-3 lg:grid-cols-2">
            {step.codeExample.explanation.map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 text-slate-700">{item}</div>
            ))}
          </div>
        </div>
      )}

      {step.practiceTasks && step.practiceTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {step.practiceTasks.map((task, index) => (
              <button
                key={task.id}
                type="button"
                onClick={() => setTaskIndex(index)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${index === taskIndex ? 'bg-fuchsia-500 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                {task.kind}
              </button>
            ))}
          </div>
          <PracticeRunner key={step.practiceTasks[taskIndex].id} task={step.practiceTasks[taskIndex]} onPassed={() => onStepComplete(step.id)} />
        </div>
      )}

      {step.drills && (
        <div className="space-y-3 rounded-3xl border border-teal-100 bg-teal-50/70 p-5">
          <div className="text-sm font-semibold text-teal-800">Мини-задания для закрепления</div>
          {step.drills.map((drill) => (
            <details key={drill.prompt} className="rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm text-slate-700">
              <summary className="cursor-pointer font-semibold text-slate-900">{drill.prompt}</summary>
              <p className="mt-2 leading-7">{drill.answer}</p>
            </details>
          ))}
        </div>
      )}

      {step.sources && (
        <div className="grid gap-4 lg:grid-cols-2">
          {step.sources.map((source) => (
            <a key={`${source.label}-${source.url}`} href={source.url} target={source.url.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="rounded-3xl border border-stone-200 bg-stone-50 p-5 transition hover:bg-white">
              <div className="text-[11px] uppercase tracking-[0.22em] text-stone-600">{source.type}</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">{source.label}</div>
              <p className="mt-2 text-sm leading-7 text-slate-700">{source.why}</p>
              <div className="mt-3 break-all text-sm font-medium text-emerald-700">{source.url}</div>
            </a>
          ))}
        </div>
      )}
    </article>
  )
}

export default function TopicDetailPage() {
  const { topicId = '', stepId } = useParams()
  const topic = getFlowTopicById(topicId)
  const progressApi = useProgress()
  const { progress, markStepCompleted, setLastVisitedStep, getTopicProgress, getSubblockProgress, getBlockProgress } = progressApi

  const resolvedStepId = topic ? (stepId ?? progress.lastVisitedStep[topic.id] ?? topic.steps[0].id) : ''
  const currentStep = topic ? getFlowStep(topic.id, resolvedStepId) : null

  useEffect(() => {
    if (topic && currentStep) {
      setLastVisitedStep(topic.id, currentStep.id)
    }
  }, [topic, currentStep, setLastVisitedStep])

  if (!topic) {
    return <div className="p-10 text-center text-xl">Тема не найдена.</div>
  }

  if (!currentStep) {
    return <Navigate to={getFlowStepHref(topic.id, topic.steps[0].id)} replace />
  }

  if (!stepId) {
    return <Navigate to={getFlowStepHref(topic.id, resolvedStepId)} replace />
  }

  const topicProgress = getTopicProgress(topic.id)
  const completedSteps = topic.steps.filter((step) => progress.completedSteps.includes(step.id)).length
  const prevNextStep = getFlowPrevNextStep(topic.id, currentStep.id)
  const prevNextTopic = getFlowPrevNextTopic(topic.id)
  const activeIndex = topic.steps.findIndex((step) => step.id === currentStep.id)

  return (
    <div className="flex min-h-screen flex-col bg-[#f3f4f6] xl:flex-row">
      <CourseSidebar
        activeTopicId={topic.id}
        progress={progress}
        getTopicProgress={getTopicProgress}
        getSubblockProgress={getSubblockProgress}
        getBlockProgress={getBlockProgress}
      />

      <main className="min-w-0 flex-1">
        <div className="border-b border-slate-200 bg-[#202020] px-6 py-4 text-white lg:px-10">
          <div className="flex flex-wrap items-center gap-2">
            {topic.steps.map((step, index) => {
              const meta = stepTypeMeta[step.type]
              const isDone = progress.completedSteps.includes(step.id)
              const isActive = step.id === currentStep.id
              return (
                <Link
                  key={step.id}
                  to={getFlowStepHref(topic.id, step.id)}
                  className={`grid h-10 w-10 place-items-center rounded-md border text-sm font-semibold transition ${isActive ? 'border-emerald-300 bg-emerald-400 text-slate-950' : isDone ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-200' : 'border-white/15 bg-white/5 text-slate-300 hover:bg-white/10'}`}
                  title={`${index + 1}. ${step.title} · ${meta.short}`}
                >
                  {isDone && !isActive ? '✓' : index + 1}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="border-b border-slate-200 bg-white px-6 py-5 lg:px-10">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span>{topic.blockTitle}</span>
            <span>•</span>
            <span>{topic.subblockTitle}</span>
            <span>•</span>
            <span>{topic.title}</span>
          </div>
          <div className="mt-3 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 lg:text-4xl">{currentStep.title}</h1>
              <p className="mt-2 max-w-4xl text-base leading-7 text-slate-600">{currentStep.summary}</p>
            </div>
            <div className="min-w-[300px] rounded-3xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
                <span>{topic.title}</span>
                <span>{completedSteps} / {topic.steps.length}</span>
              </div>
              <div className="mt-3"><ProgressBar value={topicProgress} /></div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Шаг {activeIndex + 1} из {topic.steps.length}</span>
                <span>{Math.round(topicProgress * 100)}% завершено</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1040px] px-6 py-8 lg:px-8">
          <StepContent step={currentStep} onStepComplete={markStepCompleted} isCompleted={progress.completedSteps.includes(currentStep.id)} />

          <div className="mt-6 grid gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr,auto] lg:items-center">
            <div className="space-y-3">
              <div className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Навигация по уроку</div>
              <div className="flex flex-wrap gap-3">
                {prevNextStep.prev ? (
                  <Link to={getFlowStepHref(topic.id, prevNextStep.prev.id)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">← Предыдущий шаг</Link>
                ) : prevNextTopic.prev ? (
                  <Link to={getFlowStepHref(prevNextTopic.prev.id, prevNextTopic.prev.steps[prevNextTopic.prev.steps.length - 1].id)} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">← Предыдущая тема</Link>
                ) : null}

                {prevNextStep.next ? (
                  <Link to={getFlowStepHref(topic.id, prevNextStep.next.id)} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">Следующий шаг →</Link>
                ) : prevNextTopic.next ? (
                  <Link to={getFlowStepHref(prevNextTopic.next.id, prevNextTopic.next.steps[0].id)} className="rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950">Следующая тема →</Link>
                ) : null}
              </div>
            </div>

            <div className="space-y-4 rounded-3xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Шпаргалка темы</div>
              <div className="grid gap-3">
                {topic.themeCheatsheet.slice(0, 4).map((item) => {
                  const parsed = parseCheatsheetItem(item)
                  return (
                    <div key={item} className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{parsed.kind}</div>
                      {parsed.isLatex ? (
                        <div className="mt-2 overflow-auto text-slate-900">
                          <Formula math={parsed.latex} block className="text-sm" />
                        </div>
                      ) : (
                        <div className="mt-2 text-sm leading-6 text-slate-700">{parsed.content}</div>
                      )}
                    </div>
                  )
                })}
              </div>
              <Link to="/topics" className="text-sm font-semibold text-emerald-700">Вернуться к карте курса</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

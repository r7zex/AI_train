import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor'
import CourseSidebar from '../components/CourseSidebar'
import Formula from '../components/Formula'
import QuizWidget from '../features/quiz/QuizWidget'
import {
  getFlowPrevNextStep,
  getFlowPrevNextTopic,
  getFlowStep,
  getFlowStepHref,
  getFlowTopicById,
  type ConceptCard,
  type ConceptCodeExample,
  type FlowStep,
  type FlowStepType,
  type FormulaCard,
  type PracticeTask,
} from '../data/courseFlow'
import { useProgress } from '../hooks/useProgress'
import { judgeTask, type JudgeRunResult } from '../lib/practiceEngine'

function StepGlyph({ type }: { type: FlowStepType }) {
  if (type === 'practice' || type === 'code') {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <path d="M6 3 2 8l4 5M10 3l4 5-4 5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (type === 'quiz') {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <path d="M8 12.5h.01M6.1 6a1.9 1.9 0 1 1 3.2 1.4c-.6.5-1 .9-1 1.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }
  if (type === 'formula') {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <path d="M3 12 7 4l2 8 4-8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (type === 'recap') {
    return (
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <path d="M3 4h10M3 8h10M3 12h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path d="M4 2.5h6l2 2V13.5H4z" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 2.5v2h2" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

function CodeExampleBlock({ example, title = 'Пример кода' }: { example: ConceptCodeExample; title?: string }) {
  return (
    <section className="overflow-hidden border border-[#d7dee8] bg-white">
      <div className="border-b border-[#e5eaf0] bg-[#f7f9fc] px-4 py-3">
        <h3 className="text-[15px] font-semibold text-[#1d2733]">{title}</h3>
        <div className="mt-1 text-[11px] uppercase tracking-[0.12em] text-[#65758a]">{example.language}</div>
      </div>
      <pre className="max-h-[520px] overflow-auto bg-[#101820] p-4 font-mono text-[12px] leading-6 text-[#eef6ff]">{example.code}</pre>
      {example.explanation.length > 0 && (
        <ul className="space-y-2 px-4 py-3 text-[13px] leading-6 text-[#354253]">
          {example.explanation.map((line, index) => <li key={`${line}-${index}`}>{line}</li>)}
        </ul>
      )}
    </section>
  )
}

function FormulaCards({ cards }: { cards: FormulaCard[] }) {
  if (!cards.length) return null
  return (
    <section className="grid gap-3">
      {cards.map((card) => (
        <article key={`${card.label}-${card.expression}`} className="border border-[#d9e1eb] bg-white p-4">
          <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#51705d]">{card.label}</div>
          <div className="mt-3 overflow-x-auto border border-[#e6ecf2] bg-[#f8fafc] px-3 py-4 text-[17px] text-[#17202b]">
            <Formula math={card.expression} block />
          </div>
          <p className="mt-3 text-[13px] leading-6 text-[#334155]">{card.meaning}</p>
          <ul className="mt-3 grid gap-2 text-[12px] leading-5 text-[#4c5a6a] md:grid-cols-2">
            {card.notation.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}
          </ul>
        </article>
      ))}
    </section>
  )
}

function ConceptField({ title, body }: { title: string; body: string }) {
  return (
    <section className="border border-[#e2e8f0] bg-[#fbfcfe] p-4">
      <h4 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#5a6a7f]">{title}</h4>
      <p className="mt-2 text-[14px] leading-7 text-[#2f3b4a]">{body}</p>
    </section>
  )
}

function ConceptCardView({ concept, index }: { concept: ConceptCard; index: number }) {
  return (
    <article className="border border-[#ccd6e2] bg-white">
      <header className="border-b border-[#e2e8f0] bg-[#f7faf8] px-5 py-4">
        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#2f7a46]">Подблок {index + 1}</div>
        <h3 className="mt-1 text-[21px] font-semibold tracking-[-0.01em] text-[#17202b]">{concept.title}</h3>
      </header>

      <div className="space-y-4 px-5 py-5">
        <ConceptField title="Теория 100+ слов" body={concept.theory} />

        <div className="grid gap-4 md:grid-cols-2">
          <ConceptField title="Что это" body={concept.what} />
          <ConceptField title="Зачем нужно" body={concept.why} />
          <ConceptField title="Где применяют" body={concept.where} />
          <ConceptField title="Как применять" body={concept.howToUse} />
        </div>

        <FormulaCards cards={[concept.formula]} />

        <section className="border border-[#dfe7ef] bg-[#fbfcfe] p-4">
          <h4 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#5a6a7f]">Популярные параметры</h4>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {concept.params.map((param) => (
              <div key={param.name} className="border border-[#e1e7ee] bg-white p-3">
                <div className="font-mono text-[13px] font-semibold text-[#17202b]">{param.name}</div>
                <p className="mt-1 text-[13px] leading-6 text-[#3e4b5b]">{param.meaning}</p>
              </div>
            ))}
          </div>
        </section>

        <CodeExampleBlock example={concept.codeExample} title={`Код: ${concept.title}`} />

        <section className="border border-[#ead8d8] bg-[#fffafa] p-4">
          <h4 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#8a3f43]">5 частых ошибок</h4>
          <div className="mt-3 space-y-3">
            {concept.commonMistakes.map((mistake, mistakeIndex) => (
              <article key={mistake.title} className="border border-[#f0dddd] bg-white p-3">
                <div className="text-[13px] font-semibold text-[#722d33]">{mistakeIndex + 1}. {mistake.title}</div>
                <p className="mt-1 text-[13px] leading-6 text-[#45343a]">{mistake.explanation}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </article>
  )
}

function PracticeRunner({ task, onPassed }: { task: PracticeTask; onPassed: () => void }) {
  const [code, setCode] = useState(task.starterCode)
  const [result, setResult] = useState<JudgeRunResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const runJudge = async (includeHidden: boolean) => {
    setIsRunning(true)
    try {
      const next = await judgeTask(task, code, includeHidden)
      setResult(next)
      if (includeHidden && next.passed) onPassed()
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <section className="border border-[#ccd6e2] bg-white">
      <div className="border-b border-[#e4e9ef] bg-[#f8fbf9] px-5 py-4">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2f7a46]">Практическое задание с автотестами</div>
        <h3 className="mt-1 text-[20px] font-semibold text-[#1e252e]">{task.title}</h3>
        <p className="mt-2 text-[13px] leading-6 text-[#3b4654]">{task.statement}</p>
      </div>

      {task.tips.length > 0 && (
        <ul className="mx-5 mt-4 list-disc space-y-1 pl-5 text-[13px] text-[#4a5563]">
          {task.tips.map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
      )}

      <div className="mx-5 mt-4 grid gap-3 md:grid-cols-2">
        {task.sampleTests.map((sample) => (
          <div key={sample.id} className="border border-[#e1e7ed] bg-[#fafbfd] p-3">
            <div className="text-[12px] font-semibold text-[#334152]">{sample.description}</div>
            {sample.input && (
              <pre className="mt-2 whitespace-pre-wrap bg-white p-2 font-mono text-[12px] text-[#1f2833]">{sample.input}</pre>
            )}
            <div className="mt-2 text-[11px] font-semibold text-[#667586]">Ожидаемый вывод</div>
            <pre className="mt-1 whitespace-pre-wrap bg-white p-2 font-mono text-[12px] text-[#1f2833]">{sample.expectedOutput ?? String(sample.expectedValue)}</pre>
          </div>
        ))}
      </div>

      <div className="mx-5 mt-4 flex flex-wrap items-center justify-between gap-4 border border-[#e1e7ed] bg-[#fafbfd] px-3 py-2">
        <div className="text-[12px] text-[#445264]">Код запускается через stdin {'->'} stdout, затем проверяется на sample и hidden tests.</div>
        <div className="border border-[#ccd4de] bg-white px-2 py-1 text-[12px] text-[#1f2833]">Python 3</div>
      </div>

      <div className="mx-5 mt-3">
        <CodeEditor value={code} onChange={setCode} height={300} />
      </div>

      <div className="mx-5 mt-3 flex flex-wrap items-center justify-between gap-3 pb-5">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void runJudge(true)}
            disabled={isRunning}
            className="bg-[#45b96a] px-4 py-2 text-[13px] font-semibold text-[#09200f] transition hover:bg-[#3fac60] disabled:cursor-wait disabled:bg-[#9dd6ae]"
          >
            {isRunning ? 'Проверяем...' : 'Отправить'}
          </button>
          <button
            type="button"
            onClick={() => void runJudge(false)}
            disabled={isRunning}
            className="bg-[#242a31] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#1b2026] disabled:cursor-wait disabled:bg-[#7a838e]"
          >
            {isRunning ? 'Запуск...' : 'Запустить sample'}
          </button>
          <button
            type="button"
            onClick={() => setCode(task.starterCode)}
            disabled={isRunning}
            className="border border-[#cfd6df] bg-white px-3 py-2 text-[13px] text-[#3b4654] hover:bg-[#f7f9fb]"
          >
            Сбросить
          </button>
        </div>

        <div className="text-[11px] text-[#667586]">Time limit: 15 sec · Memory limit: 256 MB</div>
      </div>

      {result && (
        <div className="border-t border-[#dce3eb] bg-white">
          <div className={`border-b px-5 py-3 text-[12px] font-semibold ${result.passed ? 'border-[#cbeed7] bg-[#eefaf1] text-[#1f6e3a]' : 'border-[#f2d8da] bg-[#fff3f3] text-[#93313a]'}`}>
            {result.passed ? 'Проверка пройдена' : 'Есть ошибки'} · score: {result.score}%
          </div>

          {result.runtimeError && (
            <pre className="border-b border-[#e7edf3] bg-[#fff7f7] p-3 font-mono text-[12px] text-[#912d37]">{result.runtimeError}</pre>
          )}

          <div className="grid gap-0 md:grid-cols-2">
            {([['Sample tests', result.sampleResults], ['Hidden tests', result.hiddenResults]] as const).map(([title, items]) => (
              <div key={title} className="border-r border-[#e7edf3] p-4 last:border-r-0">
                <div className="text-[12px] font-semibold text-[#1f2833]">{title}</div>
                <div className="mt-2 space-y-2">
                  {items.length > 0 ? items.map((item) => (
                    <div key={item.id} className="border border-[#e4e9ef] bg-[#fafbfd] p-2 text-[12px]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[#1f2833]">{item.description}</span>
                        <span className={item.passed ? 'text-[#1f7a3f]' : 'text-[#a63842]'}>{item.passed ? 'OK' : 'FAIL'}</span>
                      </div>
                      <div className="mt-1 text-[#6a7786]">expected: {item.expected}</div>
                      <div className="text-[#6a7786]">actual: {item.actual}</div>
                    </div>
                  )) : <div className="text-[12px] text-[#6a7786]">Hidden tests запускаются после кнопки «Отправить».</div>}
                </div>
              </div>
            ))}
          </div>

          {result.structuralFeedback.length > 0 && (
            <div className="border-t border-[#e7edf3] px-4 py-3 text-[12px] text-[#536173]">
              {result.structuralFeedback.map((line) => <div key={line}>{line}</div>)}
            </div>
          )}
        </div>
      )}
    </section>
  )
}

function StepContent({ step, isCompleted, onStepComplete }: { step: FlowStep; isCompleted: boolean; onStepComplete: (stepId: string) => void }) {
  return (
    <article className="border border-[#d8dee6] bg-white">
      <header className="border-b border-[#e4e9ef] bg-white px-6 py-5">
        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#4f6c5a]">{step.type}</div>
        <h1 className="mt-1 text-[28px] font-semibold leading-9 tracking-[-0.02em] text-[#1f252d]">{step.title}</h1>
        <p className="mt-2 text-[14px] leading-7 text-[#3b4654]">{step.summary}</p>
      </header>

      <div className="space-y-6 px-6 py-6">
        {step.sections?.map((section) => (
          <section key={section.id}>
            <h2 className="text-[18px] font-semibold text-[#1f2833]">{section.title}</h2>
            <div className="mt-2 space-y-3">
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.id}-${index}`} className="text-[14px] leading-7 text-[#2e3946]">{paragraph}</p>
              ))}
            </div>
            {section.bullets && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] leading-7 text-[#2f3a47]">
                {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}
          </section>
        ))}

        {step.conceptCards?.map((concept, index) => <ConceptCardView key={concept.id} concept={concept} index={index} />)}

        {step.formulaCards && <FormulaCards cards={step.formulaCards} />}

        {step.workedExample && (
          <section className="border border-[#d9e1eb] bg-[#fbfcfe] p-4">
            <h2 className="text-[18px] font-semibold text-[#1f2833]">Разбор применения</h2>
            <div className="mt-3 grid gap-3">
              {step.workedExample.map((item) => (
                <article key={item.title} className="border border-[#e2e8f0] bg-white p-3">
                  <h3 className="text-[14px] font-semibold text-[#213044]">{item.title}</h3>
                  <p className="mt-1 text-[13px] leading-6 text-[#3f4d5e]">{item.body}</p>
                </article>
              ))}
            </div>
          </section>
        )}

        {step.bullets && (
          <section className="border border-[#d9e1eb] bg-[#fbfcfe] p-4">
            <ul className="list-disc space-y-2 pl-5 text-[14px] leading-7 text-[#2f3a47]">
              {step.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </section>
        )}

        {step.codeExample && <CodeExampleBlock example={step.codeExample} />}

        {step.quiz && (
          <section className="border border-[#ccd6e2] bg-white p-4">
            <QuizWidget quiz={step.quiz} />
          </section>
        )}

        {step.practiceTasks?.length ? (
          <PracticeRunner task={step.practiceTasks[0]} onPassed={() => onStepComplete(step.id)} />
        ) : null}

        {step.sources && (
          <section className="border border-[#d9e1eb] bg-[#fbfcfe] p-4">
            <h2 className="text-[16px] font-semibold text-[#1f2833]">Источники и ориентиры</h2>
            <div className="mt-3 grid gap-3">
              {step.sources.map((source) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="border border-[#e2e8f0] bg-white p-3 text-[13px] leading-6 text-[#334155] transition hover:border-[#8cc69b]">
                  <span className="font-semibold text-[#17202b]">{source.label}</span>
                  <span className="ml-2 text-[#6a7786]">{source.type}</span>
                  <span className="block">{source.why}</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="border-t border-[#e4e9ef] px-6 py-4">
        <button
          type="button"
          onClick={() => onStepComplete(step.id)}
          className={`px-4 py-2 text-[13px] font-semibold ${isCompleted ? 'bg-[#eaf7ef] text-[#1e6b37]' : 'bg-[#232a32] text-white hover:bg-[#1c2229]'}`}
        >
          {isCompleted ? 'Шаг зачтён' : 'Отметить шаг выполненным'}
        </button>
      </footer>
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
    if (topic && currentStep) setLastVisitedStep(topic.id, currentStep.id)
  }, [topic, currentStep, setLastVisitedStep])

  if (!topic) return <div className="p-6 text-[14px] text-[#2d3744]">Тема не найдена.</div>
  if (!currentStep) return <Navigate to={getFlowStepHref(topic.id, topic.steps[0].id)} replace />
  if (!stepId) return <Navigate to={getFlowStepHref(topic.id, resolvedStepId)} replace />

  const completedSteps = topic.steps.filter((step) => progress.completedSteps.includes(step.id)).length
  const prevNextStep = getFlowPrevNextStep(topic.id, currentStep.id)
  const prevNextTopic = getFlowPrevNextTopic(topic.id)

  return (
    <div className="min-h-screen bg-[#eef2f6]">
      <header className="sticky top-0 z-40 border-b border-black/40 bg-[#1f2329] text-white">
        <div className="flex min-h-12 flex-wrap items-center justify-between gap-3 px-4 py-2 lg:px-6">
          <Link to="/topics" className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center bg-[#45b96a] text-[10px] font-bold text-[#0d2313]">AI</span>
            <span className="text-[12px] font-semibold">AI Train</span>
          </Link>

          <div className="flex max-w-full items-center gap-1 overflow-x-auto pb-1">
            {topic.steps.map((step, index) => {
              const isDone = progress.completedSteps.includes(step.id)
              const isActive = step.id === currentStep.id
              return (
                <Link
                  key={step.id}
                  to={getFlowStepHref(topic.id, step.id)}
                  className={`relative flex h-8 w-8 shrink-0 items-center justify-center border text-[10px] transition ${
                    isActive ? 'border-[#7adf93] bg-[#45b96a] text-[#0f2716]' : isDone ? 'border-[#4cad66] bg-[#2f6f42] text-[#d4ffe1]' : 'border-[#4a535f] bg-[#2c333c] text-[#9aa8b7] hover:border-[#637081] hover:text-[#d7e0ea]'
                  }`}
                  title={`${index + 1}. ${step.title}`}
                >
                  <StepGlyph type={step.type} />
                </Link>
              )
            })}
          </div>
        </div>

        <div className="border-t border-[#343a43] px-4 py-2 text-[12px] text-[#cad4de] lg:px-6">
          <span className="font-semibold text-white">{topic.title}</span>
          <span className="mx-2 text-[#738092]">·</span>
          <span>{completedSteps} из {topic.steps.length} шагов пройдено</span>
          <span className="mx-2 text-[#738092]">·</span>
          <span>{Math.round(getTopicProgress(topic.id) * 100)}% завершено</span>
        </div>
      </header>

      <div className="flex">
        <CourseSidebar
          activeTopicId={topic.id}
          progress={progress}
          getTopicProgress={getTopicProgress}
          getSubblockProgress={getSubblockProgress}
          getBlockProgress={getBlockProgress}
        />

        <main className="min-w-0 flex-1 px-4 py-5 lg:px-6">
          <div className="mx-auto grid max-w-[1320px] gap-5 xl:grid-cols-[minmax(0,940px),300px]">
            <div className="space-y-4">
              <StepContent step={currentStep} isCompleted={progress.completedSteps.includes(currentStep.id)} onStepComplete={markStepCompleted} />

              <section className="border border-[#d8dee6] bg-white px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    {prevNextStep.prev ? (
                      <Link to={getFlowStepHref(topic.id, prevNextStep.prev.id)} className="border border-[#cfd6df] px-3 py-2 text-[13px] text-[#344152] hover:bg-[#f6f8fb]">
                        Предыдущий шаг
                      </Link>
                    ) : prevNextTopic.prev ? (
                      <Link to={getFlowStepHref(prevNextTopic.prev.id, prevNextTopic.prev.steps[prevNextTopic.prev.steps.length - 1].id)} className="border border-[#cfd6df] px-3 py-2 text-[13px] text-[#344152] hover:bg-[#f6f8fb]">
                        Предыдущая тема
                      </Link>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {prevNextStep.next ? (
                      <Link to={getFlowStepHref(topic.id, prevNextStep.next.id)} className="bg-[#45b96a] px-4 py-2 text-[13px] font-semibold text-[#0f2716] hover:bg-[#3fad62]">
                        Следующий шаг
                      </Link>
                    ) : prevNextTopic.next ? (
                      <Link to={getFlowStepHref(prevNextTopic.next.id, prevNextTopic.next.steps[0].id)} className="bg-[#45b96a] px-4 py-2 text-[13px] font-semibold text-[#0f2716] hover:bg-[#3fad62]">
                        Следующая тема
                      </Link>
                    ) : (
                      <Link to="/topics" className="bg-[#45b96a] px-4 py-2 text-[13px] font-semibold text-[#0f2716] hover:bg-[#3fad62]">
                        К программе курса
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            </div>

            <aside className="hidden xl:block">
              <div className="sticky top-[106px] space-y-4">
                <section className="border border-[#d8dee6] bg-white p-4">
                  <h2 className="text-[14px] font-semibold text-[#17202b]">Шпаргалка темы</h2>
                  <ul className="mt-3 space-y-2 text-[12px] leading-5 text-[#536173]">
                    {topic.themeCheatsheet.slice(0, 9).map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </section>
                <section className="border border-[#d8dee6] bg-white p-4">
                  <h2 className="text-[14px] font-semibold text-[#17202b]">Формулы</h2>
                  <div className="mt-3 space-y-2">
                    {topic.formulas.slice(0, 6).map((formula) => (
                      <div key={formula} className="overflow-x-auto border border-[#e4eaf1] bg-[#f8fafc] p-2 text-[12px]">
                        <Formula math={formula} />
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}

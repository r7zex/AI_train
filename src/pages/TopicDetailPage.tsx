import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import CodeEditor from '../components/CodeEditor'
import CourseSidebar from '../components/CourseSidebar'
import { getFlowPrevNextStep, getFlowPrevNextTopic, getFlowStep, getFlowStepHref, getFlowTopicById, type FlowStep, type FlowStepType, type PracticeTask } from '../data/courseFlow'
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
    <section className="border border-[#d8dee6] bg-white px-5 py-4">
      <div className="border-b border-[#e4e9ef] pb-4">
        <div className="text-[11px] text-[#697686]">Практическое задание</div>
        <h3 className="mt-1 text-[18px] font-semibold text-[#1e252e]">{task.title}</h3>
        <p className="mt-2 text-[13px] leading-6 text-[#3b4654]">{task.statement}</p>
      </div>

      {task.tips.length > 0 && (
        <ul className="mt-4 list-disc space-y-1 pl-5 text-[13px] text-[#4a5563]">
          {task.tips.map((tip) => <li key={tip}>{tip}</li>)}
        </ul>
      )}

      {task.sampleTests.length > 0 && (
        <div className="mt-4 border border-[#e1e7ed] bg-[#fafbfd]">
          <div className="border-b border-[#e8edf3] px-3 py-2 text-[12px] font-semibold text-[#334152]">Примеры</div>
          <div className="space-y-3 p-3">
            {task.sampleTests.map((sample) => (
              <div key={sample.id} className="border border-[#e8edf3] bg-white p-3">
                {sample.input && (
                  <div className="mb-2">
                    <div className="text-[11px] font-semibold text-[#667586]">Sample Input</div>
                    <pre className="mt-1 whitespace-pre-wrap bg-[#f4f6f8] p-2 font-mono text-[12px] text-[#1f2833]">{sample.input}</pre>
                  </div>
                )}
                {(sample.expectedOutput ?? sample.expectedValue) !== undefined && (
                  <div>
                    <div className="text-[11px] font-semibold text-[#667586]">Sample Output</div>
                    <pre className="mt-1 whitespace-pre-wrap bg-[#f4f6f8] p-2 font-mono text-[12px] text-[#1f2833]">{sample.expectedOutput ?? String(sample.expectedValue)}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border border-[#e1e7ed] bg-[#fafbfd] px-3 py-2">
        <div className="text-[12px] text-[#445264]">Напишите программу. Тестируется через stdin → stdout.</div>
        <div className="border border-[#ccd4de] bg-white px-2 py-1 text-[12px] text-[#1f2833]">Python 3</div>
      </div>

      <div className="mt-3">
        <CodeEditor value={code} onChange={setCode} height={280} />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
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
            {isRunning ? 'Запуск...' : 'Запустить код'}
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

        <div className="text-[11px] text-[#667586]">Time limit: 15 sec • Memory limit: 256 MB</div>
      </div>

      {result && (
        <div className="mt-4 border border-[#dce3eb] bg-white">
          <div className={`border-b px-3 py-2 text-[12px] font-semibold ${result.passed ? 'border-[#cbeed7] bg-[#eefaf1] text-[#1f6e3a]' : 'border-[#f2d8da] bg-[#fff3f3] text-[#93313a]'}`}>
            {result.passed ? 'Проверка пройдена' : 'Есть ошибки'} • score: {result.score}%
          </div>

          {result.runtimeError && (
            <pre className="border-b border-[#e7edf3] bg-[#fff7f7] p-3 font-mono text-[12px] text-[#912d37]">{result.runtimeError}</pre>
          )}

          <div className="grid gap-0 md:grid-cols-2">
            <div className="border-r border-[#e7edf3] p-3">
              <div className="text-[12px] font-semibold text-[#1f2833]">Sample tests</div>
              <div className="mt-2 space-y-2">
                {result.sampleResults.length > 0 ? result.sampleResults.map((item) => (
                  <div key={item.id} className="border border-[#e4e9ef] bg-[#fafbfd] p-2 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#1f2833]">{item.description}</span>
                      <span className={item.passed ? 'text-[#1f7a3f]' : 'text-[#a63842]'}>{item.passed ? 'OK' : 'FAIL'}</span>
                    </div>
                    <div className="mt-1 text-[#6a7786]">expected: {item.expected}</div>
                    <div className="text-[#6a7786]">actual: {item.actual}</div>
                  </div>
                )) : <div className="text-[12px] text-[#6a7786]">Нет результатов.</div>}
              </div>
            </div>

            <div className="p-3">
              <div className="text-[12px] font-semibold text-[#1f2833]">Hidden tests</div>
              <div className="mt-2 space-y-2">
                {result.hiddenResults.length > 0 ? result.hiddenResults.map((item) => (
                  <div key={item.id} className="border border-[#e4e9ef] bg-[#fafbfd] p-2 text-[12px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#1f2833]">{item.description}</span>
                      <span className={item.passed ? 'text-[#1f7a3f]' : 'text-[#a63842]'}>{item.passed ? 'OK' : 'FAIL'}</span>
                    </div>
                    <div className="mt-1 text-[#6a7786]">expected: {item.expected}</div>
                    <div className="text-[#6a7786]">actual: {item.actual}</div>
                  </div>
                )) : <div className="text-[12px] text-[#6a7786]">Hidden tests запускаются после кнопки «Отправить».</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

function StepContent({ step, isCompleted, onStepComplete }: { step: FlowStep; isCompleted: boolean; onStepComplete: (stepId: string) => void }) {
  return (
    <article className="border border-[#d8dee6] bg-white px-6 py-5">
      <header className="border-b border-[#e4e9ef] pb-4">
        <h1 className="text-[26px] font-semibold leading-8 text-[#1f252d]">{step.title}</h1>
        <p className="mt-2 text-[14px] leading-7 text-[#3b4654]">{step.summary}</p>
      </header>

      <div className="space-y-6 py-5">
        {step.sections?.map((section) => (
          <section key={section.id}>
            <h2 className="text-[18px] font-semibold text-[#1f2833]">{section.title}</h2>
            <div className="mt-2 space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-[14px] leading-7 text-[#2e3946]">{paragraph}</p>
              ))}
            </div>
            {section.bullets && (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] leading-7 text-[#2f3a47]">
                {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            )}
          </section>
        ))}

        {step.bullets && (
          <section>
            <ul className="list-disc space-y-1 pl-5 text-[14px] leading-7 text-[#2f3a47]">
              {step.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
            </ul>
          </section>
        )}

        {step.codeExample && (
          <section>
            <h2 className="text-[18px] font-semibold text-[#1f2833]">Пример кода</h2>
            <pre className="mt-2 overflow-auto border border-[#d8dee6] bg-[#f4f6f8] p-3 font-mono text-[13px] leading-6 text-[#1f2833]">{step.codeExample.code}</pre>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] leading-7 text-[#2f3a47]">
              {step.codeExample.explanation.map((line) => <li key={line}>{line}</li>)}
            </ul>
          </section>
        )}

        {step.practiceTasks?.length ? (
          <PracticeRunner task={step.practiceTasks[0]} onPassed={() => onStepComplete(step.id)} />
        ) : null}
      </div>

      <footer className="border-t border-[#e4e9ef] pt-4">
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
    <div className="min-h-screen bg-[#eceff1]">
      <header className="sticky top-0 z-40 border-b border-black/40 bg-[#1f2329] text-white">
        <div className="flex h-12 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center bg-[#2c323a] text-[10px] font-bold">AT</span>
            <span className="text-[12px] font-semibold">AI Train</span>
          </div>

          <div className="flex items-center gap-1">
            {topic.steps.map((step, index) => {
              const isDone = progress.completedSteps.includes(step.id)
              const isActive = step.id === currentStep.id
              return (
                <Link
                  key={step.id}
                  to={getFlowStepHref(topic.id, step.id)}
                  className={`relative flex h-7 w-7 items-center justify-center border text-[10px] transition ${
                    isActive ? 'border-[#7adf93] bg-[#45b96a] text-[#0f2716]' : isDone ? 'border-[#4cad66] bg-[#2f6f42] text-[#d4ffe1]' : 'border-[#4a535f] bg-[#2c333c] text-[#9aa8b7] hover:border-[#637081] hover:text-[#d7e0ea]'
                  }`}
                  title={`${index + 1}. ${step.title}`}
                >
                  <StepGlyph type={step.type} />
                  {isActive && <span className="absolute -bottom-[7px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[7px] border-x-transparent border-t-[#45b96a]" />}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="border-t border-[#343a43] px-4 py-2 text-[12px] text-[#cad4de] lg:px-6">
          <span className="font-semibold text-white">{topic.title}</span>
          <span className="mx-2 text-[#738092]">•</span>
          <span>{completedSteps} из {topic.steps.length} шагов пройдено</span>
          <span className="mx-2 text-[#738092]">•</span>
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
          <div className="mx-auto max-w-[920px] space-y-4">
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
        </main>
      </div>
    </div>
  )
}

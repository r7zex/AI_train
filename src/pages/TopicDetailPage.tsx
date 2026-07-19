import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import CodeBlock, { ReadOnlyCodeCell } from '../components/CodeBlock'
import CourseSidebar from '../components/CourseSidebar'
import Formula from '../components/Formula'
import RichText from '../components/RichText'
import { getCourseGlossaryEntries } from '../data/courseGlossary'
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
  type FlowTopic,
  type FormulaCard,
  type LessonSection,
  type PracticeTask,
} from '../data/courseFlow'
import { useProgress } from '../hooks/useProgress'
import { judgeTask, type JudgeRunResult } from '../lib/practiceEngine'

const CodeEditor = lazy(() => import('../components/CodeEditor'))

function pluralizeRussian(value: number, one: string, few: string, many: string) {
  const mod100 = value % 100
  const mod10 = value % 10
  if (mod100 >= 11 && mod100 <= 14) return many
  if (mod10 === 1) return one
  if (mod10 >= 2 && mod10 <= 4) return few
  return many
}

function isMathNotation(value: string) {
  return /[A-Za-z_Σσμθλπη∇]|[A-Z]{1,3}/.test(value) && !/[а-яА-ЯёЁ]/.test(value)
}

function NotationHead({ value }: { value: string }) {
  return (
    <>
      {value.split(/(\s+(?:или|и)\s+)/u).map((part, index) => {
        const trimmed = part.trim()
        if (!trimmed) return <span key={`${part}-${index}`}>{part}</span>
        if (trimmed === 'или' || trimmed === 'и') return <span key={`${part}-${index}`}>{part}</span>
        if (isMathNotation(trimmed)) return <Formula key={`${part}-${index}`} math={trimmed} className="inline-block align-baseline" />
        return <span key={`${part}-${index}`}>{part}</span>
      })}
    </>
  )
}

function NotationItem({ text }: { text: string }) {
  const separatorIndex = text.indexOf('—')
  if (separatorIndex === -1) return <RichText text={text} />

  const head = text.slice(0, separatorIndex).trim()
  const body = text.slice(separatorIndex + 1).trim()

  return (
    <>
      <NotationHead value={head} />
      <span> — </span>
      <RichText text={body} />
    </>
  )
}

function StepGlyph({ type }: { type: FlowStepType }) {
  if (type === 'quiz') return <span className="text-[15px] font-bold">?</span>
  if (type === 'code' || type === 'practice') return <span className="font-mono text-[12px] font-bold leading-none">&gt;_</span>
  if (type === 'formula') return <span className="font-serif text-[15px] font-bold leading-none">Σ</span>
  if (type === 'recap') return <span className="text-[13px] font-bold leading-none">≡</span>
  return null
}

function StepButton({ step, index, topicId, active, done, onNavigate }: { step: FlowStep; index: number; topicId: string; active: boolean; done: boolean; onNavigate: () => void }) {
  return (
    <Link
      to={getFlowStepHref(topicId, step.id)}
      onClick={onNavigate}
      title={`${index + 1}. ${step.title}`}
      className={`relative flex h-[28px] min-w-[28px] items-center justify-center rounded-[2px] border-2 text-center transition ${
        active
          ? 'border-white bg-[#69be62] text-[#102414]'
          : done
            ? 'border-[#69be62] bg-[#69be62] text-[#102414]'
            : 'border-[#69be62] bg-[#262626] text-[#69be62] hover:bg-[#333]'
      }`}
    >
      <StepGlyph type={step.type} />
      {active && <span className="absolute -bottom-[13px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-[8px] border-b-[8px] border-x-transparent border-b-white" />}
    </Link>
  )
}

function CodeExampleBlock({ example, title = 'Пример кода' }: { example: ConceptCodeExample; title?: string }) {
  return (
    <section>
      <h2 className="mb-2 text-[18px] font-bold leading-6 text-[#111827]">{title}</h2>
      <CodeBlock code={example.code} language={example.language} output={example.output} />
      {example.explanation.length > 0 && (
        <p className="mt-2 text-[15px] leading-6 text-[#111827]">
          <RichText text={example.explanation[0]} />
        </p>
      )}
    </section>
  )
}

function CalloutBlock({ title, body, tone }: { title: string; body: string; tone: 'important' | 'summary' | 'example' | 'remember' | 'schema' }) {
  const toneClass = {
    important: 'border-[#f4c542] bg-[#fff9e8]',
    summary: 'border-[#65d36f] bg-[#eefaf1]',
    example: 'border-[#93c5fd] bg-[#eff6ff]',
    remember: 'border-[#c4b5fd] bg-[#f5f3ff]',
    schema: 'border-[#d1d5db] bg-[#f8f8f8]',
  }[tone]

  return (
    <div className={`mt-4 border-l-4 px-4 py-3 text-[14px] leading-6 text-[#111827] ${toneClass}`}>
      <div className="mb-0.5 text-[12px] font-bold uppercase tracking-[0.06em] text-[#374151]">{title}</div>
      <div className={tone === 'schema' ? 'whitespace-pre-line text-[14px]' : 'whitespace-pre-line'}>
        <RichText text={body} />
      </div>
    </div>
  )
}

function LocalGlossary({ terms }: { terms: string[] }) {
  const entries = getCourseGlossaryEntries(terms)
  if (!entries.length) return null

  return (
    <section className="mt-10 border-t border-[#dfe4e7] pt-6" aria-labelledby="local-glossary-title">
      <h2 id="local-glossary-title" className="text-[19px] font-bold leading-7 text-[#111827]">Словарь терминов этого урока</h2>
      <p className="mt-2 text-[14px] leading-6 text-[#5d6670]">Переводы находятся на этой же странице, поэтому возвращаться к отдельному справочнику не нужно.</p>
      <dl className="mt-4 divide-y divide-[#e6eaed] border-y border-[#e0e5e8]">
        {entries.map((entry) => (
          <div key={entry.original} className="grid gap-1 py-3 sm:grid-cols-[minmax(190px,0.7fr),minmax(0,1.3fr)] sm:gap-5">
            <dt className="text-[14px] font-bold leading-6 text-[#273038]">
              {entry.russian} <span className="font-normal text-[#68727b]">({entry.original})</span>
            </dt>
            <dd className="text-[14px] leading-6 text-[#303840]">{entry.definition}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function FormulaCards({ cards }: { cards: FormulaCard[] }) {
  if (!cards.length) return null
  return (
    <section className="space-y-5">
      {cards.map((card) => (
        <article key={`${card.label}-${card.expression}`} className="space-y-2">
          <h2 className="text-[18px] font-bold leading-6 text-[#111827]">{card.label}</h2>
          <div className="overflow-x-auto bg-[#f3f4f6] px-4 py-3 text-[18px] text-[#111827]">
            <Formula math={card.expression} block />
          </div>
          <p className="text-[15px] leading-6 text-[#111827]">
            <RichText text={card.meaning} />
          </p>
          <ul className="list-disc space-y-1 pl-6 text-[15px] leading-6 text-[#111827]">
            {card.notation.map((item, index) => (
              <li key={`${item}-${index}`}>
                <NotationItem text={item} />
              </li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  )
}

function ConceptCardView({ concept }: { concept: ConceptCard }) {
  const example = concept.minimalExample ?? concept.codeExample
  return (
    <div className="space-y-7">
      <section className="space-y-4">
        <h2 className="text-[18px] font-bold leading-7 text-[#111827]">Синтаксис и назначение</h2>
        <p className="text-[15px] leading-7 text-[#111827]">
          <strong>
            <code className="rounded border border-[#e1e5ea] bg-[#f3f4f6] px-1.5 py-0.5 font-mono text-[0.95em] text-[#111827]">
              {concept.shortTitle ?? concept.title}
            </code>
          </strong>{' '}
          — <RichText text={concept.definition ?? concept.what} />
        </p>
        <ReadOnlyCodeCell code={concept.signature ?? `${concept.shortTitle ?? concept.title}(...)`} language="python" compact showHeader={false} />
        <p className="text-[15px] leading-7 text-[#111827]">
          <RichText text={concept.why} />
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-[18px] font-bold leading-7 text-[#111827]">Параметры</h2>
        <p className="mb-2 text-[15px] leading-7 text-[#111827]">{concept.parametersIntro ?? 'Основные параметры:'}</p>
        <ul className="list-disc space-y-1 pl-6 text-[15px] leading-7 text-[#111827]">
          {concept.params.map((param) => (
            <li key={param.name}>
              <code className="rounded border border-[#e1e5ea] bg-[#f3f4f6] px-1 py-0.5 font-mono text-[0.92em] text-[#111827]">{param.name}</code> —{' '}
              <RichText text={param.meaning} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-[18px] font-bold leading-7 text-[#111827]">Формула</h2>
        <div className="overflow-x-auto bg-[#f3f4f6] px-4 py-4 text-[18px] text-[#111827]">
          <Formula math={concept.formula.expression} block />
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-6 text-[15px] leading-7 text-[#111827]">
          {concept.formula.notation.map((item, index) => (
            <li key={`${item}-${index}`}>
              <NotationItem text={item} />
            </li>
          ))}
        </ul>
      </section>

      <CodeExampleBlock example={example} title="Пример применения" />

      <section>
        <h2 className="mb-3 text-[18px] font-bold leading-7 text-[#111827]">Частые ошибки</h2>
        <ul className="list-disc space-y-1 pl-6 text-[15px] leading-7 text-[#111827]">
          {concept.commonMistakes.slice(0, 2).map((mistake) => (
            <li key={mistake.title}>
              <strong>{mistake.title}</strong>: <RichText text={mistake.explanation} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function FunctionCardSection({ section }: { section: LessonSection }) {
  const example = section.codeExamples?.[0]
  const params = section.params ?? []
  const output = example?.output ?? section.returns ?? ''

  return (
    <section className="overflow-hidden border border-[#dbe2ea] bg-white shadow-[0_12px_30px_-26px_rgba(30,37,45,0.7)]">
      <div className="flex flex-col gap-3 border-b border-[#e6ebf1] bg-[#fbfcfe] px-4 py-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[18px] font-bold leading-6 text-[#111827]">
            <RichText text={section.title} />
          </h2>
          {section.returns && (
            <p className="mt-1 text-[13px] leading-5 text-[#4b5563]">
              <RichText text={section.returns} />
            </p>
          )}
        </div>
        {section.signature && (
          <code className="w-fit max-w-full overflow-x-auto border border-[#d7dee7] bg-white px-2.5 py-1.5 font-mono text-[13px] text-[#111827]">
            {section.signature}
          </code>
        )}
      </div>

      <div className="grid gap-2 px-4 py-4 md:grid-cols-[minmax(0,1fr),32px,minmax(0,0.82fr),32px,minmax(0,1fr)] md:items-stretch">
        <div className="min-w-0 border border-[#e1e7ee] bg-[#f8fafc] p-3">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748b]">Вход / параметры</div>
          {params.length > 0 ? (
            <ul className="space-y-1 text-[13px] leading-5 text-[#111827]">
              {params.map((param) => (
                <li key={param} className="break-words">
                  <RichText text={param} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] leading-5 text-[#6b7280]">Готовый массив или значение.</p>
          )}
        </div>

        <div className="flex items-center justify-center text-[18px] font-bold text-[#65a866] md:text-[22px]">→</div>

        <div className="flex min-w-0 flex-col items-center justify-center border border-[#b8e2be] bg-[#eefaf1] p-3 text-center">
          <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#2f7a46]">Функция</div>
          <div className="mt-2 max-w-full overflow-x-auto font-mono text-[15px] font-bold text-[#102414]">
            {section.signature ?? section.title.replace(/`/g, '')}
          </div>
        </div>

        <div className="flex items-center justify-center text-[18px] font-bold text-[#65a866] md:text-[22px]">→</div>

        <div className="min-w-0 border border-[#e1e7ee] bg-[#f8fafc] p-3">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748b]">Выход / результат</div>
          <p className="text-[13px] leading-5 text-[#111827]">
            <RichText text={section.returns ?? 'Результат работы функции.'} />
          </p>
          {output && (
            <pre className="mt-2 overflow-x-auto bg-white px-2 py-1.5 font-mono text-[12px] leading-5 text-[#111827]">{output}</pre>
          )}
        </div>
      </div>

      {example && (
        <div className="border-t border-[#e6ebf1] px-4 py-3">
          <CodeBlock code={example.code} language={example.language} output={example.output} explanation={example.explanation[0]} />
        </div>
      )}
    </section>
  )
}

function PracticeRunner({ task, onPassed }: { task: PracticeTask; onPassed: () => void }) {
  const [code, setCode] = useState(task.starterCode)
  const [result, setResult] = useState<JudgeRunResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const runIdRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    abortControllerRef.current?.abort()
    runIdRef.current += 1
    setCode(task.starterCode)
    setResult(null)
    setIsRunning(false)
    return () => abortControllerRef.current?.abort()
  }, [task.id, task.starterCode])

  const runJudge = async (includeHidden: boolean) => {
    abortControllerRef.current?.abort()
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    const runId = runIdRef.current + 1
    runIdRef.current = runId
    setIsRunning(true)
    setResult(null)
    try {
      const next = await judgeTask(task, code, includeHidden, abortController.signal)
      if (runIdRef.current !== runId) return
      setResult(next)
      if (includeHidden && next.passed) onPassed()
    } finally {
      if (abortControllerRef.current === abortController) abortControllerRef.current = null
      if (runIdRef.current === runId) setIsRunning(false)
    }
  }

  const cancelRun = () => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    runIdRef.current += 1
    setIsRunning(false)
    setResult({
      passed: false,
      score: 0,
      sampleResults: [],
      hiddenResults: [],
      runtimeError: 'Выполнение отменено пользователем. Поздний результат этой проверки будет проигнорирован.',
      structuralFeedback: [],
    })
  }

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-[21px] font-bold leading-7 text-[#111827]">{task.title}</h2>
        <p className="text-[15px] leading-6 text-[#111827]">{task.statement}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {task.sampleTests.map((sample) => (
          <div key={sample.id} className="border border-[#e5e7eb] bg-[#f8f8f8] p-3">
            <div className="text-[14px] font-bold text-[#111827]">{sample.description}</div>
            {sample.input && <pre className="mt-2 whitespace-pre-wrap bg-white p-2 font-mono text-[13px] text-[#111827]">{sample.input}</pre>}
            <div className="mt-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#6b7280]">Ожидаемый вывод</div>
            <pre className="mt-1 whitespace-pre-wrap bg-white p-2 font-mono text-[13px] text-[#111827]">{sample.expectedOutput ?? String(sample.expectedValue)}</pre>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border border-[#e5e7eb] bg-[#f8f8f8] px-3 py-2">
        <div className="text-[14px] text-[#374151]">Ввод через <code className="font-mono">input()</code>, вывод через <code className="font-mono">print()</code>.</div>
        <div className="bg-white px-2 py-1 text-[13px] text-[#111827]">Python 3</div>
      </div>

      <Suspense fallback={<div className="h-[357px] border border-[#bcc3ca] bg-[#f7f8f9] px-3 py-3 font-mono text-[13px] text-[#6b7280]">Загружаем редактор…</div>}>
        <CodeEditor value={code} onChange={setCode} height={320} />
      </Suspense>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void runJudge(false)}
            disabled={isRunning}
            className="bg-[#202020] px-4 py-2 text-[14px] font-bold text-white hover:bg-[#333] disabled:cursor-wait disabled:bg-[#777]"
          >
            {isRunning ? 'Запуск...' : 'Запустить'}
          </button>
          <button
            type="button"
            onClick={() => void runJudge(true)}
            disabled={isRunning}
            className="bg-[#69be62] px-5 py-2 text-[14px] font-bold text-white hover:bg-[#58aa52] disabled:cursor-wait disabled:bg-[#a8dca4]"
          >
            {isRunning ? 'Проверяем...' : 'Отправить'}
          </button>
          {isRunning && (
            <button
              type="button"
              onClick={cancelRun}
              className="border border-[#b91c1c] bg-white px-4 py-2 text-[14px] font-bold text-[#b91c1c] hover:bg-[#fff5f5]"
            >
              Отменить
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setCode(task.starterCode)
              setResult(null)
            }}
            disabled={isRunning}
            className="border border-[#d1d5db] bg-white px-4 py-2 text-[14px] text-[#111827] hover:bg-[#f3f4f6]"
          >
            Сбросить
          </button>
        </div>
        <div className="text-[13px] text-[#6b7280]">Изолированный Python worker · Time limit: 15 sec</div>
      </div>

      {result && (
        <div className="border border-[#e5e7eb]">
          <div className={`px-4 py-3 text-[14px] font-bold ${result.passed ? 'bg-[#eefaf1] text-[#1f6e3a]' : 'bg-[#fff3f3] text-[#93313a]'}`}>
            {result.passed ? 'Проверка пройдена' : 'Есть ошибки'} · score: {result.score}%
          </div>
          {result.runtimeError && <pre className="whitespace-pre-wrap bg-[#fff7f7] p-3 font-mono text-[13px] text-[#912d37]">{result.runtimeError}</pre>}
          <div className="grid md:grid-cols-2">
            {([['Sample tests', result.sampleResults], ['Hidden tests', result.hiddenResults]] as const).map(([title, items]) => (
              <div key={title} className="border-t border-[#e5e7eb] p-4 md:border-r md:last:border-r-0">
                <div className="text-[14px] font-bold text-[#111827]">{title}</div>
                <div className="mt-2 space-y-2">
                  {items.length > 0 ? items.map((item) => (
                    <div key={item.id} className="bg-[#f8f8f8] p-2 text-[13px]">
                      <div className="flex items-center justify-between gap-2">
                        <span>{item.description}</span>
                        <span className={item.passed ? 'font-bold text-[#1f7a3f]' : 'font-bold text-[#a63842]'}>{item.passed ? 'OK' : 'FAIL'}</span>
                      </div>
                      {title === 'Sample tests' ? (
                        <>
                          <div className="mt-1 text-[#6b7280]">expected: {item.expected}</div>
                          <div className="text-[#6b7280]">actual: {item.actual}</div>
                          {item.diff && <pre className="mt-2 overflow-x-auto whitespace-pre-wrap border-t border-[#e2e5e8] pt-2 font-mono text-[12px] text-[#555]">{item.diff}</pre>}
                        </>
                      ) : (
                        <div className="mt-1 text-[#6b7280]">{item.passed ? 'Скрытый сценарий пройден.' : 'Скрытый сценарий не пройден; проверьте граничные случаи.'}</div>
                      )}
                    </div>
                  )) : <div className="text-[13px] text-[#6b7280]">Hidden tests запускаются после кнопки «Отправить».</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function StepContent({
  topic,
  step,
  isCompleted,
  onStepComplete,
  onQuizPassed,
  onPracticePassed,
}: {
  topic: FlowTopic
  step: FlowStep
  isCompleted: boolean
  onStepComplete: (stepId: string) => void
  onQuizPassed: (stepId: string) => void
  onPracticePassed: (stepId: string) => void
}) {
  const primaryConcept = step.conceptCards?.[0]
  const stepSurface = {
    theory: '',
    terminology: 'border-l-3 border-[#77918a] pl-4',
    formula: 'border-l-3 border-[#7087a8] pl-4',
    intuition: 'border-l-3 border-[#d1a64c] pl-4',
    'worked-example': 'border-l-3 border-[#69be62] pl-4',
    quiz: 'border border-[#d9e6d8] bg-[#fbfdfb] p-5',
    code: 'border-l-3 border-[#4f6578] pl-4',
    practice: '',
    pitfalls: 'border border-[#eed9d9] bg-[#fffafa] p-5',
    recap: 'border border-[#d9e6d8] bg-[#f8fbf7] p-5',
    sources: 'border-t border-[#e3e6e9] pt-5',
  }[step.type]
  const stepLabel = {
    theory: 'Теория', terminology: 'Словарь', formula: 'Формулы', intuition: 'Интуиция',
    'worked-example': 'Разбор примеров', quiz: 'Проверка понимания', code: 'Кодовая демонстрация',
    practice: 'Практическая лаборатория', pitfalls: 'Аудит ошибок', recap: 'Итог урока', sources: 'Первоисточники',
  }[step.type]

  return (
    <article className={`stepik-step bg-white ${stepSurface}`}>
      <header className="mb-5">
        {step.type !== 'theory' && (
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.09em] text-[#6e777f]">{stepLabel}</div>
        )}
        <h1 className="text-[24px] font-bold leading-8 text-[#111827]">
          <RichText text={step.title} />
        </h1>
        {step.summary && !primaryConcept && !step.sections?.length && (
          <p className="mt-2 text-[15px] leading-6 text-[#111827]">
            <RichText text={step.summary} />
          </p>
        )}
      </header>

      <div className="space-y-8">
        {primaryConcept && <ConceptCardView concept={primaryConcept} />}

        {step.sections?.map((section) => {
          if (section.variant === 'function-card') {
            return <FunctionCardSection key={section.id} section={section} />
          }

          return (
            <section key={section.id}>
              <h2 className="mb-3 text-[18px] font-bold leading-7 text-[#111827]">
                <RichText text={section.title} />
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.75] text-[#111827]">
                {section.paragraphs.map((paragraph, index) => (
                  <p key={`${section.id}-${index}`}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-4 list-disc space-y-2 pl-6 text-[15px] leading-[1.7] text-[#111827]">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>
                      <RichText text={bullet} />
                    </li>
                  ))}
                </ul>
              )}
              {section.callouts?.map((item) => (
                <CalloutBlock key={`${section.id}-${item.title}-${item.body}`} title={item.title} body={item.body} tone={item.tone} />
              ))}
              {section.table && (
                <div className="mt-5 overflow-x-auto border border-[#dfe4e7] bg-white shadow-[0_1px_2px_rgba(17,24,39,0.03)]">
                  <table className="min-w-full border-collapse text-left text-[14px] leading-5 text-[#111827]">
                    <thead className="bg-[#f3f4f6]">
                      <tr>
                        {section.table.headers.map((header) => (
                          <th key={header} className="border-b border-[#e5e7eb] px-3 py-2 font-bold">
                            <RichText text={header} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row, rowIndex) => (
                        <tr key={`${section.id}-row-${rowIndex}`} className="border-t border-[#e5e7eb]">
                          {row.map((cell, cellIndex) => (
                            <td key={`${section.id}-cell-${rowIndex}-${cellIndex}`} className="px-3 py-2 align-top">
                              <RichText text={cell} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {section.codeExamples?.map((example, index) => (
                <CodeBlock
                  key={`${section.id}-code-${index}`}
                  code={example.code}
                  language={example.language}
                  output={example.output}
                  explanation={example.explanation[0]}
                />
              ))}
            </section>
          )
        })}

        {!primaryConcept && step.formulaCards && <FormulaCards cards={step.formulaCards} />}

        {step.workedExample && (
          <section>
            <h2 className="mb-2 text-[18px] font-bold leading-6 text-[#111827]">Как применять</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {step.workedExample.map((item) => (
                <article key={item.title} className="border border-[#dfe5df] bg-white px-3.5 py-3 text-[14px] leading-6 text-[#232a2e] shadow-[0_1px_2px_rgba(17,24,39,0.03)]">
                  <h3 className="font-bold text-[#345b35]">{item.title}</h3>
                  <p className="mt-1"><RichText text={item.body} /></p>
                </article>
              ))}
            </div>
          </section>
        )}

        {step.bullets && (
          <section>
            <ul className="list-disc space-y-1 pl-6 text-[15px] leading-6 text-[#111827]">
              {step.bullets.map((bullet) => (
                <li key={bullet}>
                  <RichText text={bullet} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {step.codeExample && <CodeExampleBlock example={step.codeExample} title="Примеры кода" />}

        {step.quiz && (
          <QuizWidget
            key={`${step.id}-${step.quiz.id}`}
            quiz={step.quiz}
            onPassed={() => {
              onQuizPassed(step.id)
              onStepComplete(step.id)
            }}
          />
        )}

        {step.practiceTasks?.length ? (
          <PracticeRunner
            task={step.practiceTasks[0]}
            onPassed={() => {
              onPracticePassed(step.id)
              onStepComplete(step.id)
            }}
          />
        ) : null}

        {step.sources && (
          <section className="border border-[#e2e6e8] bg-[#fafbfb] p-4">
            <h2 className="mb-3 text-[18px] font-bold leading-7 text-[#111827]">Источники</h2>
            <div className="space-y-2 text-[15px] leading-7">
              {step.sources.slice(0, 4).map((source) => (
                <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="block text-[#166534] underline underline-offset-2">
                  {source.label}
                </a>
              ))}
            </div>
          </section>
        )}

        <LocalGlossary terms={topic.terminology} />
      </div>

      <footer className="mt-9 flex items-center justify-between border-t border-[#e3e6e9] pt-4 text-[13px] text-[#7a828a]">
        <span>{isCompleted ? '✓ Шаг пройден' : 'Шаг будет засчитан автоматически при переходе'}</span>
        <span>Есть вопрос? Откройте обсуждение после урока.</span>
      </footer>
    </article>
  )
}

function DiscussionPanel({ stepId }: { stepId: string }) {
  const storageKey = `ai-train-comments:${stepId}`
  const [draft, setDraft] = useState('')
  const [comments, setComments] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? '[]') as string[]
    } catch {
      return []
    }
  })

  const addComment = () => {
    const value = draft.trim()
    if (!value) return
    const next = [...comments, value]
    setComments(next)
    localStorage.setItem(storageKey, JSON.stringify(next))
    setDraft('')
  }

  return (
    <section className="mt-12 border-t border-[#dfe3e7] pt-6">
      <h2 className="text-[20px] font-semibold text-[#2b2f33]">Комментарии</h2>
      <p className="mt-2 text-[13px] leading-5 text-[#7b838b]">Обсуждайте условие и теорию, но не публикуйте готовые решения практических заданий.</p>
      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Написать комментарий"
        rows={3}
        className="mt-4 w-full resize-y border border-[#cfd5db] px-3 py-2 text-[14px] outline-none focus:border-[#69ad62]"
      />
      <button
        type="button"
        onClick={addComment}
        disabled={!draft.trim()}
        className="mt-2 bg-[#69be62] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#58aa52] disabled:cursor-not-allowed disabled:bg-[#b8d7b5]"
      >
        Отправить
      </button>
      <div className="mt-5 space-y-3">
        {comments.map((comment, index) => (
          <article key={`${comment}-${index}`} className="border-t border-[#edf0f2] py-3 text-[14px] leading-6 text-[#34393e]">
            <div className="mb-1 text-[12px] font-semibold text-[#6a737c]">Ученик</div>
            {comment}
          </article>
        ))}
      </div>
    </section>
  )
}

export default function TopicDetailPage() {
  const { topicId = '', stepId } = useParams()
  const topic = getFlowTopicById(topicId)
  const progressApi = useProgress()
  const {
    progress,
    markStepCompleted,
    markQuizPassed,
    markPracticePassed,
    setLastVisitedStep,
    getTopicProgress,
    getSubblockProgress,
    getBlockProgress,
  } = progressApi

  const resolvedStepId = topic ? (stepId ?? topic.steps[0].id) : ''
  const currentStep = topic ? getFlowStep(topic.id, resolvedStepId) : null
  const previousStepIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (!topic || !currentStep) return
    const previousStepId = previousStepIdRef.current
    if (previousStepId && previousStepId !== currentStep.id) markStepCompleted(previousStepId)
    previousStepIdRef.current = currentStep.id
    setLastVisitedStep(topic.id, currentStep.id)
  }, [currentStep, markStepCompleted, setLastVisitedStep, topic])

  const completeCurrentStep = useCallback(() => {
    if (currentStep) markStepCompleted(currentStep.id)
  }, [currentStep, markStepCompleted])

  if (!topic) return <div className="p-6 text-[15px] text-[#111827]">Тема не найдена.</div>
  if (!currentStep) return <Navigate to={getFlowStepHref(topic.id, topic.steps[0].id)} replace />
  if (!stepId) return <Navigate to={getFlowStepHref(topic.id, resolvedStepId)} replace />

  const completedSteps = topic.steps.filter((step) => progress.completedSteps.includes(step.id)).length
  const prevNextStep = getFlowPrevNextStep(topic.id, currentStep.id)
  const prevNextTopic = getFlowPrevNextTopic(topic.id)
  const topicPercent = Math.round(getTopicProgress(topic.id) * 100)
  const currentIndex = topic.steps.findIndex((step) => step.id === currentStep.id)

  return (
    <div className="min-h-screen bg-white text-[#22272b]">
      <header className="sticky top-0 z-50 h-[52px] border-b border-black bg-[#222] text-white">
        <div className="flex h-full items-center">
          <Link to="/topics" onClick={completeCurrentStep} className="flex h-full w-[142px] shrink-0 items-center gap-2 border-r border-white/10 px-3 sm:w-[180px] lg:w-[286px] lg:px-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[12px] font-bold">AI</span>
            <span className="text-[21px] font-normal tracking-[-0.02em]">Train</span>
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-[6px] overflow-x-auto px-4 py-2">
            {topic.steps.map((step, index) => (
              <StepButton
                key={step.id}
                step={step}
                index={index}
                topicId={topic.id}
                active={step.id === currentStep.id}
                done={progress.completedSteps.includes(step.id)}
                onNavigate={completeCurrentStep}
              />
            ))}
          </div>

          <div className="hidden h-full items-center gap-3 border-l border-white/10 px-4 text-[12px] text-[#d2d2d2] md:flex">
            <span title="Прогресс темы">{topicPercent}%</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#825f49] font-bold text-white">AI</span>
          </div>
        </div>
      </header>

      <div className="flex">
        <CourseSidebar
          activeTopicId={topic.id}
          progress={progress}
          getTopicProgress={getTopicProgress}
          getSubblockProgress={getSubblockProgress}
          getBlockProgress={getBlockProgress}
          onNavigate={completeCurrentStep}
        />

        <main className="min-w-0 flex-1 bg-white">
          <div className="border-b border-[#dfe3e6] bg-[#fafafa]">
            <div className="mx-auto flex min-h-[58px] max-w-[860px] flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2 text-[13px] text-[#8a929a]">
              <span className="font-semibold text-[#30363b]">{topic.title}</span>
              <span>Шаг {currentIndex + 1} из {topic.steps.length}</span>
              <span>{completedSteps} пройдено</span>
              {topic.learningDesign && (
                <span className="basis-full text-[11px] text-[#647068] sm:basis-auto">
                  {topic.learningDesign.format} · ≈ {topic.learningDesign.estimatedMinutes} мин · {topic.learningDesign.quizQuestions} {pluralizeRussian(topic.learningDesign.quizQuestions, 'вопрос', 'вопроса', 'вопросов')} · {topic.learningDesign.practiceTasks} {pluralizeRussian(topic.learningDesign.practiceTasks, 'практика', 'практики', 'практик')}
                </span>
              )}
              <Link to="/topics" onClick={completeCurrentStep} className="ml-auto hidden text-[#518d4e] hover:underline sm:inline">Содержание курса</Link>
            </div>
          </div>

          <div className="mx-auto max-w-[860px] px-5 pb-16 pt-9 sm:px-8">
            <StepContent
              topic={topic}
              step={currentStep}
              isCompleted={progress.completedSteps.includes(currentStep.id)}
              onStepComplete={markStepCompleted}
              onQuizPassed={markQuizPassed}
              onPracticePassed={markPracticePassed}
            />

            <nav aria-label="Навигация по шагам" className="mt-9 flex flex-wrap items-center justify-between gap-3 border-t border-[#dfe3e7] pt-5">
              <div>
                {prevNextStep.prev ? (
                  <Link onClick={completeCurrentStep} to={getFlowStepHref(topic.id, prevNextStep.prev.id)} className="inline-block border border-[#bdc3c8] bg-white px-4 py-2.5 text-[14px] text-[#3f454a] hover:bg-[#f5f6f7]">
                    ← Предыдущий шаг
                  </Link>
                ) : prevNextTopic.prev ? (
                  <Link onClick={completeCurrentStep} to={getFlowStepHref(prevNextTopic.prev.id, prevNextTopic.prev.steps[prevNextTopic.prev.steps.length - 1].id)} className="inline-block border border-[#bdc3c8] bg-white px-4 py-2.5 text-[14px] text-[#3f454a] hover:bg-[#f5f6f7]">
                    ← Предыдущий урок
                  </Link>
                ) : null}
              </div>

              <div>
                {prevNextStep.next ? (
                  <Link onClick={completeCurrentStep} to={getFlowStepHref(topic.id, prevNextStep.next.id)} className="inline-block bg-[#69be62] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#58aa52]">
                    Следующий шаг →
                  </Link>
                ) : prevNextTopic.next ? (
                  <Link onClick={completeCurrentStep} to={getFlowStepHref(prevNextTopic.next.id, prevNextTopic.next.steps[0].id)} className="inline-block bg-[#69be62] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#58aa52]">
                    Следующий урок →
                  </Link>
                ) : (
                  <Link onClick={completeCurrentStep} to="/topics" className="inline-block bg-[#69be62] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#58aa52]">
                    К программе курса
                  </Link>
                )}
              </div>
            </nav>

            <DiscussionPanel key={currentStep.id} stepId={currentStep.id} />
          </div>
        </main>
      </div>
    </div>
  )
}

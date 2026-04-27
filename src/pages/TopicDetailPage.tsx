import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import CodeBlock, { ReadOnlyCodeCell } from '../components/CodeBlock'
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

const inlinePattern = /(pd\.read_csv|pd\.DataFrame|df\.head|df\.info|df\.describe|df\.columns|df\.isna|value_counts|groupby|np\.array|np\.zeros|np\.ones|np\.full|np\.arange|np\.linspace|np\.sum|np\.mean|np\.min|np\.max|np\.std|np\.var|np\.median|np\.quantile|np\.percentile|np\.where|np\.any|np\.all|np\.sort|np\.argsort|np\.unique|np\.argmax|np\.argmin|np\.random\.default_rng|rng\.integers|rng\.normal|rng\.uniform|rng\.permutation|rng\.choice|model\.fit|model\.predict|train_test_split|fit_transform|predict_proba|OneHotEncoder|OrdinalEncoder|SimpleImputer|StandardScaler|MinMaxScaler|RobustScaler|ColumnTransformer|Pipeline|LogisticRegression|LinearRegression|RandomForestClassifier|XGBClassifier|CatBoostClassifier|CrossEntropyLoss|BCEWithLogitsLoss|DataLoader|Conv2d|Transformer|random_state|learning_rate|weight_decay|n_estimators|max_depth|early_stopping_rounds|sparse_output|class_weight|batch_size|test_size|stratify|shuffle|n_splits|kernel_size|padding|num_heads|d_model|validation|precision|recall|accuracy|logits|loss|leakage|dropout|ndarray|shape|ndim|size|dtype|astype|axis|reshape|ravel|flatten|broadcasting|baseline|target|features|loc|iloc|fit|transform|predict|train|validate|AdamW|Adam|SGD|RMSprop|MAE|MSE|RMSE|R²|F1|TP|FP|FN|[A-Za-z_][A-Za-z0-9_]*(?=\())/
const richTokenPattern = /(`[^`]+`|\*\*[^*]+\*\*)/g

function RichText({ text, className = '' }: { text: string; className?: string }) {
  const renderAutoCode = (value: string, keyPrefix: string) => (
    value.split(inlinePattern).map((part, index) => {
      if (!part) return null
      if (inlinePattern.test(part)) {
        return (
          <code key={`${keyPrefix}-${part}-${index}`} className="rounded border border-[#e1e5ea] bg-[#f3f4f6] px-1 py-0.5 font-mono text-[0.92em] text-[#111827]">
            {part}
          </code>
        )
      }
      return <span key={`${keyPrefix}-${part}-${index}`}>{part}</span>
    })
  )

  return (
    <span className={className}>
      {text.split(richTokenPattern).map((part, index) => {
        if (!part) return null
        if (part.startsWith('`') && part.endsWith('`')) {
          return (
            <code key={`${part}-${index}`} className="rounded border border-[#e1e5ea] bg-[#f3f4f6] px-1 py-0.5 font-mono text-[0.92em] text-[#111827]">
              {part.slice(1, -1)}
            </code>
          )
        }
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={`${part}-${index}`}>{renderAutoCode(part.slice(2, -2), `strong-${index}`)}</strong>
        }
        return renderAutoCode(part, `text-${index}`)
      })}
    </span>
  )
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

function StepButton({ step, index, topicId, active, done }: { step: FlowStep; index: number; topicId: string; active: boolean; done: boolean }) {
  return (
    <Link
      to={getFlowStepHref(topicId, step.id)}
      title={`${index + 1}. ${step.title}`}
      className={`relative flex h-[25px] min-w-[25px] items-center justify-center rounded-[3px] border-2 text-center transition ${
        active
          ? 'border-white bg-[#65d36f] text-[#102414]'
          : done
            ? 'border-[#65d36f] bg-[#65d36f] text-[#102414]'
            : 'border-[#65d36f] bg-[#202020] text-[#65d36f] hover:bg-[#2c2c2c]'
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
    <div className={`mt-2 border-l-4 px-3 py-2 text-[14px] leading-5 text-[#111827] ${toneClass}`}>
      <div className="mb-0.5 text-[12px] font-bold uppercase tracking-[0.06em] text-[#374151]">{title}</div>
      <div className={tone === 'schema' ? 'whitespace-pre-line text-[14px]' : 'whitespace-pre-line'}>
        <RichText text={body} />
      </div>
    </div>
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

function PracticeRunner({ task, onPassed }: { task: PracticeTask; onPassed: () => void }) {
  const [code, setCode] = useState(task.starterCode)
  const [result, setResult] = useState<JudgeRunResult | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    setCode(task.starterCode)
    setResult(null)
    setIsRunning(false)
  }, [task.id, task.starterCode])

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
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-[21px] font-bold leading-7 text-[#111827]">{task.title}</h2>
        <p className="text-[15px] leading-6 text-[#111827]">{task.statement}</p>
      </div>

      <ul className="list-disc space-y-1 pl-6 text-[15px] leading-6 text-[#111827]">
        {task.tips.map((tip) => <li key={tip}>{tip}</li>)}
      </ul>

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

      <CodeEditor value={code} onChange={setCode} height={320} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void runJudge(false)}
            disabled={isRunning}
            className="bg-[#202020] px-4 py-2 text-[14px] font-bold text-white hover:bg-[#333] disabled:cursor-wait disabled:bg-[#777]"
          >
            {isRunning ? 'Запуск...' : 'Запустить sample'}
          </button>
          <button
            type="button"
            onClick={() => void runJudge(true)}
            disabled={isRunning}
            className="bg-[#65d36f] px-4 py-2 text-[14px] font-bold text-[#102414] hover:bg-[#58c763] disabled:cursor-wait disabled:bg-[#a8e4ae]"
          >
            {isRunning ? 'Проверяем...' : 'Отправить'}
          </button>
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
        <div className="text-[13px] text-[#6b7280]">Time limit: 15 sec · Memory limit: 256 MB</div>
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
                      <div className="mt-1 text-[#6b7280]">expected: {item.expected}</div>
                      <div className="text-[#6b7280]">actual: {item.actual}</div>
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

function StepContent({ step, isCompleted, onStepComplete }: { step: FlowStep; isCompleted: boolean; onStepComplete: (stepId: string) => void }) {
  const primaryConcept = step.conceptCards?.[0]

  return (
    <article className="bg-white">
      <header className="mb-5">
        <h1 className="text-[24px] font-bold leading-8 text-[#111827]">
          <RichText text={step.title} />
        </h1>
        {step.summary && !primaryConcept && (
          <p className="mt-2 text-[15px] leading-6 text-[#111827]">
            <RichText text={step.summary} />
          </p>
        )}
      </header>

      <div className="space-y-4">
        {primaryConcept && <ConceptCardView concept={primaryConcept} />}

        {step.sections?.map((section) => (
          <section key={section.id}>
            <h2 className="mb-1.5 text-[18px] font-bold leading-6 text-[#111827]">
              <RichText text={section.title} />
            </h2>
            <div className="space-y-1.5 text-[15px] leading-[1.55] text-[#111827]">
              {section.paragraphs.map((paragraph, index) => (
                <p key={`${section.id}-${index}`}>
                  <RichText text={paragraph} />
                </p>
              ))}
            </div>
            {section.bullets && (
              <ul className="mt-2 list-disc space-y-1 pl-6 text-[15px] leading-[1.55] text-[#111827]">
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
              <div className="mt-2 overflow-x-auto border border-[#e5e7eb]">
                <table className="min-w-full border-collapse text-left text-[14px] leading-5 text-[#111827]">
                  <thead className="bg-[#f3f4f6]">
                    <tr>
                      {section.table.headers.map((header) => (
                        <th key={header} className="border-b border-[#e5e7eb] px-2.5 py-1.5 font-bold">
                          <RichText text={header} />
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row, rowIndex) => (
                      <tr key={`${section.id}-row-${rowIndex}`} className="border-t border-[#e5e7eb]">
                        {row.map((cell, cellIndex) => (
                          <td key={`${section.id}-cell-${rowIndex}-${cellIndex}`} className="px-2.5 py-1.5 align-top">
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
        ))}

        {!primaryConcept && step.formulaCards && <FormulaCards cards={step.formulaCards} />}

        {step.workedExample && (
          <section>
            <h2 className="mb-2 text-[18px] font-bold leading-6 text-[#111827]">Как применять</h2>
            <ul className="list-disc space-y-1 pl-6 text-[15px] leading-6 text-[#111827]">
              {step.workedExample.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}</strong>: <RichText text={item.body} />
                </li>
              ))}
            </ul>
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

        {step.quiz && <QuizWidget key={`${step.id}-${step.quiz.id}`} quiz={step.quiz} />}

        {step.practiceTasks?.length ? <PracticeRunner task={step.practiceTasks[0]} onPassed={() => onStepComplete(step.id)} /> : null}

        {step.sources && (
          <section>
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
      </div>

      <footer className="mt-8 border-t border-[#e5e7eb] pt-4">
        <button
          type="button"
          onClick={() => onStepComplete(step.id)}
          className={`px-4 py-2 text-[14px] font-bold ${isCompleted ? 'bg-[#eefaf1] text-[#1f6e3a]' : 'bg-[#202020] text-white hover:bg-[#333]'}`}
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

  if (!topic) return <div className="p-6 text-[15px] text-[#111827]">Тема не найдена.</div>
  if (!currentStep) return <Navigate to={getFlowStepHref(topic.id, topic.steps[0].id)} replace />
  if (!stepId) return <Navigate to={getFlowStepHref(topic.id, resolvedStepId)} replace />

  const completedSteps = topic.steps.filter((step) => progress.completedSteps.includes(step.id)).length
  const prevNextStep = getFlowPrevNextStep(topic.id, currentStep.id)
  const prevNextTopic = getFlowPrevNextTopic(topic.id)

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      <header className="sticky top-0 z-50 h-[48px] border-b border-[#3a3a3a] bg-[#202020] text-white">
        <div className="flex h-full items-center gap-4 px-4">
          <Link to="/topics" className="flex h-full w-[232px] shrink-0 items-center gap-2">
            <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[13px] font-bold leading-none">AI</span>
            <span className="text-[25px] font-normal leading-none">Train</span>
          </Link>

          <div className="flex min-w-0 flex-1 items-center gap-[5px] overflow-x-auto py-2">
            {topic.steps.map((step, index) => (
              <StepButton
                key={step.id}
                step={step}
                index={index}
                topicId={topic.id}
                active={step.id === currentStep.id}
                done={progress.completedSteps.includes(step.id)}
              />
            ))}
          </div>

          <div className="hidden items-center gap-2 text-[12px] text-[#d1d5db] xl:flex">
            <span className="rounded bg-[#2f2f2f] px-2 py-1">0</span>
            <span className="rounded bg-[#8b6b55] px-2 py-1 font-bold text-white">AI</span>
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
        />

        <main className="min-w-0 flex-1 bg-white">
          <div className="border-b border-[#e5e7eb] bg-white">
            <div className="mx-auto flex min-h-[55px] max-w-[920px] items-center gap-4 px-4 text-[14px] text-[#9ca3af]">
              <span className="font-normal text-[#111827]">{topic.title}</span>
              <span>{completedSteps} из {topic.steps.length} шагов пройдено</span>
              <span>{Math.round(getTopicProgress(topic.id) * 100)}% завершено</span>
            </div>
          </div>

          <div className="mx-auto max-w-[920px] px-4 py-9">
            <StepContent step={currentStep} isCompleted={progress.completedSteps.includes(currentStep.id)} onStepComplete={markStepCompleted} />

            <nav className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e7eb] pt-4">
              <div>
                {prevNextStep.prev ? (
                  <Link to={getFlowStepHref(topic.id, prevNextStep.prev.id)} className="border border-[#d1d5db] px-4 py-2 text-[14px] text-[#111827] hover:bg-[#f3f4f6]">
                    Предыдущий шаг
                  </Link>
                ) : prevNextTopic.prev ? (
                  <Link to={getFlowStepHref(prevNextTopic.prev.id, prevNextTopic.prev.steps[prevNextTopic.prev.steps.length - 1].id)} className="border border-[#d1d5db] px-4 py-2 text-[14px] text-[#111827] hover:bg-[#f3f4f6]">
                    Предыдущая тема
                  </Link>
                ) : null}
              </div>

              <div>
                {prevNextStep.next ? (
                  <Link to={getFlowStepHref(topic.id, prevNextStep.next.id)} className="bg-[#65d36f] px-4 py-2 text-[14px] font-bold text-[#102414] hover:bg-[#58c763]">
                    Следующий шаг
                  </Link>
                ) : prevNextTopic.next ? (
                  <Link to={getFlowStepHref(prevNextTopic.next.id, prevNextTopic.next.steps[0].id)} className="bg-[#65d36f] px-4 py-2 text-[14px] font-bold text-[#102414] hover:bg-[#58c763]">
                    Следующая тема
                  </Link>
                ) : (
                  <Link to="/topics" className="bg-[#65d36f] px-4 py-2 text-[14px] font-bold text-[#102414] hover:bg-[#58c763]">
                    К программе курса
                  </Link>
                )}
              </div>
            </nav>
          </div>
        </main>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { flowCourseBlocks, flowTopics, getFlowStepHref } from '../data/courseFlow'
import { useProgress } from '../hooks/useProgress'

export default function TopicsPage() {
  const { getCourseProgress, getBlockProgress, getTopicProgress, progress } = useProgress()
  const totalSteps = flowCourseBlocks.reduce(
    (sum, block) => sum + block.subblocks.reduce((inner, subblock) => inner + subblock.themes.reduce((acc, topic) => acc + topic.steps.length, 0), 0),
    0,
  )
  const totalConcepts = flowTopics.reduce((sum, topic) => {
    const theory = topic.steps.find((step) => step.type === 'theory')
    return sum + (theory?.conceptCards?.length ?? 0)
  }, 0)
  const totalPractice = flowTopics.reduce((sum, topic) => sum + topic.steps.filter((step) => step.practiceTasks?.length).length, 0)

  const sideNav = [
    { label: 'Программа', to: '/topics' },
    { label: 'Справочник', to: '/terms-functions' },
    { label: 'Сравнения', to: '/comparison' },
    { label: 'Шпаргалка', to: '/cheatsheet' },
    { label: 'Яндекс теория', to: '/yandex-theory' },
  ]

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 lg:px-6">
      <div className="grid gap-6 xl:grid-cols-[300px,minmax(0,1fr)]">
        <aside className="h-fit overflow-hidden border border-[#d9dee4] bg-white shadow-[0_16px_40px_-28px_rgba(30,37,45,0.65)]">
          <div className="border-b border-[#e2e6eb] bg-[#1f2329] px-5 py-5 text-white">
            <div className="inline-flex h-9 w-9 items-center justify-center bg-[#45b96a] text-[12px] font-bold text-[#0d2313]">AI</div>
            <h1 className="mt-4 text-[20px] font-semibold tracking-[-0.02em]">AI Train</h1>
            <div className="mt-2 text-[13px] leading-6 text-[#d3dde7]">Полный русскоязычный курс по AI/ML: теория, формулы, код, тесты и автопрактика.</div>
          </div>

          <div className="border-b border-[#e2e6eb] px-5 py-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[12px] text-[#5d6977]">Общий прогресс</div>
                <div className="mt-1 text-[28px] font-semibold text-[#1f252c]">{Math.round(getCourseProgress() * 100)}%</div>
              </div>
              <div className="text-right text-[12px] text-[#6d7887]">
                <div>{progress.completedSteps.length}/{totalSteps}</div>
                <div>шагов</div>
              </div>
            </div>
            <div className="mt-3 h-1.5 bg-[#e8edf3]">
              <div className="h-1.5 bg-[#42b865]" style={{ width: `${getCourseProgress() * 100}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-3 border-b border-[#e2e6eb] text-center">
            <div className="border-r border-[#edf1f5] px-2 py-3">
              <div className="text-[18px] font-semibold text-[#1f252c]">{flowTopics.length}</div>
              <div className="text-[11px] text-[#687481]">тем</div>
            </div>
            <div className="border-r border-[#edf1f5] px-2 py-3">
              <div className="text-[18px] font-semibold text-[#1f252c]">{totalConcepts}</div>
              <div className="text-[11px] text-[#687481]">функций</div>
            </div>
            <div className="px-2 py-3">
              <div className="text-[18px] font-semibold text-[#1f252c]">{totalPractice}</div>
              <div className="text-[11px] text-[#687481]">практик</div>
            </div>
          </div>

          <nav className="px-2 py-2">
            {sideNav.map((item, index) => (
              <Link
                key={item.label}
                to={item.to}
                className={`block w-full px-3 py-2 text-left text-[13px] ${index === 0 ? 'bg-[#eef7f0] font-semibold text-[#1f5f2f]' : 'text-[#5d6977] hover:bg-[#f5f7fa]'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="border border-[#d9dee4] bg-white">
          <header className="border-b border-[#e2e6eb] px-6 py-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#2f7a46]">Учебная траектория</div>
            <h2 className="mt-2 text-[26px] font-semibold tracking-[-0.02em] text-[#1e2329]">От Python и данных до CNN, Transformer overview и production AI</h2>
            <p className="mt-2 max-w-4xl text-[14px] leading-7 text-[#566273]">
              Каждый урок построен по одному контракту: что это, зачем нужно, где применяют, формула, применение, параметры, код, частые ошибки, тест из 5 вопросов и практика с hidden tests.
            </p>
          </header>

          <div className="divide-y divide-[#e8ecf1]">
            {flowCourseBlocks.map((block) => {
              const blockProgress = Math.round(getBlockProgress(block.id) * 100)
              const blockTopics = block.subblocks.flatMap((subblock) => subblock.themes)
              const blockConcepts = blockTopics.reduce((sum, topic) => {
                const theory = topic.steps.find((step) => step.type === 'theory')
                return sum + (theory?.conceptCards?.length ?? 0)
              }, 0)

              return (
                <article key={block.id} className="px-6 py-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-9 w-9 items-center justify-center border border-[#dce3ea] bg-[#f7fafc] text-[12px] font-bold text-[#2e3a48]">{block.icon}</span>
                        <div>
                          <h3 className="text-[19px] font-semibold text-[#21272f]">{block.order}. {block.title}</h3>
                          <p className="mt-1 text-[13px] leading-6 text-[#667381]">{block.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="min-w-[180px] border border-[#e2e8f0] bg-[#fbfcfe] px-4 py-3">
                      <div className="flex items-center justify-between text-[12px] text-[#637083]">
                        <span>{blockTopics.length} тем</span>
                        <span>{blockConcepts} функций</span>
                      </div>
                      <div className="mt-2 text-[16px] font-semibold text-[#1f2c3a]">{blockProgress}%</div>
                      <div className="mt-2 h-1.5 bg-[#e8edf3]">
                        <div className="h-1.5 bg-[#42b865]" style={{ width: `${blockProgress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    {block.subblocks.map((subblock) => (
                      <section key={subblock.id} className="border border-[#e2e7ed] bg-[#fbfcfe]">
                        <div className="border-b border-[#e8edf3] px-4 py-3">
                          <div className="text-[13px] font-semibold text-[#1f2833]">{block.order}.{subblock.order} {subblock.title}</div>
                          <div className="mt-1 text-[12px] leading-5 text-[#697687]">{subblock.description}</div>
                        </div>
                        <div className="divide-y divide-[#edf1f5] bg-white">
                          {subblock.themes.map((topic) => {
                            const href = getFlowStepHref(topic.id, progress.lastVisitedStep[topic.id] ?? topic.steps[0].id)
                            const topicProgress = Math.round(getTopicProgress(topic.id) * 100)
                            const theory = topic.steps.find((step) => step.type === 'theory')
                            const conceptCount = theory?.conceptCards?.length ?? 0
                            const questionCount = topic.steps.find((step) => step.type === 'quiz')?.quiz?.questions.length ?? 0

                            return (
                              <Link key={topic.id} to={href} className="grid gap-3 px-4 py-4 transition hover:bg-[#f8fafc] md:grid-cols-[minmax(0,1fr),170px]">
                                <div>
                                  <div className="text-[15px] font-semibold text-[#25303d]">{topic.title}</div>
                                  <p className="mt-1 text-[13px] leading-6 text-[#667381]">{topic.summary}</p>
                                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-[#697687]">
                                    <span>{conceptCount} функций/методов</span>
                                    <span>{questionCount} вопросов</span>
                                    <span>practice + hidden tests</span>
                                  </div>
                                </div>
                                <div className="self-center">
                                  <div className="text-right text-[13px] font-semibold text-[#1f2c3a]">{topicProgress}%</div>
                                  <div className="mt-2 h-1.5 bg-[#e8edf3]">
                                    <div className="h-1.5 bg-[#42b865]" style={{ width: `${topicProgress}%` }} />
                                  </div>
                                </div>
                              </Link>
                            )
                          })}
                        </div>
                      </section>
                    ))}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}

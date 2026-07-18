import { Link } from 'react-router-dom'
import { flowCourseBlocks, flowTopics, getFlowStepHref } from '../data/courseFlow'
import { useProgress } from '../hooks/useProgress'

function getLessonCounts(topic: (typeof flowTopics)[number]) {
  const questions = topic.steps.reduce((sum, step) => sum + (step.quiz?.questions.length ?? 0), 0)
  const practices = topic.steps.reduce((sum, step) => sum + (step.practiceTasks?.length ?? 0), 0)
  const examples = topic.steps.reduce((sum, step) => sum
    + (step.workedExample?.length ?? 0)
    + (step.codeExample ? 1 : 0)
    + (step.sections?.reduce((sectionSum, section) => sectionSum + (section.codeExamples?.length ?? 0), 0) ?? 0), 0)
  return { questions, practices, examples }
}

function pluralize(count: number, one: string, few: string, many: string) {
  const tail = count % 100
  if (tail >= 11 && tail <= 14) return many
  if (count % 10 === 1) return one
  if (count % 10 >= 2 && count % 10 <= 4) return few
  return many
}

export default function TopicsPage() {
  const { getCourseProgress, getBlockProgress, getTopicProgress, progress } = useProgress()
  const totalSteps = flowTopics.reduce((sum, topic) => sum + topic.steps.length, 0)
  const completed = progress.completedSteps.length
  const coursePercent = Math.round(getCourseProgress() * 100)
  const firstTopic = flowTopics[0]
  const lastVisitedTopic = flowTopics.find((topic) => progress.lastVisitedStep[topic.id])
  const continueTopic = lastVisitedTopic ?? firstTopic
  const continueStepId = continueTopic ? (progress.lastVisitedStep[continueTopic.id] ?? continueTopic.steps[0].id) : ''

  return (
    <div className="min-h-[calc(100vh-48px)] bg-[#f1f2f3] pb-14">
      <section className="border-b border-[#d9dde0] bg-white">
        <div className="mx-auto max-w-[1180px] px-5 py-6">
          <div className="text-[13px] text-[#7b838b]">Курс · Data Science</div>
          <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#252a2e]">Машинное обучение с нуля</h1>
              <p className="mt-2 max-w-[760px] text-[14px] leading-6 text-[#626b73]">
                Python и ML с нуля — до воспроизводимого исследования генов, белков, рака, biomedical NLP и submission-ready структуры научной статьи.
              </p>
              <div className="mt-3 max-w-[760px] border-l-3 border-[#69be62] bg-[#f6faf5] px-3 py-2 text-[12px] leading-5 text-[#4d5b50]">
                Сквозные кейсы: Gamma Knife, скрининг диабета ASPA, cancer genomics, protein sequence ML и извлечение доказательств из биомедицинских текстов.
              </div>
            </div>
            {continueTopic && (
              <Link to={getFlowStepHref(continueTopic.id, continueStepId)} className="inline-flex w-fit items-center bg-[#69be62] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[#58aa52]">
                Продолжить обучение →
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="border-b border-[#d9dde0] bg-white">
        <nav className="mx-auto flex max-w-[1180px] gap-7 overflow-x-auto px-5 text-[14px] text-[#657078]">
          {['Описание', 'Отзывы', 'Программа', 'Комментарии', 'Новости'].map((label) => (
            <span key={label} className={`whitespace-nowrap border-b-2 py-3 ${label === 'Программа' ? 'border-[#69be62] font-semibold text-[#2d3338]' : 'border-transparent'}`}>
              {label}
            </span>
          ))}
        </nav>
      </div>

      <div className="mx-auto grid max-w-[1180px] gap-6 px-5 pt-6 lg:grid-cols-[250px,minmax(0,1fr)]">
        <aside className="h-fit border border-[#d6dbe0] bg-white">
          <div className="border-b border-[#e2e6e9] p-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[12px] text-[#7a838b]">Ваш прогресс</div>
                <div className="mt-1 text-[30px] font-semibold text-[#2a3035]">{coursePercent}%</div>
              </div>
              <div className="text-right text-[12px] leading-5 text-[#818991]">{completed}<br />из {totalSteps} шагов</div>
            </div>
            <div className="mt-3 h-[6px] bg-[#e6e9eb]">
              <div className="h-full bg-[#69be62]" style={{ width: `${coursePercent}%` }} />
            </div>
          </div>
          <nav className="py-2 text-[13px]">
            <Link to="/topics" className="block border-l-3 border-[#69be62] bg-[#f0f8ef] px-4 py-2.5 font-semibold text-[#315d2f]">Программа</Link>
            <Link to="/terms-functions" className="block px-4 py-2.5 text-[#59636c] hover:bg-[#f6f7f8]">Справочник</Link>
            <Link to="/comparison" className="block px-4 py-2.5 text-[#59636c] hover:bg-[#f6f7f8]">Сравнение моделей</Link>
            <Link to="/cheatsheet" className="block px-4 py-2.5 text-[#59636c] hover:bg-[#f6f7f8]">Шпаргалка</Link>
          </nav>
        </aside>

        <main className="border border-[#d6dbe0] bg-white">
          <header className="border-b border-[#e1e5e8] px-6 py-5">
            <h2 className="text-[22px] font-semibold text-[#2a3035]">Содержание курса</h2>
            <p className="mt-1 text-[13px] text-[#747e86]">
              {flowCourseBlocks.length} {pluralize(flowCourseBlocks.length, 'модуль', 'модуля', 'модулей')} · {flowTopics.length} {pluralize(flowTopics.length, 'урок', 'урока', 'уроков')} · {totalSteps} интерактивных {pluralize(totalSteps, 'шаг', 'шага', 'шагов')}
            </p>
          </header>

          <div>
            {flowCourseBlocks.map((block) => {
              const topics = block.subblocks.flatMap((subblock) => subblock.themes)
              const blockSteps = topics.reduce((sum, topic) => sum + topic.steps.length, 0)
              const blockPercent = Math.round(getBlockProgress(block.id) * 100)

              return (
                <section key={block.id} className="border-b border-[#e1e5e8] last:border-b-0">
                  <div className="flex items-start gap-4 bg-[#f7f8f9] px-6 py-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e7e9eb] text-[12px] font-semibold text-[#596168]">{block.order}</div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[16px] font-semibold text-[#2d3338]">{block.title}</h3>
                      <p className="mt-1 text-[12px] leading-5 text-[#747d85]">{block.description}</p>
                    </div>
                    <div className="hidden min-w-[135px] text-right sm:block">
                      <div className="text-[11px] text-[#838b92]">{topics.length} {pluralize(topics.length, 'урок', 'урока', 'уроков')} · {blockSteps} {pluralize(blockSteps, 'шаг', 'шага', 'шагов')}</div>
                      <div className="mt-2 h-1 bg-[#dfe3e5]"><div className="h-1 bg-[#69be62]" style={{ width: `${blockPercent}%` }} /></div>
                    </div>
                  </div>

                  <div className="divide-y divide-[#eceff1]">
                    {topics.map((topic) => {
                      const firstStep = topic.steps[0]
                      const href = getFlowStepHref(topic.id, progress.lastVisitedStep[topic.id] ?? firstStep.id)
                      const percent = Math.round(getTopicProgress(topic.id) * 100)
                      const counts = getLessonCounts(topic)

                      return (
                        <Link key={topic.id} to={href} className="grid gap-3 px-6 py-4 hover:bg-[#fbfcfc] sm:grid-cols-[minmax(0,1fr),150px]">
                          <div className="flex min-w-0 gap-3">
                            <span className={`mt-[3px] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[10px] ${percent === 100 ? 'border-[#69be62] bg-[#69be62] text-white' : 'border-[#b8bfc5] text-transparent'}`}>✓</span>
                            <div className="min-w-0">
                              <h4 className="text-[14px] font-semibold text-[#343a40]">{topic.title}</h4>
                              <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#768089]">{topic.summary}</p>
                              {topic.learningDesign ? (
                                <div className="mt-2 space-y-1 text-[11px] text-[#838c94]">
                                  <div className="font-medium text-[#657169]">{topic.learningDesign.format} · ≈ {topic.learningDesign.estimatedMinutes} мин</div>
                                  <div>{counts.questions} {pluralize(counts.questions, 'вопрос', 'вопроса', 'вопросов')} · {counts.practices} {pluralize(counts.practices, 'практика', 'практики', 'практик')} · {counts.examples} {pluralize(counts.examples, 'пример', 'примера', 'примеров')} · {topic.steps.length} шагов</div>
                                </div>
                              ) : (
                                <div className="mt-1 text-[11px] text-[#939aa1]">{topic.steps.length} шагов · {counts.questions} вопросов · {counts.practices} практика</div>
                              )}
                            </div>
                          </div>
                          <div className="self-center text-right">
                            <div className="text-[12px] font-semibold text-[#626b72]">{percent}%</div>
                            <div className="mt-2 h-1 bg-[#e3e6e8]"><div className="h-1 bg-[#69be62]" style={{ width: `${percent}%` }} /></div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}

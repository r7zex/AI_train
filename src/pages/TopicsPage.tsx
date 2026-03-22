import { Link } from 'react-router-dom'
import { flowCourseBlocks, getFlowStepHref } from '../data/courseFlow'
import { useProgress } from '../hooks/useProgress'

export default function TopicsPage() {
  const { getBlockProgress, getSubblockProgress, getTopicProgress, progress } = useProgress()

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-8 lg:px-6">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="text-xs uppercase tracking-[0.2em] text-emerald-700">Course map</div>
        <h1 className="mt-3 text-4xl font-bold text-slate-950">Карта курса: блоки, подблоки, темы и Lesson Flow</h1>
        <p className="mt-4 max-w-5xl text-base leading-8 text-slate-600">
          Эта страница показывает иерархию курса в «чистом» виде: блоки отделены друг от друга, подблоки не слипаются,
          каждая тема подписана прогрессом и количеством шагов. Внутри темы студент проходит 11 последовательных шагов:
          вводная теория, терминология, формулы, интуиция, ручной разбор, квиз, код, практика, ловушки, конспект и источники.
        </p>
      </section>

      <div className="mt-8 space-y-8">
        {flowCourseBlocks.map((block) => (
          <section key={block.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-emerald-700">Блок {block.order}</div>
                <h2 className="mt-2 text-3xl font-bold text-slate-950">{block.icon} {block.title}</h2>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">{block.description}</p>
              </div>
              <div className="min-w-[280px] rounded-3xl bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-900">Прогресс по блоку</div>
                <div className="mt-2 text-3xl font-bold text-slate-950">{Math.round(getBlockProgress(block.id) * 100)}%</div>
                <div className="mt-2 h-2 rounded-full bg-slate-200">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${getBlockProgress(block.id) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              {block.subblocks.map((subblock) => (
                <article key={subblock.id} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Подблок</div>
                      <h3 className="mt-2 text-xl font-bold text-slate-950">{block.order}.{subblock.order} {subblock.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-600">{subblock.description}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">{Math.round(getSubblockProgress(subblock.id) * 100)}%</div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {subblock.themes.map((topic) => {
                      const done = progress.completedTopics.includes(topic.id)
                      const progressValue = getTopicProgress(topic.id)
                      return (
                        <Link key={topic.id} to={getFlowStepHref(topic.id, progress.lastVisitedStep[topic.id] ?? topic.steps[0].id)} className="block rounded-[24px] border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:bg-emerald-50/30">
                          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="text-lg font-semibold text-slate-950">{topic.title}</div>
                              <p className="mt-2 text-sm leading-7 text-slate-600">{topic.summary}</p>
                            </div>
                            <div className={`rounded-full px-3 py-2 text-xs font-semibold ${done ? 'bg-emerald-100 text-emerald-700' : progressValue > 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                              {done ? 'completed' : progressValue > 0 ? 'in progress' : 'not started'}
                            </div>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {topic.steps.map((step) => (
                              <span key={step.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">{step.title}</span>
                            ))}
                          </div>
                        </Link>
                      )
                    })}
                  </div>

                  <div className="mt-5 rounded-3xl bg-slate-950 p-4 text-white">
                    <div className="text-sm font-semibold">Агрегированная шпаргалка подблока</div>
                    <div className="mt-3 grid gap-2">
                      {subblock.cheatsheet.slice(0, 8).map((item) => (
                        <div key={item} className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-200">{item}</div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { flowCourseBlocks, getFlowStepHref } from '../data/courseFlow'
import { useProgress } from '../hooks/useProgress'

export default function TopicsPage() {
  const { getCourseProgress, getBlockProgress, getTopicProgress, progress } = useProgress()
  const totalSteps = flowCourseBlocks.reduce(
    (sum, block) => sum + block.subblocks.reduce((inner, subblock) => inner + subblock.themes.reduce((acc, topic) => acc + topic.steps.length, 0), 0),
    0,
  )

  const sideNav = [
    { label: 'Описание', to: '/topics' },
    { label: 'Справочник', to: '/terms-functions' },
    { label: 'Сравнения', to: '/comparison' },
    { label: 'Шпаргалка', to: '/cheatsheet' },
    { label: 'Яндекс теория', to: '/yandex-theory' },
  ]

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-6 lg:px-6">
      <div className="grid gap-6 lg:grid-cols-[280px,minmax(0,1fr)]">
        <aside className="overflow-hidden rounded-xl border border-[#d9dee4] bg-white shadow-[0_12px_30px_-20px_rgba(30,37,45,0.5)]">
          <div className="border-b border-[#e2e6eb] bg-gradient-to-br from-[#eff6ff] to-[#f3f9f4] px-4 py-4">
            <div className="h-20 w-full rounded-lg bg-[radial-gradient(circle_at_top_left,#d9e8ff,#eef2f7)]" />
            <h1 className="mt-3 text-[16px] font-semibold text-[#1e2329]">AI Train: Python и ML</h1>
            <div className="mt-1 text-[12px] text-[#6e7a88]">Практический курс с локальным раннером</div>
          </div>

          <div className="border-b border-[#e2e6eb] px-4 py-4">
            <div className="text-[12px] text-[#5d6977]">Общий прогресс</div>
            <div className="mt-2 text-[20px] font-semibold text-[#1f252c]">{Math.round(getCourseProgress() * 100)}%</div>
            <div className="mt-2 h-1.5 bg-[#e8edf3]">
              <div className="h-1.5 bg-[#42b865]" style={{ width: `${getCourseProgress() * 100}%` }} />
            </div>
            <div className="mt-2 text-[11px] text-[#7b8795]">Шагов завершено: {progress.completedSteps.length}/{totalSteps}</div>
          </div>

          <nav className="px-2 py-2">
            {sideNav.map((item, index) => (
              <Link
                key={item.label}
                to={item.to}
                className={`block w-full rounded-md px-2 py-2 text-left text-[12px] ${index === 0 ? 'bg-[#eef7f0] font-semibold text-[#1f5f2f]' : 'text-[#5d6977] hover:bg-[#f5f7fa]'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="border border-[#d9dee4] bg-white">
          <header className="border-b border-[#e2e6eb] px-5 py-4">
            <h2 className="text-[18px] font-semibold text-[#1e2329]">Программа курса</h2>
            <p className="mt-1 text-[12px] text-[#687481]">Плотная теория, короткие кодовые шаги и проверка решений через stdin → stdout.</p>
          </header>

          <div className="divide-y divide-[#e8ecf1]">
            {flowCourseBlocks.map((block) => (
              <article key={block.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#21272f]">
                      {block.order}. {block.title}
                    </h3>
                    <p className="mt-1 text-[12px] text-[#667381]">{block.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-semibold text-[#1f2c3a]">{Math.round(getBlockProgress(block.id) * 100)}%</div>
                    <div className="mt-1 h-1.5 w-20 bg-[#e8edf3]">
                      <div className="h-1.5 bg-[#42b865]" style={{ width: `${getBlockProgress(block.id) * 100}%` }} />
                    </div>
                  </div>
                </div>

                <div className="mt-3 border border-[#e2e7ed]">
                  {block.subblocks.flatMap((subblock) =>
                    subblock.themes.map((topic) => {
                      const href = getFlowStepHref(topic.id, progress.lastVisitedStep[topic.id] ?? topic.steps[0].id)
                      const topicProgress = Math.round(getTopicProgress(topic.id) * 100)

                      return (
                        <Link key={topic.id} to={href} className="flex items-center justify-between border-b border-[#edf1f5] px-3 py-2 text-[12px] last:border-b-0 hover:bg-[#f8fafc]">
                          <span className="text-[#25303d]">{topic.title}</span>
                          <span className="text-[#657383]">{topicProgress}%</span>
                        </Link>
                      )
                    }),
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

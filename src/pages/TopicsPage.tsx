import { Link } from 'react-router-dom'
import { courseBlocks } from '../data/course'

export default function TopicsPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 lg:px-6">
      <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
        <div className="max-w-4xl">
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#2e7d32]">Курс иерархией</div>
          <h1 className="mt-3 text-3xl font-bold text-[#161616] lg:text-4xl">Блок → Подблок → Тема</h1>
          <p className="mt-3 text-base leading-7 text-[#666]">
            Структура укрупнена по смыслу, чтобы не было сотни мелких бессвязных элементов. Теперь материал идёт крупными
            последовательными блоками, а внутри каждой темы есть одинаковый понятный поток шагов: теория, ошибки,
            интервью, 5 квизов, 5 практик и финальная шпаргалка.
          </p>
        </div>
      </section>

      <div className="mt-8 space-y-6">
        {courseBlocks.map((block) => (
          <section key={block.id} className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col gap-3 border-b border-black/8 pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-sm font-semibold text-[#2e7d32]">Блок {block.order}</div>
                <h2 className="mt-1 text-2xl font-bold text-[#151515]">{block.icon} {block.title}</h2>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-[#666]">{block.description}</p>
              </div>
              <div className="rounded-2xl bg-[#f1f7ed] px-4 py-3 text-sm font-semibold text-[#2e7d32]">
                {block.subblocks.length} подблоков · {block.subblocks.reduce((sum, subblock) => sum + subblock.themes.length, 0)} тем
              </div>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-2">
              {block.subblocks.map((subblock) => (
                <article key={subblock.id} className="rounded-[24px] border border-black/10 bg-[#fafaf8] p-5">
                  <div className="text-sm font-semibold text-[#202020]">{block.order}.{subblock.order} {subblock.title}</div>
                  <p className="mt-2 text-sm leading-6 text-[#6a6a6a]">{subblock.description}</p>

                  <div className="mt-4 space-y-3">
                    {subblock.themes.map((theme, index) => (
                      <Link
                        key={theme.id}
                        to={`/topics/${theme.id}`}
                        className="group block rounded-[20px] border border-black/8 bg-white p-4 transition hover:border-[#69d05c] hover:shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-sm font-semibold text-[#202020]">
                              {block.order}.{subblock.order}.{index + 1} {theme.title}
                            </div>
                            <div className="mt-1 text-sm leading-6 text-[#6a6a6a]">{theme.summary}</div>
                          </div>
                          <div className="rounded-xl bg-[#eef8ea] px-3 py-2 text-xs font-semibold text-[#2e7d32]">
                            {theme.steps.length} шагов
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#777]">
                          <span className="rounded-full bg-[#f3f3f1] px-3 py-1">5 квизов</span>
                          <span className="rounded-full bg-[#f3f3f1] px-3 py-1">5 кодовых задач</span>
                          <span className="rounded-full bg-[#f3f3f1] px-3 py-1">шпаргалка темы</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#1f1f1f] p-4 text-sm text-white/78">
                    <div className="font-semibold text-white">Шпаргалка подблока</div>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {subblock.cheatsheet.slice(0, 6).map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
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

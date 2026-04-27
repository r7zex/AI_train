import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { flowCourseBlocks, flowTopics, getFlowStepHref, searchIndex } from '../data/courseFlow'
import { useProgress } from '../hooks/useProgress'

const quickActions = [
  { title: 'Открыть курс', description: 'Перейти к полной программе и дереву блоков.', href: '/topics', tone: 'bg-slate-950 text-white' },
  { title: 'Шпаргалки', description: 'Быстрый доступ к формулам, терминам и опорным идеям.', href: '/cheatsheet', tone: 'bg-white text-slate-900 border border-slate-200' },
  { title: 'Сравнения', description: 'Свести рядом метрики, модели и ключевые различия.', href: '/comparison', tone: 'bg-white text-slate-900 border border-slate-200' },
]

export default function HomePage() {
  const [query, setQuery] = useState('')
  const { getCourseProgress } = useProgress()
  const normalized = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!normalized) return searchIndex.slice(0, 9)
    return searchIndex.filter((item) =>
      item.title.toLowerCase().includes(normalized)
      || item.subtitle.toLowerCase().includes(normalized)
      || item.text.toLowerCase().includes(normalized),
    ).slice(0, 12)
  }, [normalized])

  const totalSteps = flowTopics.reduce((sum, topic) => sum + topic.steps.length, 0)
  const totalPractice = flowTopics.reduce((sum, topic) => sum + topic.steps.filter((step) => step.practiceTasks?.length).length, 0)
  const totalTheory = flowTopics.reduce((sum, topic) => sum + topic.steps.filter((step) => step.type === 'theory').length, 0)
  const stats = [
    { label: 'Блоков', value: flowCourseBlocks.length, note: 'крупные разделы курса' },
    { label: 'Тем', value: flowTopics.length, note: 'каждая тема разбита на шаги' },
    { label: 'Шагов', value: totalSteps, note: 'теория, тесты и практика' },
    { label: 'Практик', value: totalPractice, note: 'локальный sandbox и hidden tests' },
    { label: 'Теорий', value: totalTheory, note: 'Stepik-like учебные страницы' },
    { label: 'Прогресс', value: `${Math.round(getCourseProgress() * 100)}%`, note: 'сохраняется локально' },
  ]

  return (
    <div className="mx-auto max-w-[1380px] px-4 py-6 lg:px-6 lg:py-8">
      <section className="grid gap-6 xl:grid-cols-[320px,minmax(0,1fr)]">
        <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-2xl text-emerald-300">ML</div>
            <div>
              <div className="text-sm text-slate-500">Локальный тренажёр</div>
              <h1 className="text-2xl font-semibold text-slate-950">Программа курса</h1>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.href} className={`block rounded-2xl px-4 py-4 transition hover:-translate-y-0.5 ${action.tone}`}>
                <div className="text-base font-semibold">{action.title}</div>
                <div className={`mt-1 text-sm leading-6 ${action.tone.includes('text-white') ? 'text-white/80' : 'text-slate-600'}`}>{action.description}</div>
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-emerald-50 px-4 py-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Что внутри</div>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              <li>• курс разбит по блокам и подтемам, как в каталоге;</li>
              <li>• внутри темы — пошаговый lesson flow;</li>
              <li>• теория, тесты и практика идут в одном учебном маршруте.</li>
            </ul>
          </div>
        </aside>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Главная</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 lg:text-5xl">Учитесь по программе курса, а не через перегруженный лендинг.</h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  Сейчас траектория сфокусирована на первых двух блоках: вводные понятия ИИ/ML и NumPy как база числовой работы.
                  Это формат учебной платформы, где главное — открыть нужную тему, пройти шаги, проверить понимание и закрепить практикой.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                {stats.slice(0, 3).map((card) => (
                  <div key={card.label} className="min-w-[180px] rounded-2xl bg-slate-50 px-4 py-4">
                    <div className="text-sm text-slate-500">{card.label}</div>
                    <div className="mt-2 text-3xl font-bold text-slate-950">{card.value}</div>
                    <div className="mt-1 text-sm text-slate-500">{card.note}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Поиск</div>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">Найти тему, термин или шпаргалку</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">Поиск работает как точка входа: можно сразу перейти к теме, шагу или опорному материалу.</p>
              </div>
              <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
                {stats.slice(3).map((card) => (
                  <div key={card.label} className="rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="font-medium text-slate-900">{card.label}: {card.value}</div>
                    <div>{card.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Например: NumPy, ndarray, features, target, broadcasting"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base outline-none transition focus:border-emerald-400"
              />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {results.map((result) => (
                <Link key={result.id} to={result.href} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:bg-white">
                  <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{result.type}</div>
                  <div className="mt-2 text-lg font-semibold text-slate-950">{result.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">{result.subtitle}</div>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Каталог</div>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">Блоки и подтемы курса</h3>
              </div>
              <Link to="/topics" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">Открыть полную карту</Link>
            </div>

            <div className="mt-6 space-y-6">
              {flowCourseBlocks.map((block) => (
                <article key={block.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="text-sm font-medium text-emerald-700">Блок {block.order}</div>
                      <h4 className="mt-1 text-2xl font-semibold text-slate-950">{block.icon} {block.title}</h4>
                      <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">{block.description}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">{block.subblocks.length} подблоков</div>
                  </div>

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    {block.subblocks.map((subblock) => (
                      <div key={subblock.id} className="rounded-[20px] bg-white p-4 shadow-sm">
                        <div className="text-sm font-semibold text-slate-900">{block.order}.{subblock.order} {subblock.title}</div>
                        <div className="mt-2 text-sm leading-6 text-slate-600">{subblock.description}</div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {subblock.themes.slice(0, 4).map((topic) => (
                            <Link key={topic.id} to={getFlowStepHref(topic.id, topic.steps[0].id)} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700">
                              {topic.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { flowCourseBlocks, flowTopics, getFlowStepHref, searchIndex } from '../data/courseFlow'
import { useProgress } from '../hooks/useProgress'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const { getCourseProgress } = useProgress()
  const normalized = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!normalized) return searchIndex.slice(0, 12)
    return searchIndex.filter((item) =>
      item.title.toLowerCase().includes(normalized)
      || item.subtitle.toLowerCase().includes(normalized)
      || item.text.toLowerCase().includes(normalized),
    ).slice(0, 18)
  }, [normalized])

  const totalSteps = flowTopics.reduce((sum, topic) => sum + topic.steps.length, 0)
  const totalPractice = flowTopics.reduce((sum, topic) => sum + topic.steps.filter((step) => step.practiceTasks?.length).length, 0)

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-8 lg:px-6">
      <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="rounded-[32px] bg-slate-950 px-8 py-10 text-white shadow-2xl">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Stepik-like lesson flow
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight lg:text-6xl">
            Полноценный локальный тренажёр по ML/DL: навигация по курсу, последовательные шаги, квизы и deterministic code practice.
          </h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-slate-300">
            Платформа собрана как реальный учебный поток: слева дерево курса, в центре последовательные шаги внутри темы,
            сверху прогресс по уроку, а теория, формулы, интуиция, квиз, код и практика идут не как разрозненные страницы,
            а как единый lesson flow.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/topics" className="rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950">Открыть курс</Link>
            <Link to="/cheatsheet" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white">Перейти к шпаргалке</Link>
            <Link to="/comparison" className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white">Таблицы сравнения</Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
          {[
            { label: 'Блоков', value: flowCourseBlocks.length, note: 'с collapsible-навигацией' },
            { label: 'Тем', value: flowTopics.length, note: 'каждая тема разбита на 11 шагов' },
            { label: 'Шагов', value: totalSteps, note: 'теория → термины → формулы → квиз → практика' },
            { label: 'Практик', value: totalPractice, note: 'локальный JS sandbox + hidden tests' },
            { label: 'Прогресс курса', value: `${Math.round(getCourseProgress() * 100)}%`, note: 'localStorage с миграцией схемы' },
          ].map((card) => (
            <div key={card.label} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="text-sm text-slate-500">{card.label}</div>
              <div className="mt-2 text-4xl font-bold text-slate-950">{card.value}</div>
              <div className="mt-2 text-sm leading-6 text-slate-500">{card.note}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-emerald-700">Search everywhere</div>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">Поиск по темам, подтемам, глоссарию и шпаргалкам</h2>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-600">Поиск индексирует названия тем, step titles, термины, формулы и ключевые тезисы из шпаргалок — чтобы home page была не витриной, а рабочей точкой входа в курс.</p>
          </div>
        </div>

        <div className="mt-6">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Например: precision, gradient, BatchNorm, decision_function, Naive Bayes"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-base outline-none transition focus:border-emerald-400"
          />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {results.map((result) => (
            <Link key={result.id} to={result.href} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5 transition hover:border-emerald-300 hover:bg-white">
              <div className="text-xs uppercase tracking-[0.16em] text-slate-500">{result.type}</div>
              <div className="mt-2 text-lg font-semibold text-slate-950">{result.title}</div>
              <div className="mt-2 text-sm leading-6 text-slate-600">{result.subtitle}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        {flowCourseBlocks.map((block) => (
          <article key={block.id} className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-emerald-700">Блок {block.order}</div>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">{block.icon} {block.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{block.description}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{block.subblocks.length} подблоков</div>
            </div>

            <div className="mt-5 space-y-4">
              {block.subblocks.map((subblock) => (
                <div key={subblock.id} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-semibold text-slate-900">{block.order}.{subblock.order} {subblock.title}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">{subblock.description}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {subblock.themes.slice(0, 4).map((topic) => (
                      <Link key={topic.id} to={getFlowStepHref(topic.id, topic.steps[0].id)} className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm">
                        {topic.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

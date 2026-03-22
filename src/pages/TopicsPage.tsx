import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { sections } from '../data/topics'
import type { Section } from '../data/topics'
import { useProgress } from '../hooks/useProgress'

const colorMap: Record<string, string> = {
  slate: 'text-slate-600 bg-slate-50 border-slate-200',
  green: 'text-green-600 bg-green-50 border-green-200',
  blue: 'text-blue-600 bg-blue-50 border-blue-200',
  orange: 'text-orange-600 bg-orange-50 border-orange-200',
  amber: 'text-amber-600 bg-amber-50 border-amber-200',
  cyan: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  rose: 'text-rose-600 bg-rose-50 border-rose-200',
  indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  lime: 'text-lime-600 bg-lime-50 border-lime-200',
  yellow: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  fuchsia: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200',
  violet: 'text-violet-600 bg-violet-50 border-violet-200',
  purple: 'text-purple-600 bg-purple-50 border-purple-200',
  red: 'text-red-600 bg-red-50 border-red-200',
  gray: 'text-gray-600 bg-gray-50 border-gray-200',
  zinc: 'text-zinc-600 bg-zinc-50 border-zinc-200',
  neutral: 'text-neutral-600 bg-neutral-50 border-neutral-200',
  stone: 'text-stone-600 bg-stone-50 border-stone-200',
}

const courseBlocks = [
  {
    id: 'python-base',
    title: 'Блок: Python и инструменты',
    sectionIds: ['block-1', 'block-2', 'block-3'],
  },
  {
    id: 'ml-core',
    title: 'Блок: Классический ML',
    sectionIds: ['block-0', 'block-4', 'block-5', 'block-6', 'block-7', 'block-8', 'block-9', 'block-10', 'block-11', 'block-12'],
  },
  {
    id: 'dl-core',
    title: 'Блок: Deep Learning',
    sectionIds: ['block-13', 'block-14', 'block-15', 'block-16', 'block-17', 'block-18'],
  },
  {
    id: 'interview',
    title: 'Блок: Подготовка к собеседованию',
    sectionIds: ['block-19', 'block-20', 'block-21'],
  },
]

export default function TopicsPage() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const { isCompleted } = useProgress()
  const filterSection = searchParams.get('section')

  const filteredSections = useMemo(() => {
    if (!query && !filterSection) return sections
    return sections
      .filter(s => !filterSection || s.id === filterSection)
      .map(s => ({
        ...s,
        topics: s.topics.filter(t =>
          !query ||
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.shortDescription.toLowerCase().includes(query.toLowerCase())
        )
      }))
      .filter(s => s.topics.length > 0)
  }, [query, filterSection])

  const groupedBlocks = useMemo(() => {
    const map = new Map(filteredSections.map((s) => [s.id, s]))
    return courseBlocks
      .map((block) => ({
        ...block,
        sections: block.sectionIds.map((id) => map.get(id)).filter((s): s is Section => Boolean(s)),
      }))
      .filter((b) => b.sections.length > 0)
  }, [filteredSections])

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Все темы</h1>
        <p className="text-gray-600 mb-5">
          {sections.flatMap(s => s.topics).length} тем по машинному обучению и глубокому обучению
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск по темам..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          {filterSection && (
            <Link to="/topics" className="px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-600 hover:bg-gray-50 text-center">
              ✕ Все разделы
            </Link>
          )}
        </div>
      </div>

      {groupedBlocks.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>Ничего не найдено по запросу «{query}»</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedBlocks.map(block => (
            <section key={block.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{block.title}</h2>
              <div className="space-y-6">
                {block.sections.map((section) => (
                  <div key={section.id}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl">{section.icon}</span>
                      <h3 className="text-base font-semibold text-gray-800">Подблок: {section.title}</h3>
                      <span className="text-xs text-gray-400">({section.topics.length} тем)</span>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {section.topics.map(topic => (
                        <Link key={topic.id} to={`/topics/${topic.id}`}
                          className={`border rounded-xl p-4 flex items-start gap-3 hover:shadow-sm transition-all ${colorMap[section.color] ?? 'text-gray-600 bg-gray-50 border-gray-200'}`}>
                          <div className="flex-shrink-0 mt-0.5">
                            {isCompleted(topic.id) ? <span className="text-green-500 text-lg">✅</span> : <span className="text-gray-300 text-lg">⬜</span>}
                          </div>
                          <div>
                            <div className="font-semibold text-sm mb-1">Тема: {topic.title}</div>
                            <div className="text-xs opacity-70 leading-relaxed">{topic.shortDescription}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

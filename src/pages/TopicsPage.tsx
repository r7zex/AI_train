import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { sections } from '../data/topics'
import { useProgress } from '../hooks/useProgress'

const colorMap: Record<string, string> = {
  green: 'text-green-600 bg-green-50 border-green-200',
  blue: 'text-blue-600 bg-blue-50 border-blue-200',
  orange: 'text-orange-600 bg-orange-50 border-orange-200',
  purple: 'text-purple-600 bg-purple-50 border-purple-200',
  red: 'text-red-600 bg-red-50 border-red-200',
}

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

      {filteredSections.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>Ничего не найдено по запросу «{query}»</p>
        </div>
      ) : (
        <div className="space-y-10">
          {filteredSections.map(section => (
            <div key={section.id}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
                <span className="text-sm text-gray-400">({section.topics.length} тем)</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {section.topics.map(topic => (
                  <Link key={topic.id} to={`/topics/${topic.id}`}
                    className={`border rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition-all ${colorMap[section.color]} hover:scale-[1.01]`}>
                    <div className="flex-shrink-0 mt-0.5">
                      {isCompleted(topic.id) ? <span className="text-green-500 text-lg">✅</span> : <span className="text-gray-300 text-lg">⬜</span>}
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-1">{topic.title}</div>
                      <div className="text-xs opacity-70 leading-relaxed">{topic.shortDescription}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

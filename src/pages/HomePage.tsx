import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { sections } from '../data/topics'
import { quizzes } from '../data/quizzes'
import { useProgress } from '../hooks/useProgress'

type SearchResult = {
  label: string
  description: string
  link: string
  type: 'topic' | 'quiz' | 'formula'
}

const cheatsheetFormulas = [
  { name: 'Gini Impurity', link: '/cheatsheet#classical' },
  { name: 'Precision', link: '/cheatsheet#metrics' },
  { name: 'Recall', link: '/cheatsheet#metrics' },
  { name: 'F1-Score', link: '/cheatsheet#metrics' },
  { name: 'ROC-AUC', link: '/cheatsheet#metrics' },
  { name: 'MSE / RMSE', link: '/cheatsheet#metrics' },
  { name: 'R² Score', link: '/cheatsheet#metrics' },
  { name: 'Gradient Descent Update', link: '/cheatsheet#optimization' },
  { name: 'L1 Regularization (Lasso)', link: '/cheatsheet#optimization' },
  { name: 'L2 Regularization (Ridge)', link: '/cheatsheet#optimization' },
  { name: 'Elastic Net', link: '/cheatsheet#optimization' },
  { name: 'Adam Update', link: '/cheatsheet#optimization' },
  { name: 'Batch Normalization', link: '/cheatsheet#deeplearning' },
  { name: 'Layer Normalization', link: '/cheatsheet#deeplearning' },
  { name: 'Scaled Dot-Product Attention', link: '/cheatsheet#deeplearning' },
  { name: 'Softmax', link: '/cheatsheet#deeplearning' },
  { name: 'Dropout', link: '/cheatsheet#deeplearning' },
  { name: 'Naive Bayes', link: '/cheatsheet#classical' },
  { name: 'SVM Margin', link: '/cheatsheet#classical' },
  { name: 'Logistic Regression', link: '/cheatsheet#classical' },
]

function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const allTopics = sections.flatMap(s => s.topics)

  const results: SearchResult[] = query.trim().length < 2 ? [] : [
    ...allTopics
      .filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.shortDescription.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 5)
      .map(t => ({
        label: t.title,
        description: t.shortDescription,
        link: `/topics/${t.id}`,
        type: 'topic' as const,
      })),
    ...quizzes
      .filter(q =>
        q.title.toLowerCase().includes(query.toLowerCase()) ||
        q.description.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 3)
      .map(q => ({
        label: q.title,
        description: q.description,
        link: `/quiz/${q.id}`,
        type: 'quiz' as const,
      })),
    ...cheatsheetFormulas
      .filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 3)
      .map(f => ({
        label: f.name,
        description: 'Формула в шпаргалке',
        link: f.link,
        type: 'formula' as const,
      })),
  ].slice(0, 10)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const typeIcon: Record<string, string> = {
    topic: '📚',
    quiz: '📝',
    formula: '📐',
  }

  const typeLabel: Record<string, string> = {
    topic: 'Тема',
    quiz: 'Квиз',
    formula: 'Формула',
  }

  return (
    <div ref={ref} className="relative max-w-xl mx-auto mb-6">
      <div className="flex items-center border-2 border-gray-200 rounded-xl bg-white shadow-sm focus-within:border-blue-400 transition-colors">
        <span className="pl-4 text-gray-400">🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Поиск по темам, квизам, формулам..."
          className="flex-1 px-3 py-3 text-sm text-gray-700 bg-transparent outline-none"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setIsOpen(false) }}
            className="pr-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {results.map((r, i) => (
            <Link
              key={i}
              to={r.link}
              onClick={() => { setQuery(''); setIsOpen(false) }}
              className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <span className="text-lg shrink-0 mt-0.5">{typeIcon[r.type]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-800 truncate">{r.label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0">
                    {typeLabel[r.type]}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{r.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {isOpen && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 px-4 py-3 text-sm text-gray-500 text-center">
          Ничего не найдено по запросу «{query}»
        </div>
      )}
    </div>
  )
}

const styleByColor: Record<string, { card: string; button: string }> = {
  slate: { card: 'bg-slate-50 border-slate-200 text-slate-700', button: 'bg-slate-700 hover:bg-slate-800' },
  blue: { card: 'bg-blue-50 border-blue-200 text-blue-700', button: 'bg-blue-600 hover:bg-blue-700' },
  violet: { card: 'bg-violet-50 border-violet-200 text-violet-700', button: 'bg-violet-600 hover:bg-violet-700' },
  green: { card: 'bg-green-50 border-green-200 text-green-700', button: 'bg-green-600 hover:bg-green-700' },
  amber: { card: 'bg-amber-50 border-amber-200 text-amber-700', button: 'bg-amber-600 hover:bg-amber-700' },
  cyan: { card: 'bg-cyan-50 border-cyan-200 text-cyan-700', button: 'bg-cyan-600 hover:bg-cyan-700' },
  emerald: { card: 'bg-emerald-50 border-emerald-200 text-emerald-700', button: 'bg-emerald-600 hover:bg-emerald-700' },
  rose: { card: 'bg-rose-50 border-rose-200 text-rose-700', button: 'bg-rose-600 hover:bg-rose-700' },
  indigo: { card: 'bg-indigo-50 border-indigo-200 text-indigo-700', button: 'bg-indigo-600 hover:bg-indigo-700' },
  lime: { card: 'bg-lime-50 border-lime-200 text-lime-700', button: 'bg-lime-600 hover:bg-lime-700' },
  yellow: { card: 'bg-yellow-50 border-yellow-200 text-yellow-700', button: 'bg-yellow-600 hover:bg-yellow-700' },
  fuchsia: { card: 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700', button: 'bg-fuchsia-600 hover:bg-fuchsia-700' },
  purple: { card: 'bg-purple-50 border-purple-200 text-purple-700', button: 'bg-purple-600 hover:bg-purple-700' },
  red: { card: 'bg-red-50 border-red-200 text-red-700', button: 'bg-red-600 hover:bg-red-700' },
  gray: { card: 'bg-gray-50 border-gray-200 text-gray-700', button: 'bg-gray-700 hover:bg-gray-800' },
  zinc: { card: 'bg-zinc-50 border-zinc-200 text-zinc-700', button: 'bg-zinc-700 hover:bg-zinc-800' },
  neutral: { card: 'bg-neutral-50 border-neutral-200 text-neutral-700', button: 'bg-neutral-700 hover:bg-neutral-800' },
  stone: { card: 'bg-stone-50 border-stone-200 text-stone-700', button: 'bg-stone-700 hover:bg-stone-800' },
}

const hubCards = [
  {
    to: '/practice',
    title: 'Practice Hub',
    desc: 'Калькуляторы, split-симулятор, confusion matrix и быстрые практики.',
    icon: '🧪',
  },
  {
    to: '/quiz',
    title: 'Quiz Hub',
    desc: 'Теоретические тесты с автоматической проверкой и историей попыток.',
    icon: '📝',
  },
  {
    to: '/code-practice',
    title: 'Code Practice Hub',
    desc: 'Function-based, stdin/stdout и структурные проверки PyTorch-кода.',
    icon: '💻',
  },
  {
    to: '/pytorch-lab',
    title: 'PyTorch Lab',
    desc: 'Сценарии train/eval, чеклист до сдачи и вход в тематические модули.',
    icon: '🔥',
  },
  {
    to: '/progress',
    title: 'Progress Dashboard',
    desc: 'Сводка по изученным темам и последним результатам квизов.',
    icon: '📈',
  },
]

export default function HomePage() {
  const { isCompleted } = useProgress()
  const totalTopics = sections.flatMap((s) => s.topics).length
  const completedTopics = sections.flatMap((s) => s.topics).filter((t) => isCompleted(t.id)).length

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">ML Тренажёр</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
          Локальный интерактивный учебник по ML и DL: теория, формулы, ручные расчеты, квизы, код-практика и трекинг прогресса.
        </p>

        <SearchBar />

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/topics" className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            Перейти к структуре курса
          </Link>
          <Link to="/terms-functions" className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
            Термины и функции
          </Link>
        </div>
      </div>

      {totalTopics > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-10 max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Общий прогресс</span>
            <span className="font-semibold">{completedTopics} / {totalTopics} тем</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${(completedTopics / totalTopics) * 100}%` }} />
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Основные разделы</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        {hubCards.map((card) => (
          <Link key={card.to} to={card.to} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-blue-300 transition-all">
            <div className="text-2xl mb-2">{card.icon}</div>
            <div className="font-semibold text-gray-800 mb-1">{card.title}</div>
            <div className="text-sm text-gray-600">{card.desc}</div>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Разделы курса</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {sections.map((section) => {
          const done = section.topics.filter((t) => isCompleted(t.id)).length
          const pct = section.topics.length === 0 ? 0 : Math.round((done / section.topics.length) * 100)
          const style = styleByColor[section.color] ?? {
            card: 'bg-gray-50 border-gray-200 text-gray-700',
            button: 'bg-gray-700 hover:bg-gray-800',
          }

          return (
            <div key={section.id} className={`border rounded-xl p-5 ${style.card} flex flex-col`}>
              <div className="text-3xl mb-2">{section.icon}</div>
              <h3 className="font-bold text-lg mb-1">{section.title}</h3>
              <p className="text-sm opacity-80 mb-3 flex-1">{section.description}</p>
              <div className="flex justify-between text-xs mb-1 opacity-75">
                <span>{section.topics.length} тем</span>
                <span>{done}/{section.topics.length}</span>
              </div>
              <div className="w-full bg-white/60 rounded-full h-2 mb-3">
                <div className="h-2 rounded-full bg-current opacity-60 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <Link
                to={`/topics?section=${section.id}`}
                className={`text-white text-sm font-medium px-4 py-2 rounded-lg text-center transition-colors ${style.button}`}
              >
                Открыть раздел →
              </Link>
            </div>
          )
        })}
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">Справочные страницы</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: '/cheatsheet', icon: '📐', title: 'Шпаргалка формул' },
          { to: '/comparisons', icon: '⚖️', title: 'Сравнительные таблицы' },
          { to: '/terms-functions', icon: '📖', title: 'Термины и функции' },
          { to: '/mistakes', icon: '🚫', title: 'Типичные ошибки' },
        ].map((item) => (
          <Link key={item.to} to={item.to} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow hover:border-blue-300">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="font-semibold text-gray-800 text-sm">{item.title}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

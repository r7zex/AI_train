import { Link } from 'react-router-dom'
import { sections } from '../data/topics'
import { useProgress } from '../hooks/useProgress'

const colorMap: Record<string, string> = {
  green:  'bg-green-50 border-green-200 text-green-700',
  blue:   'bg-blue-50 border-blue-200 text-blue-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  red:    'bg-red-50 border-red-200 text-red-700',
}
const btnColorMap: Record<string, string> = {
  green:  'bg-green-600 hover:bg-green-700',
  blue:   'bg-blue-600 hover:bg-blue-700',
  orange: 'bg-orange-600 hover:bg-orange-700',
  purple: 'bg-purple-600 hover:bg-purple-700',
  red:    'bg-red-600 hover:bg-red-700',
}

export default function HomePage() {
  const { isCompleted } = useProgress()
  const totalTopics = sections.flatMap(s => s.topics).length
  const completedTopics = sections.flatMap(s => s.topics).filter(t => isCompleted(t.id)).length

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="text-6xl mb-4">🧠</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">ML Тренажёр</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-2">
          Локальный интерактивный учебник по машинному обучению и deep learning
        </p>
        <p className="text-gray-500 max-w-xl mx-auto mb-6">
          Теория с формулами · Ручные расчёты · Примеры кода · Практические задания · Прогресс в localStorage
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/topics" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
            Начать обучение →
          </Link>
          <Link to="/guide" className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
            Как пользоваться
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      {totalTopics > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-10 max-w-xl mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Общий прогресс</span>
            <span className="font-semibold">{completedTopics} / {totalTopics} тем изучено</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${(completedTopics / totalTopics) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Sections */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Разделы курса</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {sections.map(section => {
          const done = section.topics.filter(t => isCompleted(t.id)).length
          const pct = Math.round((done / section.topics.length) * 100)
          return (
            <div key={section.id} className={`border rounded-xl p-5 ${colorMap[section.color]} flex flex-col`}>
              <div className="text-3xl mb-2">{section.icon}</div>
              <h3 className="font-bold text-lg mb-1">{section.title}</h3>
              <p className="text-sm opacity-75 mb-3 flex-1">{section.description}</p>
              <div className="flex justify-between text-xs mb-1 opacity-75">
                <span>{section.topics.length} тем</span>
                <span>{done}/{section.topics.length} изучено</span>
              </div>
              <div className="w-full bg-white bg-opacity-50 rounded-full h-2 mb-3">
                <div className="h-2 rounded-full bg-current opacity-60 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <Link to={`/topics?section=${section.id}`}
                className={`text-white text-sm font-medium px-4 py-2 rounded-lg text-center transition-colors ${btnColorMap[section.color]}`}>
                Открыть раздел →
              </Link>
            </div>
          )
        })}
      </div>

      {/* Extra pages */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Справочные материалы</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { to: '/cheatsheet', icon: '📐', title: 'Шпаргалка формул', desc: 'Все ключевые формулы на одной странице' },
          { to: '/comparisons', icon: '⚖️', title: 'Сравнительные таблицы', desc: 'Bagging/Boosting, L1/L2, нормализации и др.' },
          { to: '/glossary', icon: '📖', title: 'Словарь терминов', desc: 'Ключевые понятия ML/DL с объяснениями' },
          { to: '/mistakes', icon: '🚫', title: 'Типичные ошибки', desc: 'Частые заблуждения на собеседованиях' },
        ].map(({ to, icon, title, desc }) => (
          <Link key={to} to={to} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow hover:border-blue-300">
            <div className="text-2xl mb-2">{icon}</div>
            <div className="font-semibold text-gray-800 text-sm mb-1">{title}</div>
            <div className="text-xs text-gray-500">{desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

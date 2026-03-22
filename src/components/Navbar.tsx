import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/topics', label: 'Темы' },
  { to: '/practice', label: 'Практика' },
  { to: '/quiz', label: 'Квизы' },
  { to: '/code-practice', label: 'Код-задачи' },
  { to: '/pytorch-lab', label: 'PyTorch Lab' },
  { to: '/cheatsheet', label: 'Формулы' },
  { to: '/progress', label: 'Прогресс' },
  { to: '/glossary', label: 'Словарь' },
  { to: '/mistakes', label: 'Ошибки' },
]

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const isActive = (to: string) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to))

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-blue-600 text-lg shrink-0">
            <span>🧠</span>
            <span className="hidden sm:block">ML Тренажёр</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5 min-w-0 overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive(link.to)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            onClick={() => setOpen((v) => !v)}
            aria-label="Открыть меню"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>

        {open && (
          <div className="lg:hidden pb-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.to) ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/guide"
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/guide') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
              }`}
            >
              Как пользоваться
            </Link>
            <Link
              to="/comparisons"
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/comparisons') ? 'bg-blue-50 text-blue-700' : 'text-gray-600'
              }`}
            >
              Сравнения
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

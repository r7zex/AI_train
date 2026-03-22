import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/topics', label: 'Курс' },
  { to: '/terms-functions', label: 'Глоссарий' },
  { to: '/comparison', label: 'Сравнения' },
  { to: '/cheatsheet', label: 'Cheatsheet' },
]

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const isActive = (to: string) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to))

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between px-4 py-3 lg:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-950 text-lg font-bold text-emerald-300">ML</div>
          <div>
            <div className="text-xl font-semibold tracking-tight text-slate-950">Stepik-like ML Trainer</div>
            <div className="text-xs text-slate-500">локальная образовательная платформа на React + TS + Vite</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${isActive(link.to) ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button type="button" className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 lg:hidden" onClick={() => setOpen((value) => !value)}>
          Меню
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-2 text-sm font-medium ${isActive(link.to) ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

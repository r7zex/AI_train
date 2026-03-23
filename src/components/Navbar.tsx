import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/topics', label: 'Программа' },
  { to: '/terms-functions', label: 'Глоссарий' },
  { to: '/comparison', label: 'Сравнения' },
  { to: '/cheatsheet', label: 'Шпаргалка' },
]

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const isActive = (to: string) => location.pathname.startsWith(to)

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1e1e1e]">
      <div className="flex h-11 items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2 text-white">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect width="22" height="22" rx="3" fill="#22c55e" />
            <text x="3" y="16" fontFamily="Arial,sans-serif" fontSize="13" fontWeight="700" fill="#111">ML</text>
          </svg>
          <span className="text-[13px] font-semibold tracking-tight text-white">ML.train</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 text-[13px] transition ${isActive(link.to) ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button type="button" className="px-3 py-1 text-[13px] text-slate-400 lg:hidden" onClick={() => setOpen((v) => !v)}>
          Меню
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#1e1e1e] px-4 pb-3 pt-2 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`block px-2 py-2 text-[13px] ${isActive(link.to) ? 'text-white' : 'text-slate-400'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

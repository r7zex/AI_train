import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
  { to: '/', label: 'Главная' },
  { to: '/topics', label: 'Блоки и темы' },
  { to: '/terms-functions', label: 'Термины и функции' },
]

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const isActive = (to: string) => (to === '/' ? location.pathname === '/' : location.pathname.startsWith(to))

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#202020] text-white shadow-sm">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 lg:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 text-lg font-bold">S</div>
          <div>
            <div className="text-2xl font-semibold leading-none tracking-tight">stepik-like ML</div>
            <div className="text-xs text-white/60">пересобранный локальный учебный сервис</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                isActive(link.to) ? 'bg-[#69d05c] text-[#101010]' : 'text-white/75 hover:bg-white/8 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 md:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          Меню
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-[#202020] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                  isActive(link.to) ? 'bg-[#69d05c] text-[#101010]' : 'text-white/80'
                }`}
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

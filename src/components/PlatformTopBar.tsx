import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/topics', label: 'Программа курса' },
  { to: '/terms-functions', label: 'Справочник' },
  { to: '/comparison', label: 'Сравнения' },
  { to: '/cheatsheet', label: 'Шпаргалка' },
]

export default function PlatformTopBar() {
  const { pathname } = useLocation()

  const isActive = (to: string) => {
    if (to === '/topics') return pathname === '/topics' || pathname === '/'
    return pathname.startsWith(to)
  }

  return (
    <header className="border-b border-black/30 bg-[#1f2329] text-white">
      <div className="mx-auto flex h-12 max-w-[1320px] items-center justify-between gap-6 px-4 lg:px-6">
        <Link to="/topics" className="flex items-center gap-3">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm bg-[#2f353d] text-[10px] font-bold tracking-[0.1em] text-[#e5ebf1]">AT</span>
          <span className="text-[13px] font-semibold text-[#e7edf5]">AI Train</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`rounded-sm px-3 py-1.5 text-xs transition ${
                isActive(item.to) ? 'bg-[#2d333b] text-white' : 'text-[#b7c0ca] hover:bg-[#2a3037] hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

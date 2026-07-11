import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { to: '/topics', label: 'Моё обучение' },
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
    <header className="border-b border-black bg-[#222] text-white">
      <div className="mx-auto flex h-[52px] max-w-[1180px] items-center justify-between gap-6 px-5">
        <Link to="/topics" className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white">
            AI
          </span>
          <span className="text-[20px] font-normal text-white">Train</span>
        </Link>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`whitespace-nowrap px-3 py-2 text-[13px] transition ${
                isActive(item.to) ? 'bg-[#353535] text-white' : 'text-[#c8c8c8] hover:bg-[#303030] hover:text-white'
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

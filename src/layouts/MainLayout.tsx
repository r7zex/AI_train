import { Outlet, useLocation } from 'react-router-dom'
import PlatformTopBar from '../components/PlatformTopBar'

export default function MainLayout() {
  const { pathname } = useLocation()
  const isLessonPage = pathname.startsWith('/topics/') && pathname.split('/').filter(Boolean).length >= 2 && pathname !== '/topics'

  return (
    <div className="min-h-screen bg-[#eceff1] text-[#1e2329]">
      {!isLessonPage && <PlatformTopBar />}
      <main>
        <Outlet />
      </main>
    </div>
  )
}

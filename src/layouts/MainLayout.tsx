import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#f5f5f3] text-[#222]">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

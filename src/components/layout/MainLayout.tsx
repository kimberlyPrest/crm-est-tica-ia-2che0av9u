import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <Sidebar />
      <div className="md:pl-[240px] min-h-screen flex flex-col transition-all duration-300">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

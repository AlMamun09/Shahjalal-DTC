import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  { path: '/admin/branches', label: 'Branches', icon: '🏢' },
  { path: '/admin/courses', label: 'Courses', icon: '📚' },
  { path: '/admin/leads', label: 'Leads', icon: '📋' },
  { path: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { path: '/admin/testimonials', label: 'Testimonials', icon: '⭐' },
  { path: '/admin/about', label: 'About', icon: 'ℹ️' },
  { path: '/admin/seo', label: 'SEO', icon: '🔍' },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 bg-sidebar-dark text-white
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 border-b border-white/10">
          <h2 className="font-inter font-semibold text-lg">Admin Panel</h2>
        </div>
        <nav className="p-2 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === item.path
                  ? 'bg-brand-red text-white'
                  : 'text-gray-300 hover:bg-white/10'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-sm text-brand-red hover:underline">View Site</a>
            <button onClick={handleLogout} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-light-gray">
          {children}
        </main>
      </div>
    </div>
  )
}

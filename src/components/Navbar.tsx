import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

const navLinks = [
  { path: '/', key: 'nav.home' },
  { path: '/about', key: 'nav.about' },
  { path: '/courses', key: 'nav.courses' },
  { path: '/license', key: 'nav.license' },
  { path: '/blog', key: 'nav.blog' },
  { path: '/gallery', key: 'nav.gallery' },
  { path: '/branches', key: 'nav.branches' },
  { path: '/contact', key: 'nav.contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { t } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsAdmin(!!session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setIsAdmin(!!s))
    return () => subscription.unsubscribe()
  }, [])

  const isActive = (path: string) => location.pathname === path

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 bg-white dark:bg-[#0F172A] ${scrolled ? 'glass' : ''}`}>
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-heading text-lg font-bold tracking-tight flex items-center gap-3 group">
          <span className="w-10 h-10 bg-gradient-energy rounded-xl flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">S</span>
          <span className="hidden sm:inline text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
            Shahjalal DTC
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive(link.path)
                  ? 'text-orange-500 font-semibold bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="px-4 py-2 rounded-lg text-sm font-medium text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-all flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Dashboard
            </Link>
          )}
          <div className="w-px h-6 bg-gray-200 dark:bg-white/20 mx-3" />
          <Link to="/enroll" className="btn-shine bg-gradient-energy text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-orange-500/40 transition-all ml-3 glow-orange-hover">
            {t('nav.apply')}
          </Link>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          {isAdmin && <Link to="/admin" className="text-orange-500 text-xs px-2 py-1 border border-orange-300 dark:border-orange-500/30 rounded-lg">Admin</Link>}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-600 dark:text-gray-400" aria-label="Toggle menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-white/10 animate-slide-down">
          <div className="px-4 py-3 space-y-1 bg-white dark:bg-[#0F172A]">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-gradient-energy text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10'
                }`}>
                {t(link.key)}
              </Link>
            ))}
            {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-3 rounded-xl text-sm font-medium text-orange-500 bg-orange-50 dark:bg-orange-500/10">Dashboard</Link>}
            <Link to="/enroll" onClick={() => setMobileOpen(false)} className="block px-4 py-3 bg-gradient-energy text-white rounded-xl text-sm font-bold text-center mt-2 shadow-lg shadow-orange-500/30">{t('nav.apply')}</Link>
          </div>
        </div>
      )}
    </header>
  )
}
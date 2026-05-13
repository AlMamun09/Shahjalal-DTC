import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

const navLinks = [
  { path: '/', key: 'nav.home' },
  { path: '/courses', key: 'nav.courses' },
  { path: '/branches', key: 'nav.branches' },
  { path: '/gallery', key: 'nav.gallery' },
  { path: '/about', key: 'nav.about' },
  { path: '/contact', key: 'nav.contact' },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { t, i18n } = useTranslation()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdmin(!!session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'bn' ? 'en' : 'bn')
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 text-white transition-all duration-500 ${
      scrolled ? 'glass shadow-lg' : 'bg-brand-black'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-poppins font-bold tracking-tight flex items-center gap-2 group">
          <span className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center text-sm font-bold group-hover:scale-110 transition-transform">S</span>
          <span className="hidden sm:inline">Shahjalal Driving</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              className={`px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                location.pathname === link.path
                  ? 'text-brand-gold font-semibold bg-white/10'
                  : 'text-white/80 hover:text-white hover:bg-white/5'
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin"
              className="px-3 py-2 rounded-lg text-sm font-medium text-brand-gold hover:bg-brand-gold/10 transition-all duration-300 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Dashboard
            </Link>
          )}
          <div className="w-px h-6 bg-white/20 mx-2" />
          <button onClick={toggleLang} className="text-sm px-3 py-1.5 border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300 hover:border-white/50">
            {i18n.language === 'bn' ? 'English' : 'বাংলা'}
          </button>
          <Link to="/enroll" className="btn-shine bg-brand-red text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-brand-red-light transition-all duration-300 ml-2 shadow-lg shadow-brand-red/30">
            {t('nav.enroll')}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          {isAdmin && (
            <Link to="/admin" className="text-brand-gold text-xs px-2 py-1 border border-brand-gold/30 rounded-lg">
              Admin
            </Link>
          )}
          <button onClick={toggleLang} className="text-xs px-2 py-1 border border-white/30 rounded-lg">
            {i18n.language === 'bn' ? 'EN' : 'বাংলা'}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-colors" aria-label="Toggle menu">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 animate-slide-down">
          <div className="px-4 py-3 space-y-1 bg-brand-black/95 backdrop-blur-lg">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.path ? 'bg-brand-red text-white' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {t(link.key)}
              </Link>
            ))}
            {isAdmin && (
              <Link to="/admin" onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-brand-gold bg-brand-gold/10">
                Dashboard
              </Link>
            )}
            <Link to="/enroll" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 bg-brand-red text-white rounded-xl text-sm font-semibold text-center mt-2 shadow-lg shadow-brand-red/30">
              {t('nav.enroll')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

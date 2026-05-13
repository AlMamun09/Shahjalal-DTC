import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

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
  const { t, i18n } = useTranslation()
  const location = useLocation()

  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'bn' ? 'en' : 'bn')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-brand-black text-white">
      <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-poppins font-bold tracking-tight">
          Shahjalal Driving
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path}
              className={`text-sm transition-colors hover:text-brand-gold ${
                location.pathname === link.path ? 'text-brand-gold font-semibold' : 'text-white/80'
              }`}
            >
              {t(link.key)}
            </Link>
          ))}
          <button onClick={toggleLang} className="text-sm px-2 py-1 border border-white/30 rounded hover:bg-white/10 transition-colors">
            {i18n.language === 'bn' ? 'English' : 'বাংলা'}
          </button>
          <Link to="/enroll" className="bg-brand-red text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
            {t('nav.enroll')}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button onClick={toggleLang} className="text-xs px-2 py-1 border border-white/30 rounded">
            {i18n.language === 'bn' ? 'EN' : 'বাংলা'}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2" aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="md:hidden bg-brand-black border-t border-white/10">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm ${
                  location.pathname === link.path ? 'bg-brand-red text-white' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                {t(link.key)}
              </Link>
            ))}
            <Link to="/enroll" onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 bg-brand-red text-white rounded-lg text-sm font-semibold text-center">
              {t('nav.enroll')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

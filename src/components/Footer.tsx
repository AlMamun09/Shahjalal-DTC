import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { Branch } from '../types'

export function Footer() {
  const { t, i18n } = useTranslation()
  const [branches, setBranches] = useState<Branch[]>([])
  const [siteName, setSiteName] = useState('')

  useEffect(() => {
    supabase.from('branches').select('*').eq('is_active', true).then(({ data }) => {
      if (data) setBranches(data)
    })
    supabase.from('site_settings').select('value').eq('key', 'footer_text').single().then(({ data }) => {
      if (data) setSiteName(data.value)
    })
  }, [])

  return (
    <footer className="bg-brand-black text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-poppins font-bold mb-4">{siteName || 'Shahjalal Driving'}</h3>
            <p className="text-sm text-gray-400">BRTA Approved Driving Training Center</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">{t('nav.branches')}</h4>
            <div className="space-y-3">
              {branches.map(branch => (
                <div key={branch.id}>
                  <Link to={`/branches/${branch.slug}`} className="text-sm text-gray-400 hover:text-brand-gold transition-colors">
                    {i18n.language === 'bn' ? branch.name_bn : branch.name_en}
                  </Link>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {branch.phones.map(p => <span key={p}><a href={`tel:${p}`} className="hover:text-brand-gold">{p}</a> </span>)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block text-gray-400 hover:text-brand-gold">{t('nav.home')}</Link>
              <Link to="/courses" className="block text-gray-400 hover:text-brand-gold">{t('nav.courses')}</Link>
              <Link to="/about" className="block text-gray-400 hover:text-brand-gold">{t('nav.about')}</Link>
              <Link to="/contact" className="block text-gray-400 hover:text-brand-gold">{t('nav.contact')}</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {siteName || 'Shahjalal Driving Training Center'}
        </div>
      </div>
    </footer>
  )
}

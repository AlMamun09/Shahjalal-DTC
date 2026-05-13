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
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-lg font-bold">S</span>
              <span className="text-xl font-poppins font-bold">{siteName || 'Shahjalal Driving'}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              BRTA Approved Driving Training Center (Reg No: 142/2021). 
              Providing quality driving education since 2021 with branches in Uttara and Tongi.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">{t('nav.branches')}</h4>
            <div className="space-y-4">
              {branches.map(branch => (
                <div key={branch.id}>
                  <Link to={`/branches/${branch.slug}`} className="text-sm text-gray-400 hover:text-brand-gold transition-colors block">
                    {i18n.language === 'bn' ? branch.name_bn : branch.name_en}
                  </Link>
                  <div className="mt-1 space-y-0.5">
                    {branch.phones.map(p => (
                      <a key={p} href={`tel:${p}`} className="text-xs text-gray-500 hover:text-brand-gold transition-colors block">{p}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-300">Quick Links</h4>
            <div className="space-y-2">
              {[
                { path: '/', label: t('nav.home') },
                { path: '/courses', label: t('nav.courses') },
                { path: '/branches', label: t('nav.branches') },
                { path: '/about', label: t('nav.about') },
                { path: '/gallery', label: t('nav.gallery') },
                { path: '/contact', label: t('nav.contact') },
              ].map(link => (
                <Link key={link.path} to={link.path} className="block text-sm text-gray-400 hover:text-brand-gold transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {siteName || 'Shahjalal Driving Training Center'}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-500 hover:text-brand-gold transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="#" className="text-gray-500 hover:text-brand-gold transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

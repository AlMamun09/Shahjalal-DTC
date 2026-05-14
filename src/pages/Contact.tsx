import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import type { Branch } from '../types'
import { InquiryForm } from '../components/InquiryForm'

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

export function ContactPage() {
  const { t, i18n } = useTranslation()
  const [branches, setBranches] = useState<Branch[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const lang = i18n.language === 'bn' ? 'bn' : 'en'

  useEffect(() => {
    supabase.from('branches').select('*').eq('is_active', true).then(({ data }) => {
      if (data) setBranches(data)
    })
    supabase.from('site_settings').select('*').then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {}
        data.forEach(s => { map[s.key] = s.value })
        setSettings(map)
      }
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <Section>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4 text-white">{t('contact.title')}</h1>
        <div className="section-divider" />
      </Section>

      <div className="grid lg:grid-cols-2 gap-12 mt-12">
        <div className="space-y-8">
          {branches.map((branch, i) => (
            <Section key={branch.id} delay={i * 100}>
              <div className="card-hover bg-[#1F2937] rounded-2xl p-8 shadow-sm border border-orange-500/10">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                  <span className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center text-orange-400 text-sm">📍</span>
                  {lang === 'bn' ? branch.name_bn : branch.name_en}
                </h2>
                <p className="text-gray-300 mb-4 leading-relaxed text-sm">{lang === 'bn' ? branch.address_bn : branch.address_en}</p>
                <div className="space-y-2 mb-4">
                  {branch.phones.map(p => (
                    <a key={p} href={`tel:${p}`} className="flex items-center gap-2 text-orange-400 hover:underline text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                      {p}
                    </a>
                  ))}
                  {branch.emails.map(e => (
                    <p key={e} className="flex items-center gap-2 text-gray-400 text-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      {e}
                    </p>
                  ))}
                </div>
                {branch.map_embed_url && (
                  <div className="mt-4 aspect-video rounded-xl overflow-hidden">
                    <iframe src={branch.map_embed_url} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
                  </div>
                )}
              </div>
            </Section>
          ))}

          <Section delay={200}>
            <div className="flex flex-wrap gap-4">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#1877F2] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Facebook
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF0000] text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  YouTube
                </a>
              )}
            </div>
          </Section>
        </div>

        <Section delay={150}>
          <div className="bg-[#1F2937] rounded-2xl p-8 shadow-sm border border-orange-500/10 sticky top-24">
            <h2 className="text-2xl font-semibold mb-6 text-white">{t('enroll.title')}</h2>
            <InquiryForm />
          </div>
        </Section>
      </div>
    </div>
  )
}
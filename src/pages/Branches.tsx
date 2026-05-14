import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import type { Branch } from '../types'

function Section({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

export function BranchesPage() {
  const { t, i18n } = useTranslation()
  const [branches, setBranches] = useState<Branch[]>([])
  const lang = i18n.language === 'bn' ? 'bn' : 'en'

  useEffect(() => {
    supabase.from('branches').select('*').eq('is_active', true).order('sort_order').then(({ data }) => {
      if (data) setBranches(data)
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <Section>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4 text-white">{t('branches.title')}</h1>
        <div className="section-divider" />
      </Section>

      <div className="grid md:grid-cols-2 gap-10 mt-12">
        {branches.map((branch, i) => (
          <Section key={branch.id} delay={i * 150} className="h-full">
            <div className="card-hover bg-[#1F2937] rounded-2xl shadow-sm border border-white/[0.06] overflow-hidden h-full flex flex-col group">
              {branch.photo_url ? (
                <img src={branch.photo_url} alt="" className="w-full h-56 object-cover shrink-0 group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <div className="w-full h-56 shrink-0 bg-gradient-to-br from-orange-500/10 to-orange-400/10 flex items-center justify-center">
                  <span className="text-6xl">📍</span>
                </div>
              )}
              <div className="p-8 flex flex-col flex-1">
                <h2 className="text-2xl font-semibold mb-3 text-white group-hover:text-orange-400 transition-colors">
                  {lang === 'bn' ? branch.name_bn : branch.name_en}
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {lang === 'bn' ? branch.address_bn : branch.address_en}
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Phone</p>
                    <div className="flex flex-wrap gap-2">
                      {branch.phones.map(p => (
                        <a key={p} href={`tel:${p}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#374151] rounded-lg text-sm text-orange-400 hover:bg-orange-500 hover:text-white transition-all duration-300 font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                          {p}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a href={`https://wa.me/88${branch.whatsapp}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-all duration-300 shadow-md shadow-[#25D366]/20 hover:shadow-lg hover:shadow-[#25D366]/30 hover:scale-105">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.199 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
                    {t('branches.whatsapp')}
                  </a>
                  <Link to={`/branches/${branch.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 border-2 border-orange-500/30 text-orange-400 rounded-xl text-sm font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20 hover:scale-105">
                    {t('branches.view_map')}
                  </Link>
                </div>
              </div>
            </div>
          </Section>
        ))}
      </div>
    </div>
  )
}
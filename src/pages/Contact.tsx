import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { Branch } from '../types'
import { InquiryForm } from '../components/InquiryForm'

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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-poppins font-bold text-center mb-10">{t('contact.title')}</h1>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          {branches.map(branch => (
            <div key={branch.id} className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">{lang === 'bn' ? branch.name_bn : branch.name_en}</h2>
              <p className="text-gray-600 mb-4">{lang === 'bn' ? branch.address_bn : branch.address_en}</p>
              <div className="space-y-1 text-sm">
                {branch.phones.map(p => (
                  <a key={p} href={`tel:${p}`} className="block text-brand-red hover:underline">{p}</a>
                ))}
                {branch.emails.map(e => <p key={e} className="text-gray-600">{e}</p>)}
              </div>
              {branch.map_embed_url && (
                <div className="mt-4 aspect-video rounded-lg overflow-hidden">
                  <iframe src={branch.map_embed_url} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
                </div>
              )}
            </div>
          ))}

          {/* Social Links */}
          <div className="flex gap-4">
            {settings.facebook_url && (
              <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-[#1877F2] text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Facebook
              </a>
            )}
            {settings.youtube_url && (
              <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 bg-[#FF0000] text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                YouTube
              </a>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">{t('enroll.title')}</h2>
          <InquiryForm />
        </div>
      </div>
    </div>
  )
}

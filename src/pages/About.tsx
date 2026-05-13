import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { Instructor } from '../types'

export function AboutPage() {
  const { t, i18n } = useTranslation()
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const lang = i18n.language === 'bn' ? 'bn' : 'en'

  useEffect(() => {
    supabase.from('instructors').select('*').eq('is_active', true).order('sort_order').then(({ data }) => {
      if (data) setInstructors(data)
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
      <h1 className="text-3xl font-poppins font-bold text-center mb-10">{t('about.title')}</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-8 mb-12 text-center">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-3xl font-bold text-brand-red">{settings.stat_students || '5000'}+</p>
          <p className="text-gray-600 mt-1">{t('about.students')}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-3xl font-bold text-brand-red">{settings.stat_years || '5'}+</p>
          <p className="text-gray-600 mt-1">{t('about.years')}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-3xl font-bold text-brand-red">{settings.stat_success_rate || '95'}%</p>
          <p className="text-gray-600 mt-1">{t('about.success_rate')}</p>
        </div>
      </div>

      {/* Instructors */}
      {instructors.length > 0 && (
        <div>
          <h2 className="text-2xl font-poppins font-bold text-center mb-8">Our Instructors</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {instructors.map(instructor => (
              <div key={instructor.id} className="bg-white rounded-xl p-6 shadow-sm text-center">
                {instructor.photo_url ? (
                  <img src={instructor.photo_url} alt="" className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-gray-200 flex items-center justify-center text-2xl text-gray-400">
                    {instructor.name_en.charAt(0)}
                  </div>
                )}
                <h3 className="font-semibold">{lang === 'bn' ? instructor.name_bn : instructor.name_en}</h3>
                <p className="text-sm text-gray-500 mt-1">{instructor.experience} · {instructor.specialization}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

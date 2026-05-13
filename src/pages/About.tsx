import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import type { Instructor } from '../types'

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

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
    <div className="max-w-7xl mx-auto px-4 py-16">
      <Section>
        <h1 className="text-4xl md:text-5xl font-poppins font-bold text-center mb-4">{t('about.title')}</h1>
        <div className="section-divider" />
      </Section>

      {/* Stats */}
      <Section delay={100}>
        <div className="grid grid-cols-3 gap-6 my-16">
          {[
            { key: 'stat_students', label: t('about.students'), suffix: '+', icon: '👥' },
            { key: 'stat_years', label: t('about.years'), suffix: '+', icon: '📅' },
            { key: 'stat_success_rate', label: t('about.success_rate'), suffix: '%', icon: '🎯' },
          ].map((s, i) => (
            <div key={s.key} className="card-hover bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
              <span className="text-4xl mb-3 block">{s.icon}</span>
              <p className="text-4xl font-bold text-brand-red mb-1">{Number(settings[s.key]) || 5000}{s.suffix}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Story */}
      <Section delay={150}>
        <div className="bg-white rounded-2xl p-10 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed">
            Shahjalal Driving Training Center has been providing quality driving education since 2021. 
            As a BRTA-approved institution (Reg No: 142/2021), we are committed to producing safe, 
            skilled, and responsible drivers for Bangladesh. With two convenient locations in Uttara 
            and Tongi, we offer comprehensive training programs for car, motorcycle, and professional 
            driving. Our experienced instructors and modern training methods ensure that every student 
            gains the confidence and skills needed to pass the BRTA test and drive safely on the roads.
          </p>
        </div>
      </Section>

      {/* Instructors */}
      {instructors.length > 0 && (
        <div>
          <Section>
            <h2 className="text-3xl font-poppins font-bold text-center mb-4">Our Instructors</h2>
            <div className="section-divider" />
          </Section>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            {instructors.map((instructor, i) => (
              <Section key={instructor.id} delay={i * 100}>
                <div className="card-hover bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center group">
                  {instructor.photo_url ? (
                    <img src={instructor.photo_url} alt="" className="w-28 h-28 rounded-full mx-auto mb-5 object-cover border-4 border-gray-100 group-hover:border-brand-red transition-colors duration-300" />
                  ) : (
                    <div className="w-28 h-28 rounded-full mx-auto mb-5 bg-gradient-to-br from-brand-red/10 to-brand-gold/10 flex items-center justify-center text-4xl text-brand-red border-4 border-gray-100 group-hover:border-brand-red transition-colors duration-300">
                      {instructor.name_en.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-lg font-semibold mb-1 group-hover:text-brand-red transition-colors">
                    {lang === 'bn' ? instructor.name_bn : instructor.name_en}
                  </h3>
                  <p className="text-gray-500 text-sm">{instructor.experience} · {instructor.specialization}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

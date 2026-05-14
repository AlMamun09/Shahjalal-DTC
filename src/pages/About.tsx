import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import type { Instructor } from '../types'

function Section({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
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
    <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
      <Section>
        <h1 className="text-3xl md:text-5xl font-heading font-bold text-center mb-4 text-white">{t('about.title')}</h1>
        <div className="section-divider" />
      </Section>

      {/* Stats */}
      <Section delay={100}>
        <div className="grid grid-cols-3 gap-3 md:gap-6 my-10 md:my-16">
          {[
            { key: 'stat_students', label: t('about.students'), suffix: '+', icon: '👥' },
            { key: 'stat_years', label: t('about.years'), suffix: '+', icon: '📅' },
            { key: 'stat_success_rate', label: t('about.success_rate'), suffix: '%', icon: '🎯' },
          ].map((s) => (
            <div key={s.key} className="card-hover bg-[#1F2937] rounded-2xl p-4 md:p-8 shadow-sm border border-white/[0.06] text-center">
              <span className="text-2xl md:text-4xl mb-2 md:mb-3 block">{s.icon}</span>
              <p className="text-2xl md:text-4xl font-bold text-orange-400 mb-1">{Number(settings[s.key]) || 5000}{s.suffix}</p>
              <p className="text-xs md:text-sm text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Story */}
      <Section delay={150}>
        <div className="bg-[#1F2937] rounded-2xl p-6 md:p-10 shadow-sm border border-white/[0.06] mb-10 md:mb-16">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">Our Story</h2>
          <p className="text-sm md:text-base text-gray-300 leading-relaxed">
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
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-center mb-4 text-white">Our Instructors</h2>
            <div className="section-divider" />
          </Section>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
            {instructors.map((instructor, i) => (
              <Section key={instructor.id} delay={i * 100} className="h-full">
                <div className="card-hover bg-[#1F2937] rounded-2xl p-6 md:p-8 shadow-sm border border-white/[0.06] text-center group h-full">
                  {instructor.photo_url ? (
                    <img src={instructor.photo_url} alt="" className="w-20 h-20 md:w-28 md:h-28 rounded-full mx-auto mb-4 md:mb-5 object-cover border-4 border-white/[0.06] group-hover:border-orange-400 transition-colors duration-300" />
                  ) : (
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full mx-auto mb-4 md:mb-5 bg-gradient-to-br from-orange-500/10 to-orange-400/10 flex items-center justify-center text-2xl md:text-4xl text-orange-400 border-4 border-white/[0.06] group-hover:border-orange-400 transition-colors duration-300">
                      {instructor.name_en.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-base md:text-lg font-semibold mb-1 text-white group-hover:text-orange-400 transition-colors">
                    {lang === 'bn' ? instructor.name_bn : instructor.name_en}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-400">{instructor.experience} · {instructor.specialization}</p>
                </div>
              </Section>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
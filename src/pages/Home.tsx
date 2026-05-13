import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { Course, Testimonial } from '../types'

export function HomePage() {
  const { t, i18n } = useTranslation()
  const [courses, setCourses] = useState<Course[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    supabase.from('courses').select('*').eq('is_active', true).order('sort_order').limit(3).then(({ data }) => {
      if (data) setCourses(data)
    })
    supabase.from('testimonials').select('*').eq('is_visible', true).order('sort_order').then(({ data }) => {
      if (data) setTestimonials(data)
    })
    supabase.from('site_settings').select('*').then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {}
        data.forEach(s => { map[s.key] = s.value })
        setSettings(map)
      }
    })
  }, [])

  const lang = i18n.language === 'bn' ? 'bn' : 'en'

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-brand-black text-white min-h-[70vh] flex items-center">
        {settings.hero_image_url && (
          <img src={settings.hero_image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        )}
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-4">
            {settings[`hero_title_${lang}`] || 'Shahjalal Driving Training Center'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            {settings[`hero_subtitle_${lang}`] || t('hero.tagline')}
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/courses" className="px-8 py-3 bg-brand-red rounded-lg font-semibold hover:bg-red-700 transition-colors">
              {t('hero.view_courses')}
            </Link>
            <Link to="/contact" className="px-8 py-3 border border-white/30 rounded-lg font-semibold hover:bg-white/10 transition-colors">
              {t('hero.contact_us')}
            </Link>
          </div>
          <p className="mt-6 text-sm text-brand-gold font-medium">{settings.brta_reg_number ? `BRTA Approved | Reg No: ${settings.brta_reg_number}` : t('hero.brta_badge')}</p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-brand-gold py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-8 text-center">
          <div><p className="text-3xl font-bold">{settings.stat_students || '5000'}+</p><p className="text-sm mt-1">{t('about.students')}</p></div>
          <div><p className="text-3xl font-bold">{settings.stat_years || '5'}+</p><p className="text-sm mt-1">{t('about.years')}</p></div>
          <div><p className="text-3xl font-bold">{settings.stat_success_rate || '95'}%</p><p className="text-sm mt-1">{t('about.success_rate')}</p></div>
        </div>
      </section>

      {/* Courses Teaser */}
      <section className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-poppins font-bold text-center mb-10">{t('courses.title')}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-2">{lang === 'bn' ? course.name_bn : course.name_en}</h3>
              <p className="text-sm text-gray-500 mb-2">{course.duration_en} · {course.fee}</p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{lang === 'bn' ? course.description_bn : course.description_en}</p>
              <Link to="/enroll" className="text-brand-red font-semibold text-sm hover:underline">{t('courses.enroll')} →</Link>
            </div>
          ))}
        </div>
        {courses.length > 0 && (
          <div className="text-center mt-8">
            <Link to="/courses" className="text-brand-red font-semibold hover:underline">{t('courses.see_all')} →</Link>
          </div>
        )}
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-light-gray">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-poppins font-bold text-center mb-10">Testimonials</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map(t => (
                <div key={t.id} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="text-brand-gold mb-2">{'★'.repeat(t.rating)}</div>
                  <p className="text-gray-600 text-sm mb-4">"{lang === 'bn' ? t.text_bn : t.text_en}"</p>
                  <p className="font-semibold text-sm">{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="py-16 bg-brand-red text-white text-center">
        <h2 className="text-3xl font-poppins font-bold mb-4">Start Your Driving Journey Today</h2>
        <p className="mb-8 text-lg opacity-90">Enroll now and get professional training from BRTA-approved instructors</p>
        <Link to="/enroll" className="px-8 py-3 bg-white text-brand-red rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
          {t('nav.enroll')}
        </Link>
      </section>
    </div>
  )
}

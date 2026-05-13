import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import type { Course } from '../types'

const categories = ['all', 'car', 'motorcycle', 'professional', 'refresher', 'license']

const catIcons: Record<string, string> = {
  all: '📋', car: '🚗', motorcycle: '🏍️', professional: '🚛', refresher: '🔄', license: '📄',
}

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

export function CoursesPage() {
  const { t, i18n } = useTranslation()
  const [courses, setCourses] = useState<Course[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase.from('courses').select('*').eq('is_active', true).order('sort_order').then(({ data }) => {
      if (data) setCourses(data)
    })
  }, [])

  const filtered = filter === 'all' ? courses : courses.filter(c => c.category === filter)
  const lang = i18n.language === 'bn' ? 'bn' : 'en'

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <Section>
        <h1 className="text-4xl md:text-5xl font-poppins font-bold text-center mb-4">{t('courses.title')}</h1>
        <div className="section-divider" />
      </Section>

      <Section delay={100}>
        <div className="flex flex-wrap gap-3 justify-center mt-10 mb-12">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === cat
                  ? 'bg-brand-red text-white shadow-lg shadow-brand-red/30 scale-105'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-brand-red hover:text-brand-red shadow-sm hover:shadow-md'
              }`}
            >
              <span>{catIcons[cat]}</span>
              {t(`courses.${cat}`)}
            </button>
          ))}
        </div>
      </Section>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-6xl mb-4">📭</p>
          <p className="text-lg">No courses found in this category</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((course, i) => (
            <Section key={course.id} delay={i * 100}>
              <div className="card-hover bg-white rounded-2xl p-8 shadow-sm border border-gray-100 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/5 rounded-bl-[100px] group-hover:bg-brand-red/10 transition-colors duration-500" />
                <div className="relative">
                  <div className="text-5xl mb-5">{course.icon || '🚗'}</div>
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-brand-red transition-colors">
                    {lang === 'bn' ? course.name_bn : course.name_en}
                  </h2>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-full"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{course.duration_en}</span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 rounded-full"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{course.fee}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">{lang === 'bn' ? course.description_bn : course.description_en}</p>
                  <Link to="/enroll" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white rounded-xl text-sm font-semibold hover:bg-brand-red-light transition-all duration-300 shadow-md shadow-brand-red/20 hover:shadow-lg hover:shadow-brand-red/30 group/btn">
                    {t('courses.enroll')}
                    <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </div>
            </Section>
          ))}
        </div>
      )}
    </div>
  )
}

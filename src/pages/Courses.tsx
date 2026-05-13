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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Section>
        <h1 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-3">{t('courses.title')}</h1>
        <div className="section-divider" />
      </Section>

      <Section delay={100}>
        <div className="flex flex-wrap gap-3 justify-center mt-8 mb-10">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`group relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-400 overflow-hidden ${
                filter === cat
                  ? 'bg-gradient-to-r from-brand-red to-brand-red-light text-white shadow-xl shadow-brand-red/30 scale-105 ring-2 ring-brand-red/20'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-red/30 hover:text-brand-red shadow-sm hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <span className={`transition-transform duration-300 ${filter === cat ? 'scale-110' : 'group-hover:scale-110'}`}>{catIcons[cat]}</span>
              <span>{t(`courses.${cat}`)}</span>
              {filter === cat && (
                <span className="absolute inset-0 rounded-xl animate-pulse ring-2 ring-white/20" />
              )}
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((course, i) => (
            <Section key={course.id} delay={i * 100}>
              <div className="card-hover bg-white rounded-2xl p-6 shadow-sm border border-gray-100 group relative overflow-hidden h-full flex flex-col">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-red/5 rounded-bl-[100px] group-hover:bg-brand-red/10 transition-colors duration-500" />
                <div className="relative flex flex-col h-full">
                  <div className="text-4xl mb-4">{course.icon || '🚗'}</div>
                  <h2 className="text-lg font-semibold mb-2 group-hover:text-brand-red transition-colors">
                    {lang === 'bn' ? course.name_bn : course.name_en}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-full"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{course.duration_en}</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 rounded-full"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{course.fee}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-4">{lang === 'bn' ? course.description_bn : course.description_en}</p>
                  <Link to="/enroll" className="group/btn relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-red to-brand-red-light text-white rounded-xl text-sm font-semibold overflow-hidden transition-all duration-500 shadow-md shadow-brand-red/25 hover:shadow-lg hover:shadow-brand-red/40 hover:scale-105 active:scale-95 self-start">
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative">{t('courses.enroll')}</span>
                    <svg className="relative w-3.5 h-3.5 transition-all duration-300 group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
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

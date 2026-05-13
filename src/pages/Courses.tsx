import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import type { Course } from '../types'

const categories = ['all', 'car', 'motorcycle', 'professional', 'refresher', 'license']

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

export function CoursesPage() {
  const { t, i18n } = useTranslation()
  const [courses, setCourses] = useState<Course[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    supabase.from('courses').select('*').eq('is_active', true).order('sort_order').then(({ data }) => { if (data) setCourses(data) })
  }, [])

  const filtered = filter === 'all' ? courses : courses.filter(c => c.category === filter)
  const lang = i18n.language === 'bn' ? 'bn' : 'en'

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Section><h1 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-3">{t('courses.title')}</h1><div className="section-divider" /></Section>
      <Section delay={80}>
        <div className="flex flex-wrap gap-2 justify-center mt-8 mb-10">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === cat ? 'bg-gradient-to-r from-brand-red to-brand-red-light text-white shadow-lg shadow-brand-red/30 scale-105' : 'bg-white text-gray-600 border border-gray-200 hover:border-brand-red/30 hover:text-brand-red shadow-sm hover:shadow-md'
              }`}>
              <span className={`transition-transform ${filter === cat ? 'scale-110' : ''}`}>
                {cat === 'all' ? '📋' : cat === 'car' ? '🚗' : cat === 'motorcycle' ? '🏍️' : cat === 'professional' ? '🚛' : cat === 'refresher' ? '🔄' : '📄'}
              </span>
              {t(`courses.${cat}`)}
            </button>
          ))}
        </div>
      </Section>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((course, i) => (
          <Section key={course.id} delay={i * 60}>
            <div className="card-hover bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col group">
              {/* Image */}
              <div className="h-44 bg-gradient-to-br from-brand-red/10 via-brand-gold/5 to-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">{course.icon || '🚗'}</div>
                {/* Price badge */}
                {course.price_bdt && (
                  <div className="absolute top-3 right-3 bg-brand-red text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-lg shadow-brand-red/30">
                    ৳{course.price_bdt.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                {/* Title */}
                <h2 className="text-lg font-semibold mb-3 group-hover:text-brand-red transition-colors">
                  {lang === 'bn' ? course.name_bn : course.name_en}
                </h2>

                {/* Key info grid */}
                {course.practical_classes && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <p className="text-lg font-bold text-brand-red">{course.practical_classes}</p>
                      <p className="text-xs text-gray-500">Practical</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <p className="text-lg font-bold text-brand-red">{course.auto_classes || 0}</p>
                      <p className="text-xs text-gray-500">Auto</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <p className="text-lg font-bold text-brand-red">{course.theory_classes || 0}</p>
                      <p className="text-xs text-gray-500">Theory</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                      <p className="text-lg font-bold text-brand-red">{(course.practical_classes || 0) + (course.auto_classes || 0) + (course.theory_classes || 0)}</p>
                      <p className="text-xs text-gray-500">Total</p>
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-gray-500 text-xs leading-relaxed mb-4 flex-1">{lang === 'bn' ? course.description_bn : course.description_en}</p>

                {/* Two buttons */}
                <div className="flex gap-2 mt-auto">
                  <Link to="/enroll"
                    className="flex-1 text-center px-3 py-2.5 bg-gradient-to-r from-brand-red to-brand-red-light text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-brand-red/30 hover:scale-[1.02] active:scale-95">
                    Contact Us
                  </Link>
                  <button
                    className="flex-1 px-3 py-2.5 border-2 border-brand-red/30 text-brand-red rounded-xl text-sm font-semibold hover:bg-brand-red/5 transition-all hover:border-brand-red">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </Section>
        ))}
      </div>
    </div>
  )
}

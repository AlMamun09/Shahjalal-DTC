import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import type { Course } from '../types'

const categories = ['all', 'car', 'motorcycle', 'professional', 'refresher', 'license']

function Section({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
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
      <Section><h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-3 text-white">{t('courses.title')}</h1><div className="section-divider" /></Section>
      <Section delay={80}>
        <div className="flex flex-wrap gap-2 justify-center mt-8 mb-10">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                filter === cat ? 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/30 scale-105' : 'bg-[#1F2937] text-gray-300 border border-orange-500/10 hover:border-orange-500/30 hover:text-orange-400 shadow-sm hover:shadow-md'
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
          <Section key={course.id} delay={i * 60} className="h-full">
            <div className="card-hover bg-[#111827] rounded-[32px] shadow-xl shadow-black/20 border border-white/[0.06] p-4 h-full flex flex-col group">
              <div className="relative h-44 rounded-[24px] overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent">
                {course.image_url ? (
                  <img src={course.image_url} alt="" className="w-full h-full object-cover transition-transform duration-500" loading="lazy" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">{course.icon || '🚗'}</div>
                )}
                {course.price_bdt && (
                  <div className="absolute top-3 right-3 bg-white/[0.08] backdrop-blur text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-lg">
                    ৳{course.price_bdt.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 px-0 pb-0 mt-4">
                <h2 className="text-lg font-semibold mb-3 text-white group-hover:text-orange-400 transition-colors">
                  {lang === 'bn' ? course.name_bn : course.name_en}
                </h2>

                {course.practical_classes && (
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                      <p className="text-lg font-bold text-orange-400">{course.practical_classes}</p>
                      <p className="text-xs text-gray-400">Practical</p>
                    </div>
                    <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                      <p className="text-lg font-bold text-orange-400">{course.auto_classes || 0}</p>
                      <p className="text-xs text-gray-400">Auto</p>
                    </div>
                    <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                      <p className="text-lg font-bold text-orange-400">{course.theory_classes || 0}</p>
                      <p className="text-xs text-gray-400">Theory</p>
                    </div>
                    <div className="bg-white/[0.04] rounded-xl p-2.5 text-center">
                      <p className="text-lg font-bold text-green-400">{(course.practical_classes || 0) + (course.auto_classes || 0) + (course.theory_classes || 0)}</p>
                      <p className="text-xs text-gray-400">Total</p>
                    </div>
                  </div>
                )}

                <p className="text-gray-400 text-xs leading-relaxed mb-4 flex-1">{lang === 'bn' ? course.description_bn : course.description_en}</p>

                <div className="flex gap-2 mt-auto">
                  <Link to="/enroll"
                    className="flex-1 text-center px-3 py-2.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95">
                    Contact Us
                  </Link>
                  <Link to={`/courses/${course.slug}`}
                    className="flex-1 text-center px-3 py-2.5 border-2 border-orange-500/30 text-orange-400 rounded-xl text-sm font-semibold hover:bg-orange-500/10 hover:border-orange-500 transition-all">
                    View Details
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
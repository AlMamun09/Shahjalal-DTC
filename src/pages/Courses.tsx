import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { Course } from '../types'

const categories = ['all', 'car', 'motorcycle', 'professional', 'refresher', 'license']

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
      <h1 className="text-3xl font-poppins font-bold text-center mb-8">{t('courses.title')}</h1>

      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {categories.map(cat => (
          <button key={cat} onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === cat ? 'bg-brand-red text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t(`courses.${cat}`)}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => (
          <div key={course.id} className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{lang === 'bn' ? course.name_bn : course.name_en}</h2>
            <p className="text-sm text-gray-500 mb-3">{course.duration_en} · {course.fee}</p>
            <p className="text-gray-600 text-sm mb-4">{lang === 'bn' ? course.description_bn : course.description_en}</p>
            <Link to="/enroll" className="inline-block px-4 py-2 bg-brand-red text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
              {t('courses.enroll')}
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

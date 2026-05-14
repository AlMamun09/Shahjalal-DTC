import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import type { Course } from '../types'

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

export function CourseDetailPage() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const lang = i18n.language === 'bn' ? 'bn' : 'en'

  useEffect(() => {
    if (!slug) return
    supabase.from('courses').select('*').eq('slug', slug).single().then(({ data }) => {
      if (data) setCourse(data)
      setLoading(false)
    })
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">Course Not Found</h1>
        <p className="text-gray-400 mb-8">The course you're looking for doesn't exist.</p>
        <Link to="/courses" className="px-6 py-3 bg-white/[0.06] text-gray-300 rounded-xl font-medium hover:bg-white/[0.1] hover:text-white transition-all">View All Courses</Link>
      </div>
    )
  }

  const imageUrl = course.image_url
  const totalClasses = (course.practical_classes || 0) + (course.auto_classes || 0) + (course.theory_classes || 0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Section>
        <Link to="/courses" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors mb-6 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          {t('courses.see_all')}
        </Link>
      </Section>

      <div className="grid lg:grid-cols-5 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Section delay={50}>
            {imageUrl && (
              <div className="rounded-2xl overflow-hidden mb-8 shadow-lg shadow-orange-500/10">
                <img src={imageUrl} alt="" className="w-full h-72 md:h-96 object-cover" />
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
              {lang === 'bn' ? course.name_bn : course.name_en}
            </h1>
            {course.price_bdt && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 rounded-xl text-white font-bold text-xl mb-6 shadow-lg shadow-orange-500/30">
                ৳{course.price_bdt.toLocaleString()}
              </div>
            )}
          </Section>

          <Section delay={100}>
            <div className="prose prose-invert max-w-none">
              <h2 className="text-xl font-semibold text-white mb-4">Description</h2>
              <p className="text-gray-300 leading-relaxed">{lang === 'bn' ? course.description_bn : course.description_en}</p>
            </div>
          </Section>

          {course.duration_en && (
            <Section delay={150}>
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-white mb-4">Course Details</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {course.duration_en && (
                    <div className="bg-[#1F2937] rounded-xl p-4 text-center border border-orange-500/10">
                      <p className="text-2xl font-bold text-orange-400">{lang === 'bn' ? course.duration_bn : course.duration_en}</p>
                      <p className="text-xs text-gray-400 mt-1">Duration</p>
                    </div>
                  )}
                  {course.fee && (
                    <div className="bg-[#1F2937] rounded-xl p-4 text-center border border-orange-500/10">
                      <p className="text-2xl font-bold text-orange-400">{course.fee}</p>
                      <p className="text-xs text-gray-400 mt-1">Fee</p>
                    </div>
                  )}
                  {course.practical_classes && (
                    <div className="bg-[#1F2937] rounded-xl p-4 text-center border border-orange-500/10">
                      <p className="text-2xl font-bold text-orange-400">{course.practical_classes}</p>
                      <p className="text-xs text-gray-400 mt-1">Practical</p>
                    </div>
                  )}
                  {totalClasses > 0 && (
                    <div className="bg-[#1F2937] rounded-xl p-4 text-center border border-orange-500/10">
                      <p className="text-2xl font-bold text-green-400">{totalClasses}</p>
                      <p className="text-xs text-gray-400 mt-1">Total Classes</p>
                    </div>
                  )}
                </div>
              </div>
            </Section>
          )}

          {(course.practical_classes || course.auto_classes || course.theory_classes) && (
            <Section delay={200}>
              <div className="mt-8 bg-[#1F2937] rounded-2xl p-6 border border-orange-500/10">
                <h2 className="text-xl font-semibold text-white mb-4">Class Breakdown</h2>
                <div className="space-y-3">
                  {course.practical_classes && (
                    <div className="flex items-center justify-between py-2 border-b border-orange-500/10">
                      <span className="text-gray-300">Practical Driving Classes</span>
                      <span className="font-bold text-orange-400">{course.practical_classes} classes</span>
                    </div>
                  )}
                  {course.auto_classes && (
                    <div className="flex items-center justify-between py-2 border-b border-orange-500/10">
                      <span className="text-gray-300">Auto Driving Classes</span>
                      <span className="font-bold text-orange-400">{course.auto_classes} classes</span>
                    </div>
                  )}
                  {course.theory_classes && (
                    <div className="flex items-center justify-between py-2 border-b border-orange-500/10">
                      <span className="text-gray-300">Theory Classes</span>
                      <span className="font-bold text-orange-400">{course.theory_classes} classes</span>
                    </div>
                  )}
                  {totalClasses > 0 && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-white font-semibold">Total</span>
                      <span className="font-bold text-green-400">{totalClasses} classes</span>
                    </div>
                  )}
                </div>
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2">
          <Section delay={150}>
            <div className="bg-[#1F2937] rounded-2xl p-6 border border-orange-500/10 sticky top-24 shadow-lg">
              {imageUrl && (
                <img src={imageUrl} alt="" className="w-full h-40 object-cover rounded-xl mb-6 lg:hidden" />
              )}
              <h3 className="text-lg font-semibold text-white mb-4">
                {lang === 'bn' ? course.name_bn : course.name_en}
              </h3>

              {course.price_bdt && (
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-1">Course Fee</p>
                  <p className="text-3xl font-bold text-orange-400">৳{course.price_bdt.toLocaleString()}</p>
                </div>
              )}

              <div className="space-y-3 mb-6 text-sm text-gray-400">
                {course.category && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    <span className="capitalize">{course.category}</span>
                  </div>
                )}
                {course.duration_en && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{lang === 'bn' ? course.duration_bn : course.duration_en}</span>
                  </div>
                )}
              </div>

              <Link to="/enroll" className="block w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-bold text-center hover:shadow-lg hover:shadow-orange-500/30 transition-all text-lg">
                {t('enroll.title')}
              </Link>
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}
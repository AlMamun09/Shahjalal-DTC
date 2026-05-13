import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import type { Course, Testimonial } from '../types'

function RevealSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${delay ? `delay-${delay}` : ''} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  )
}

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, visible } = useReveal()

  useEffect(() => {
    if (!visible) return
    let start = 0
    const dur = 2000
    const step = Math.ceil(end / (dur / 16))
    const id = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(id) }
      else setCount(start)
    }, 16)
    return () => clearInterval(id)
  }, [visible, end])

  return <span ref={ref}>{count}{suffix}</span>
}

export function HomePage() {
  const { t, i18n } = useTranslation()
  const [courses, setCourses] = useState<Course[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [testiIdx, setTestiIdx] = useState(0)

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

  useEffect(() => {
    if (testimonials.length <= 1) return
    const id = setInterval(() => setTestiIdx(i => (i + 1) % testimonials.length), 5000)
    return () => clearInterval(id)
  }, [testimonials.length])

  const lang = i18n.language === 'bn' ? 'bn' : 'en'

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-black to-zinc-900" />
        {settings.hero_image_url && (
          <>
            <img src={settings.hero_image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105 animate-[float_8s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent" />
          </>
        )}
        {/* Decorative circles */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_1s]" />

        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <RevealSection delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm text-brand-gold mb-8 border border-white/10">
              <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
              {t('hero.brta_badge')}
            </div>
          </RevealSection>

          <RevealSection delay={100}>
            <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 leading-tight">
              {settings[`hero_title_${lang}`]?.split(' ').map((word, i) =>
                i === 1 ? <span key={i} className="gradient-text">{word} </span> : word + ' '
              ) || 'Shahjalal Driving Training Center'}
            </h1>
          </RevealSection>

          <RevealSection delay={200}>
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              {settings[`hero_subtitle_${lang}`] || t('hero.tagline')}
            </p>
          </RevealSection>

          <RevealSection delay={300}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/courses" className="btn-shine px-8 py-4 bg-brand-red rounded-xl font-semibold text-lg hover:bg-brand-red-light transition-all duration-300 shadow-xl shadow-brand-red/30 hover:shadow-2xl hover:shadow-brand-red/40 hover:scale-105">
                {t('hero.view_courses')}
              </Link>
              <Link to="/contact" className="px-8 py-4 border border-white/30 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:border-white/50 hover:scale-105">
                {t('hero.contact_us')}
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="relative -mt-16 z-10 max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-brand-red to-brand-red-light rounded-2xl p-8 shadow-2xl shadow-brand-red/30">
          <div className="grid grid-cols-3 gap-8 text-center text-white">
            {[
              { key: 'stat_students', label: t('about.students'), suffix: '+' },
              { key: 'stat_years', label: t('about.years'), suffix: '+' },
              { key: 'stat_success_rate', label: t('about.success_rate'), suffix: '%' },
            ].map((s, i) => (
              <RevealSection key={s.key} delay={i * 100}>
                <p className="text-4xl md:text-5xl font-bold mb-1">
                  <Counter end={Number(settings[s.key]) || 5000} suffix={s.suffix} />
                </p>
                <p className="text-sm text-white/80 mt-1">{s.label}</p>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <RevealSection>
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-center mb-4">{t('courses.title')}</h2>
          <div className="section-divider" />
        </RevealSection>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {courses.map((course, i) => (
            <RevealSection key={course.id} delay={i * 150}>
              <div className="card-hover bg-white rounded-2xl p-8 shadow-sm border border-gray-100 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/0 to-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="text-5xl mb-5">{course.icon || '🚗'}</div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-brand-red transition-colors">
                    {lang === 'bn' ? course.name_bn : course.name_en}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{course.duration_en}</span>
                    <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{course.fee}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">{lang === 'bn' ? course.description_bn : course.description_en}</p>
                  <Link to="/enroll" className="group/btn inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-brand-red to-brand-red-light text-white rounded-xl text-sm font-semibold transition-all duration-500 shadow-md shadow-brand-red/25 hover:shadow-lg hover:shadow-brand-red/40 hover:scale-105 active:scale-95 overflow-hidden relative">
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative">{t('courses.enroll')}</span>
                    <svg className="relative w-4 h-4 transition-all duration-300 group-hover/btn:translate-x-1 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </Link>
                </div>
              </div>
            </RevealSection>
          ))}
        </div>

        {courses.length > 0 && (
          <RevealSection>
            <div className="text-center mt-12">
              <Link to="/courses" className="group/see inline-flex items-center gap-3 px-8 py-3.5 border-2 border-brand-red/30 text-brand-red rounded-2xl font-semibold text-sm hover:bg-gradient-to-r hover:from-brand-red hover:to-brand-red-light hover:text-white hover:border-brand-red transition-all duration-500 hover:shadow-xl hover:shadow-brand-red/25 hover:scale-105 active:scale-95">
                <span>{t('courses.see_all')}</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red group-hover/see:bg-white transition-all duration-300" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red group-hover/see:bg-white transition-all duration-300 delay-75" />
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-red group-hover/see:bg-white transition-all duration-300 delay-150" />
                </span>
              </Link>
            </div>
          </RevealSection>
        )}
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-24 bg-light-gray overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <RevealSection>
              <h2 className="text-4xl md:text-5xl font-poppins font-bold text-center mb-4">What Our Students Say</h2>
              <div className="section-divider" />
            </RevealSection>

            {/* Desktop grid */}
            <div className="hidden md:grid md:grid-cols-3 gap-8 mt-12">
              {testimonials.map((t, i) => (
                <RevealSection key={t.id} delay={i * 150}>
                  <div className="card-hover bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="flex text-brand-gold mb-4 text-lg">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                    <p className="text-gray-600 leading-relaxed mb-6 italic">"{lang === 'bn' ? t.text_bn : t.text_en}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red font-semibold text-sm">
                        {t.name.charAt(0)}
                      </div>
                      <p className="font-semibold text-sm">{t.name}</p>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>

            {/* Mobile carousel */}
            <div className="md:hidden mt-8 relative">
              <div className="overflow-hidden">
                <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${testiIdx * 100}%)` }}>
                  {testimonials.map(t => (
                    <div key={t.id} className="min-w-full px-2">
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex text-brand-gold mb-3">{'★'.repeat(t.rating)}</div>
                        <p className="text-gray-600 leading-relaxed mb-4 italic text-sm">"{lang === 'bn' ? t.text_bn : t.text_en}"</p>
                        <p className="font-semibold text-sm">{t.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setTestiIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === testiIdx ? 'bg-brand-red w-6' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <RevealSection>
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-center mb-4">Why Choose Us</h2>
          <div className="section-divider" />
        </RevealSection>

        <div className="grid md:grid-cols-4 gap-8 mt-12">
          {[
            { icon: '🏆', title: 'BRTA Approved', desc: 'Govt. registered training center with official certification' },
            { icon: '👨‍🏫', title: 'Expert Instructors', desc: '5+ years experienced trainers for all course types' },
            { icon: '💰', title: 'Affordable Fees', desc: 'Quality training at competitive prices with flexible payment' },
            { icon: '🎯', title: 'High Success Rate', desc: `${settings.stat_success_rate || 95}% pass rate in BRTA tests` },
          ].map((item, i) => (
            <RevealSection key={i} delay={i * 100}>
              <div className="card-hover bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center group">
                <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">{item.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red to-brand-red-light" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-white rounded-full" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <RevealSection>
            <h2 className="text-4xl md:text-5xl font-poppins font-bold mb-4">Start Your Driving Journey Today</h2>
            <p className="text-xl text-white/80 mb-10">Enroll now and get professional training from BRTA-approved instructors</p>
            <Link to="/enroll" className="inline-block btn-shine px-10 py-4 bg-white text-brand-red rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:scale-105">
              Enroll Now →
            </Link>
          </RevealSection>
        </div>
      </section>
    </div>
  )
}

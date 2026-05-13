import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import type { Course, Testimonial, Service, Facility, GalleryPhoto } from '../types'

function Section({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, visible } = useReveal()
  useEffect(() => {
    if (!visible) return
    let start = 0; const dur = 2000; const step = Math.ceil(end / (dur / 16))
    const id = setInterval(() => { start += step; if (start >= end) { setCount(end); clearInterval(id) } else setCount(start) }, 16)
    return () => clearInterval(id)
  }, [visible, end])
  return <span ref={ref}>{count}{suffix}</span>
}

const catIcons: Record<string, string> = { all: '📋', car: '🚗', motorcycle: '🏍️', professional: '🚛', refresher: '🔄', license: '📄' }

export function HomePage() {
  const { t, i18n } = useTranslation()
  const [courses, setCourses] = useState<Course[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [testiIdx, setTestiIdx] = useState(0)

  useEffect(() => {
    supabase.from('courses').select('*').eq('is_active', true).order('sort_order').then(({ data }) => { if (data) setCourses(data) })
    supabase.from('testimonials').select('*').eq('is_visible', true).order('sort_order').then(({ data }) => { if (data) setTestimonials(data) })
    supabase.from('services').select('*').eq('is_active', true).order('sort_order').then(({ data }) => { if (data) setServices(data) })
    supabase.from('facilities').select('*').eq('is_active', true).order('sort_order').then(({ data }) => { if (data) setFacilities(data) })
    supabase.from('gallery_photos').select('*').order('sort_order').limit(6).then(({ data }) => { if (data) setPhotos(data) })
    supabase.from('site_settings').select('*').then(({ data }) => {
      if (data) { const map: Record<string, string> = {}; data.forEach(s => { map[s.key] = s.value }); setSettings(map) }
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
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-black to-zinc-900" />
        {settings.hero_image_url && (
          <>
            <img src={settings.hero_image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105 animate-[float_8s_ease-in-out_infinite]" fetchpriority="high" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/60 to-transparent" />
          </>
        )}
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_1s]" />
        <div className="relative max-w-7xl mx-auto px-4 py-12 text-center">
          <Section><div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full text-sm text-brand-gold mb-8 border border-white/10"><span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />{t('hero.brta_badge')}</div></Section>
          <Section delay={100}><h1 className="text-5xl md:text-7xl font-poppins font-bold mb-6 leading-tight">{settings[`hero_title_${lang}`] || 'Shahjalal Driving Training Center'}</h1></Section>
          <Section delay={200}><p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">{settings[`hero_subtitle_${lang}`] || t('hero.tagline')}</p></Section>
          <Section delay={300}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/courses" className="btn-shine px-8 py-4 bg-brand-red rounded-xl font-semibold text-lg hover:bg-brand-red-light transition-all shadow-xl shadow-brand-red/30 hover:shadow-2xl hover:scale-105">View Courses</Link>
              <Link to="/contact" className="px-8 py-4 border border-white/30 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all hover:border-white/50 hover:scale-105">Contact Us</Link>
              <Link to="/enroll" className="px-8 py-4 bg-brand-gold text-brand-black rounded-xl font-semibold text-lg hover:bg-yellow-400 transition-all hover:scale-105">Apply Online</Link>
            </div>
          </Section>
        </div>
      </section>

      {/* Trust Bar - Stats */}
      <section className="relative -mt-10 z-10 max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-brand-red to-brand-red-light rounded-2xl p-8 shadow-2xl shadow-brand-red/30">
          <div className="grid grid-cols-4 gap-6 text-center text-white">
            {[
              { key: 'stat_students', label: 'Passing Students', suffix: '+' },
              { label: 'Present Student', value: 200, suffix: '+' },
              { label: 'All Instructor', value: 5, suffix: '' },
              { label: 'Our Branch', value: 2, suffix: '' },
            ].map((s, i) => (
              <Section key={s.label} delay={i * 80}>
                <p className="text-3xl md:text-4xl font-bold mb-1"><Counter end={s.value || Number(settings[s.key]) || 5000} suffix={s.suffix} /></p>
                <p className="text-xs text-white/70">{s.label}</p>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <Section><h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-3">Our Services</h2><div className="section-divider" /></Section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-10">
            {services.map((s, i) => (
              <Section key={s.id} delay={i * 60}>
                <div className="card-hover bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center h-full flex flex-col items-center justify-center">
                  <span className="text-3xl mb-3">{s.icon}</span>
                  <h3 className="text-sm font-semibold mb-1">{lang === 'bn' ? s.title_bn : s.title_en}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{lang === 'bn' ? s.desc_bn : s.desc_en}</p>
                </div>
              </Section>
            ))}
          </div>
        </section>
      )}

      {/* Courses */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4">
          <Section><h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-3">{t('courses.title')}</h2><div className="section-divider" /></Section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {courses.slice(0, 6).map((course, i) => (
              <Section key={course.id} delay={i * 80}>
                <div className="card-hover bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col group">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{course.icon || '🚗'}</span>
                    {course.price_bdt && <span className="text-xl font-bold text-brand-red">৳{course.price_bdt.toLocaleString()}</span>}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-red transition-colors">{lang === 'bn' ? course.name_bn : course.name_en}</h3>
                  <p className="text-gray-600 text-sm mb-4 flex-1">{lang === 'bn' ? course.description_bn : course.description_en}</p>
                  {course.practical_classes && (
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-gray-50 rounded-xl p-2.5 text-center"><p className="text-xs text-gray-400">Practical</p><p className="font-semibold text-sm">{course.practical_classes}</p></div>
                      <div className="bg-gray-50 rounded-xl p-2.5 text-center"><p className="text-xs text-gray-400">Auto</p><p className="font-semibold text-sm">{course.auto_classes}</p></div>
                      <div className="bg-gray-50 rounded-xl p-2.5 text-center"><p className="text-xs text-gray-400">Theory</p><p className="font-semibold text-sm">{course.theory_classes}</p></div>
                    </div>
                  )}
                  <Link to="/enroll" className="group/btn relative inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-red to-brand-red-light text-white rounded-xl text-sm font-semibold overflow-hidden transition-all shadow-md hover:shadow-lg hover:shadow-brand-red/30 hover:scale-[1.02] active:scale-95">
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                    <span className="relative">Enroll Now</span>
                    <svg className="relative w-3.5 h-3.5 transition-all group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                  </Link>
                </div>
              </Section>
            ))}
          </div>
          <Section><div className="text-center mt-8"><Link to="/courses" className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-brand-red/30 text-brand-red rounded-2xl font-semibold text-sm hover:bg-gradient-to-r hover:from-brand-red hover:to-brand-red-light hover:text-white hover:border-brand-red transition-all hover:shadow-xl hover:scale-105">See All Courses & Prices →</Link></div></Section>
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <Section><h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-3">Our Facilities</h2><div className="section-divider" /></Section>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mt-10">
            {facilities.map((f, i) => (
              <Section key={f.id} delay={i * 60}>
                <div className="card-hover bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center h-full flex flex-col items-center justify-center">
                  <span className="text-3xl mb-3">{f.icon}</span>
                  <h3 className="text-sm font-semibold mb-1">{lang === 'bn' ? f.title_bn : f.title_en}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{lang === 'bn' ? f.desc_bn : f.desc_en}</p>
                </div>
              </Section>
            ))}
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {photos.length > 0 && (
        <section className="py-16 bg-light-gray">
          <div className="max-w-7xl mx-auto px-4">
            <Section><h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-3">See Our Driving Practice Gallery</h2><div className="section-divider" /></Section>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
              {photos.map((photo, i) => (
                <Section key={photo.id} delay={i * 60}>
                  <Link to="/gallery" className="block aspect-video rounded-xl overflow-hidden group">
                    <img src={photo.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </Link>
                </Section>
              ))}
            </div>
            <Section><div className="text-center mt-8"><Link to="/gallery" className="text-brand-red font-semibold hover:underline">View All Photos →</Link></div></Section>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4">
          <Section><h2 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-3">What Our Students Say</h2><div className="section-divider" /></Section>
          <div className="hidden md:grid md:grid-cols-3 gap-6 mt-10">
            {testimonials.map((t, i) => (
              <Section key={t.id} delay={i * 80}>
                <div className="card-hover bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
                  <div className="flex text-brand-gold mb-3 text-sm">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                  <p className="text-gray-600 text-sm leading-relaxed italic flex-1">"{lang === 'bn' ? t.text_bn : t.text_en}"</p>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red font-semibold text-xs">{t.name.charAt(0)}</div>
                    <p className="font-semibold text-sm">{t.name}</p>
                  </div>
                </div>
              </Section>
            ))}
          </div>
          <div className="md:hidden mt-8">
            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${testiIdx * 100}%)` }}>
                {testimonials.map(t => (
                  <div key={t.id} className="min-w-full px-1">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex text-brand-gold mb-2">{'★'.repeat(t.rating)}</div>
                      <p className="text-gray-600 text-sm italic mb-3">"{lang === 'bn' ? t.text_bn : t.text_en}"</p>
                      <p className="font-semibold text-sm">{t.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setTestiIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === testiIdx ? 'bg-brand-red w-5' : 'bg-gray-300'}`} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-red to-brand-red-light" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border border-white rounded-full" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <Section><h2 className="text-3xl md:text-4xl font-poppins font-bold mb-4">Start Your Driving Journey Today</h2>
            <p className="text-lg text-white/80 mb-8">Professional training from BRTA-approved instructors at two convenient locations</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/enroll" className="btn-shine px-8 py-4 bg-white text-brand-red rounded-xl font-bold hover:bg-gray-100 transition-all shadow-2xl hover:scale-105">Apply Now →</Link>
              <Link to="/contact" className="px-8 py-4 border-2 border-white/40 rounded-xl font-semibold hover:bg-white/10 transition-all">Contact Us</Link>
            </div>
          </Section>
        </div>
      </section>
    </div>
  )
}

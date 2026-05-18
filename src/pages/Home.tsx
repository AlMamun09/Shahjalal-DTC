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

export function HomePage() {
  const { t, i18n } = useTranslation()
  const [courses, setCourses] = useState<Course[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [testiIdx, setTestiIdx] = useState(0)
  const [galleryIdx, setGalleryIdx] = useState(0)

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
  const galleryLabels = ['Practical Session', 'Night Training', 'Highway Practice', 'Parking Drill', 'Traffic Signal', 'Instructor Guidance']

  useEffect(() => {
    if (photos.length <= 1) return
    const id = setInterval(() => setGalleryIdx(i => (i + 1) % photos.length), 4000)
    return () => clearInterval(id)
  }, [photos.length])

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#0F172A]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite_1s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-energy opacity-5 rounded-full blur-3xl" />
        <div className="absolute inset-0 speed-lines pointer-events-none" />
        {settings.hero_image_url && (
          <>
            <img src={settings.hero_image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 scale-105 animate-[float_8s_ease-in-out_infinite]" fetchPriority="high" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/60 to-transparent" />
          </>
        )}
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <Section>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500/10 backdrop-blur rounded-full text-sm text-orange-400 mb-8 border border-orange-500/20">
              <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse" />
              <span className="font-medium">{t('hero.brta_badge')}</span>
            </div>
          </Section>
          <Section delay={100}>
            <h1 className={`${lang === 'bn' ? 'font-bangla leading-[1.4] pt-1' : 'font-heading leading-[1.5] pt-4'} font-bold mb-6 text-4xl sm:text-5xl md:text-7xl tracking-wide text-white`}>
              {lang === 'bn'
                ? (settings.hero_title_bn || 'শাহজালাল ড্রাইভিং ট্রেনিং সেন্টার').split(' ').map((word, i) =>
                    word === 'ড্রাইভিং' ? <span key={i} className="text-gradient inline-block">ড্রাইভিং </span> : word + ' '
                  )
                : (settings.hero_title_en || 'Shahjalal Driving Training Center').split(' ').map((word, i) =>
                    word.toLowerCase() === 'driving' ? <span key={i} className="text-gradient">Driving </span> : word + ' '
                  )
              }
            </h1>
          </Section>
          <Section delay={200}>
            <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
              {settings[`hero_subtitle_${lang}`] || t('hero.tagline')}
            </p>
          </Section>
          <Section delay={300}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/courses" className="btn-shine px-8 py-4 bg-gradient-energy text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/40 hover:scale-105 transition-all shadow-lg shadow-orange-500/30">View Courses</Link>
              <Link to="/contact" className="px-8 py-4 border-2 border-orange-500/30 text-white rounded-xl font-semibold text-lg hover:bg-orange-500/10 hover:border-orange-500 hover:scale-105 transition-all">Contact Us</Link>
            </div>
          </Section>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-16 z-10 max-w-5xl mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-8 shadow-2xl shadow-orange-500/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
            {[
              { key: 'stat_students', label: 'Passing Students', suffix: '+' },
              { label: 'Present Student', value: 200, suffix: '+' },
              { label: 'All Instructor', value: 5, suffix: '' },
              { label: 'Our Branch', value: 2, suffix: '' },
            ].map((s, i) => (
              <Section key={s.label} delay={i * 80}>
                <p className="text-3xl md:text-4xl font-heading font-bold mb-1"><Counter end={s.value || (s.key ? Number(settings[s.key]) : 0) || 5000} suffix={s.suffix} /></p>
                <p className="text-xs text-white/70">{s.label}</p>
              </Section>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      {services.length > 0 && (
        <section className="py-10 bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-4">
            <Section><h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-3 text-white">Our Services</h2><div className="section-divider" /></Section>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-10">
              {services.map((s, i) => (
                <Section key={s.id} delay={i * 60} className="h-full">
                  <div className="card-hover bg-[#1F2937] rounded-2xl p-5 shadow-sm border border-white/[0.06] text-center h-full flex flex-col items-center justify-center group">
                    <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{s.icon}</span>
                    <h3 className="text-sm font-semibold mb-1 text-white group-hover:text-orange-400 transition-colors">{lang === 'bn' ? s.title_bn : s.title_en}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{lang === 'bn' ? s.desc_bn : s.desc_en}</p>
                  </div>
                </Section>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Courses */}
      <section className="py-10 bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4">
          <Section><h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-3 text-white">{t('courses.title')}</h2><div className="section-divider" /></Section>
          <div className="relative mt-10">
            <div className="flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none px-4 md:px-0 py-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollPaddingInline: 'max(1rem, calc(50% - 160px))' }}>
              {courses.slice(0, 6).map((course, i) => (
                <div key={course.id} className="w-[85vw] max-w-[320px] shrink-0 snap-center">
                  <Section delay={i * 60}>
                    <div className="card-hover bg-[#111827] rounded-[32px] shadow-xl shadow-black/20 border border-white/[0.06] p-4 h-full flex flex-col group">
                      <div className="relative h-40 rounded-[24px] overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent flex items-center justify-center">
                        {course.image_url ? (
                          <img src={course.image_url} alt="" className="w-full h-full object-cover transition-transform duration-500" loading="lazy" />
                        ) : (
                          <span className="text-6xl opacity-30">{course.icon || '🚗'}</span>
                        )}
                        {course.price_bdt && (
                          <div className="absolute top-3 right-3 bg-white/[0.08] backdrop-blur text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-lg">৳{course.price_bdt.toLocaleString()}</div>
                        )}
                      </div>
                      <div className="flex flex-col flex-1 px-0 pb-0 mt-4">
                        <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-orange-400 transition-colors">{lang === 'bn' ? course.name_bn : course.name_en}</h3>
                        {course.practical_classes && (
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="bg-white/[0.04] rounded-xl p-2.5 text-center"><p className="text-lg font-bold text-orange-400">{course.practical_classes}</p><p className="text-xs text-gray-400">Practical</p></div>
                            <div className="bg-white/[0.04] rounded-xl p-2.5 text-center"><p className="text-lg font-bold text-orange-400">{course.auto_classes || 0}</p><p className="text-xs text-gray-400">Auto</p></div>
                            <div className="bg-white/[0.04] rounded-xl p-2.5 text-center"><p className="text-lg font-bold text-orange-400">{course.theory_classes || 0}</p><p className="text-xs text-gray-400">Theory</p></div>
                            <div className="bg-white/[0.04] rounded-xl p-2.5 text-center"><p className="text-lg font-bold text-green-400">{(course.practical_classes || 0) + (course.auto_classes || 0) + (course.theory_classes || 0)}</p><p className="text-xs text-gray-400">Total</p></div>
                          </div>
                        )}
                        <p className="text-gray-400 text-xs leading-relaxed flex-1 mb-4">{lang === 'bn' ? course.description_bn : course.description_en}</p>
                        <div className="flex gap-2 mt-auto">
                          <Link to="/enroll" className="flex-1 text-center px-3 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold transition-all hover:bg-orange-400 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-95">Contact Us</Link>
                          <Link to={`/courses/${course.slug}`} className="flex-1 text-center px-3 py-2.5 border border-white/[0.12] text-gray-300 rounded-xl text-sm font-semibold hover:bg-white/[0.06] hover:text-white transition-all">View Details</Link>
                        </div>
                      </div>
                    </div>
                  </Section>
                </div>
              ))}
            </div>
          </div>
          <Section><div className="text-center mt-8"><Link to="/courses" className="inline-flex items-center px-6 py-3 bg-white/[0.06] text-gray-300 rounded-xl font-medium text-sm hover:bg-white/[0.1] hover:text-white transition-all">See All Courses</Link></div></Section>
        </div>
      </section>

      {/* Facilities */}
      {facilities.length > 0 && (
        <section className="py-10 bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-4">
            <Section><h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-3 text-white">Our Facilities</h2><div className="section-divider" /></Section>
            <div className="relative mt-10">
              <div className="flex gap-4 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none px-4 md:px-0 py-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollPaddingInline: 'max(1rem, calc(50% - 160px))' }}>
                {facilities.map((f, i) => (
                  <div key={f.id} className="w-[75vw] max-w-[260px] shrink-0 snap-center">
                  <Section delay={i * 60} className="h-full">
                      <div className="card-hover bg-[#1F2937] rounded-2xl p-6 shadow-sm border border-white/[0.06] text-center h-full flex flex-col items-center justify-center group min-h-[180px]">
                        <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{f.icon}</span>
                        <h3 className="text-sm font-semibold mb-1 text-white group-hover:text-orange-400 transition-colors">{lang === 'bn' ? f.title_bn : f.title_en}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">{lang === 'bn' ? f.desc_bn : f.desc_en}</p>
                      </div>
                    </Section>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      {photos.length > 0 && (
        <section className="py-10 bg-[#111827] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4">
            <Section><h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-3 text-white">See Our Driving Practice Gallery</h2><div className="section-divider" /></Section>

            {/* Desktop Carousel */}
            <div className="hidden md:block relative mt-10">
              <div className="flex items-center justify-center gap-6 px-16">
                {photos.map((photo, i) => {
                  const isActive = i === galleryIdx
                  const isSide = i === galleryIdx - 1 || i === galleryIdx + 1
                  return (
                    <button
                      key={photo.id}
                      onClick={() => setGalleryIdx(i)}
                      className={`relative rounded-[28px] overflow-hidden transition-all duration-500 ease-out shrink-0 ${
                        isActive
                          ? 'w-[560px] h-[350px] shadow-2xl shadow-orange-500/20 ring-2 ring-orange-500/30 scale-100 z-10'
                          : isSide
                            ? 'w-[300px] h-[220px] opacity-50 scale-90 blur-[1px] hover:opacity-70 hover:blur-none'
                            : 'w-0 h-0 opacity-0'
                      }`}
                    >
                      <img src={photo.url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      <span className="absolute bottom-4 left-4 text-white text-sm font-medium px-3 py-1.5 bg-white/10 backdrop-blur rounded-lg">
                        {galleryLabels[i % galleryLabels.length]}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Desktop Arrows */}
              {photos.length > 1 && (
                <>
                  <button onClick={() => setGalleryIdx(i => (i - 1 + photos.length) % photos.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/[0.08] backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/[0.15] transition-all border border-white/[0.06]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <button onClick={() => setGalleryIdx(i => (i + 1) % photos.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/[0.08] backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/[0.15] transition-all border border-white/[0.06]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}

              {/* Desktop Pagination */}
              {photos.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {photos.map((_, i) => (
                    <button key={i} onClick={() => setGalleryIdx(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === galleryIdx ? 'w-8 bg-orange-500' : 'w-2 bg-white/20 hover:bg-white/40'
                      }`} />
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Carousel */}
            <div className="md:hidden mt-10">
              <div
                className="relative overflow-hidden rounded-[28px] select-none"
                onTouchStart={e => { const t = e.touches[0]; (e.currentTarget as HTMLElement).dataset['sx'] = String(t.clientX) }}
                onTouchEnd={e => {
                  const el = e.currentTarget as HTMLElement
                  const sx = parseFloat(el.dataset['sx'] || '0')
                  const dx = e.changedTouches[0].clientX - sx
                  if (Math.abs(dx) > 50) {
                    if (dx < 0) setGalleryIdx(i => Math.min(i + 1, photos.length - 1))
                    else setGalleryIdx(i => Math.max(i - 1, 0))
                  }
                }}
              >
                <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${galleryIdx * 100}%)` }}>
                  {photos.map((photo, i) => (
                    <div key={photo.id} className="min-w-full">
                      <Link to="/gallery" className="block relative rounded-[28px] overflow-hidden group">
                        <div className="aspect-[16/10]">
                          <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                        <span className="absolute bottom-4 left-4 text-white text-sm font-medium px-3 py-1.5 bg-white/10 backdrop-blur rounded-lg">
                          {galleryLabels[i % galleryLabels.length]}
                        </span>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
              {photos.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {photos.map((_, i) => (
                    <button key={i} onClick={() => setGalleryIdx(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === galleryIdx ? 'w-8 bg-orange-500' : 'w-2 bg-white/20 hover:bg-white/40'
                      }`} />
                  ))}
                </div>
              )}
            </div>

            <Section><div className="text-center mt-8"><Link to="/gallery" className="inline-flex items-center px-5 py-2.5 bg-white/[0.06] text-gray-300 rounded-xl text-sm font-medium hover:bg-white/[0.1] hover:text-white transition-all">View All Photos</Link></div></Section>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-10 bg-[#0F172A]">
          <div className="max-w-7xl mx-auto px-4">
            <Section><h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-3 text-white">What Our Students Say</h2><div className="section-divider" /></Section>
            <div className="hidden md:grid md:grid-cols-3 gap-6 mt-10">
              {testimonials.map((t, i) => (
                <Section key={t.id} delay={i * 80}>
                  <div className="card-hover bg-[#1F2937] rounded-2xl p-6 shadow-sm border border-orange-500/10 h-full flex flex-col">
                    <div className="flex text-orange-400 mb-3 text-sm">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
                    <p className="text-gray-300 text-sm leading-relaxed italic flex-1">"{lang === 'bn' ? t.text_bn : t.text_en}"</p>
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-orange-500/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-energy flex items-center justify-center text-white font-bold text-sm">{t.name.charAt(0)}</div>
                      <p className="font-semibold text-white">{t.name}</p>
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
                      <div className="bg-[#1F2937] rounded-2xl p-5 shadow-sm border border-orange-500/10">
                        <div className="flex text-orange-400 mb-2">{'★'.repeat(t.rating)}</div>
                        <p className="text-gray-300 text-sm italic mb-3">"{lang === 'bn' ? t.text_bn : t.text_en}"</p>
                        <p className="font-semibold text-white">{t.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setTestiIdx(i)} className={`w-2 h-2 rounded-full transition-all ${i === testiIdx ? 'bg-orange-500 w-5' : 'bg-gray-600'}`} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="relative py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center text-white">
          <Section>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Start Your Driving Journey Today</h2>
            <p className="text-lg text-white/80 mb-8">Professional training from BRTA-approved instructors at two convenient locations</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/enroll" className="btn-shine px-10 py-5 bg-white text-orange-600 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 text-lg">Apply Now</Link>
              <Link to="/contact" className="px-10 py-5 border-2 border-white/40 rounded-xl font-semibold hover:bg-white/10 transition-all text-lg">Contact Us</Link>
            </div>
          </Section>
        </div>
      </section>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTranslation } from 'react-i18next'

export function Footer() {
  const { i18n } = useTranslation()
  const [siteName, setSiteName] = useState('')
  const lang = i18n.language === 'bn' ? 'bn' : 'en'

  useEffect(() => {
    supabase.from('site_settings').select('value').eq('key', 'footer_text').single().then(({ data }) => { if (data) setSiteName(data.value) })
  }, [])

  const courses = [
    { en: 'Car Driving (Auto)', bn: 'কার ড্রাইভিং (অটো)' },
    { en: 'Car Driving (Manual)', bn: 'কার ড্রাইভিং (ম্যানুয়াল)' },
    { en: 'Motorcycle Training', bn: 'মোটরসাইকেল ট্রেনিং' },
    { en: 'Professional Driving', bn: 'পেশাদার ড্রাইভিং' },
    { en: 'Refresher Course', bn: 'রিফ্রেশার কোর্স' },
    { en: 'License Assistance', bn: 'লাইসেন্স সহায়তা' },
  ]

  const resources = [
    { key: 'blog', en: 'Blog', bn: 'ব্লগ' },
    { key: 'license', en: 'License Guide', bn: 'লাইসেন্স গাইড' },
    { key: 'branches', en: 'Our Branches', bn: 'আমাদের শাখা' },
    { key: 'certificate-check', en: 'Certificate Check', bn: 'সার্টিফিকেট চেক' },
    { key: 'gallery', en: 'Gallery', bn: 'গ্যালারি' },
  ]

  return (
    <footer className="mt-auto relative overflow-hidden bg-gray-900 dark:bg-[#050A14]">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-energy" />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-12 bg-gradient-energy rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-orange-500/30">S</span>
              <span className="text-xl font-heading font-bold tracking-wide text-white">{siteName || 'Shahjalal DTC'}</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">BRTA Approved Driving Training Center (Reg No: 142/2021). Providing quality driving education since 2021 with branches in Uttara and Tongi.</p>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider text-orange-400">Our Courses</h4>
            <div className="space-y-2.5 text-sm">
              {courses.map((course, i) => (
                <p key={i} className="text-gray-400 hover:text-orange-400 transition-colors cursor-pointer">
                  {lang === 'bn' ? course.bn : course.en}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider text-orange-400">Resources</h4>
            <div className="space-y-2.5 text-sm">
              {resources.map((r) => (
                <Link key={r.key} to={`/${r.key}`} className="block text-gray-400 hover:text-orange-400 transition-colors">
                  {lang === 'bn' ? r.bn : r.en}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider text-orange-400">Contact Us</h4>
            <div className="space-y-3 text-sm text-gray-400">
              <p className="leading-relaxed">House 26, Road 12/B, Sector 10, Uttara, Dhaka-1230</p>
              <p>24/7 Helpline:</p>
              <a href="tel:01949965355" className="block text-orange-400 hover:underline font-medium">01949-965355</a>
              <a href="tel:01304345060" className="block text-orange-400 hover:underline font-medium">01304-345060</a>
              <p className="pt-2 text-gray-500">Sat-Fri: 9:00 am - 7:00 pm</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} {siteName || 'Shahjalal Driving Training Center'}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://facebook.com/ShahjalalDrivingTrainingCentre78" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://youtube.com/@shahjalaldrivingcenter78" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-orange-400 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
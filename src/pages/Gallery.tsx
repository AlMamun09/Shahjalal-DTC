import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'
import type { GalleryPhoto, GalleryVideo } from '../types'

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

export function GalleryPage() {
  const { t } = useTranslation()
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [videos, setVideos] = useState<GalleryVideo[]>([])
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [tab, setTab] = useState<'photos' | 'videos'>('photos')

  useEffect(() => {
    supabase.from('gallery_photos').select('*').order('sort_order').then(({ data }) => {
      if (data) setPhotos(data)
    })
    supabase.from('gallery_videos').select('*').order('sort_order').then(({ data }) => {
      if (data) setVideos(data)
    })
  }, [])

  const getYoutubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)
    return match?.[1] || ''
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <Section>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4 text-white">{t('gallery.title')}</h1>
        <div className="section-divider" />
      </Section>

      {(photos.length > 0 || videos.length > 0) && (
        <Section delay={80}>
          <div className="flex justify-center gap-3 mt-10 mb-10">
            {photos.length > 0 && (
              <button onClick={() => setTab('photos')}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'photos' ? 'bg-orange-500 text-white shadow-md' : 'bg-[#374151] text-gray-300 hover:bg-orange-500/20 hover:text-orange-400'}`}>
                {t('gallery.photos')} ({photos.length})
              </button>
            )}
            {videos.length > 0 && (
              <button onClick={() => setTab('videos')}
                className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === 'videos' ? 'bg-orange-500 text-white shadow-md' : 'bg-[#374151] text-gray-300 hover:bg-orange-500/20 hover:text-orange-400'}`}>
                {t('gallery.videos')} ({videos.length})
              </button>
            )}
          </div>
        </Section>
      )}

      {tab === 'photos' && photos.length > 0 && (
        <div>
          <Section delay={100}>
            <h2 className="text-2xl font-semibold mb-8 text-white">{t('gallery.photos')}</h2>
          </Section>
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {photos.map((photo, i) => (
              <Section key={photo.id} delay={i * 50}>
                <div className="break-inside-avoid cursor-pointer group relative rounded-xl overflow-hidden" onClick={() => setLightbox(photo.url)}>
                  <img src={photo.url} alt={photo.alt_text} className="w-full group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <svg className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                  </div>
                </div>
              </Section>
            ))}
          </div>
        </div>
      )}

      {tab === 'videos' && videos.length > 0 && (
        <div>
          <Section>
            <h2 className="text-2xl font-semibold mb-8 text-white">{t('gallery.videos')}</h2>
          </Section>
          <div className="grid md:grid-cols-2 gap-8">
            {videos.map((video, i) => {
              const id = getYoutubeId(video.youtube_url)
              return (
                <Section key={video.id} delay={i * 100}>
                  <div className="aspect-video rounded-xl overflow-hidden shadow-lg card-hover">
                    <iframe src={`https://www.youtube.com/embed/${id}`} title={video.title_en || video.title_bn}
                      className="w-full h-full" allowFullScreen loading="lazy" />
                  </div>
                </Section>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'photos' && photos.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No photos yet.</p>
      )}
      {tab === 'videos' && videos.length === 0 && (
        <p className="text-center text-gray-500 mt-10">No videos yet.</p>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in" onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          <img src={lightbox} alt="" className="max-w-full max-h-[90vh] object-contain rounded-xl animate-scale-in" />
        </div>
      )}
    </div>
  )
}
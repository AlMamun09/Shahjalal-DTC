import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { GalleryPhoto, GalleryVideo } from '../types'

export function GalleryPage() {
  const { t } = useTranslation()
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [videos, setVideos] = useState<GalleryVideo[]>([])
  const [lightbox, setLightbox] = useState<string | null>(null)

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
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-poppins font-bold text-center mb-10">{t('gallery.title')}</h1>

      {/* Photos */}
      {photos.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{t('gallery.photos')}</h2>
          <div className="columns-2 md:columns-3 gap-4 space-y-4">
            {photos.map(photo => (
              <div key={photo.id} className="break-inside-avoid cursor-pointer" onClick={() => setLightbox(photo.url)}>
                <img src={photo.url} alt={photo.alt_text} className="w-full rounded-xl hover:opacity-90 transition-opacity" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {videos.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-6">{t('gallery.videos')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {videos.map(video => {
              const id = getYoutubeId(video.youtube_url)
              return (
                <div key={video.id} className="aspect-video rounded-xl overflow-hidden">
                  <iframe src={`https://www.youtube.com/embed/${id}`} title={video.title_en || video.title_bn}
                    className="w-full h-full" allowFullScreen loading="lazy" />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  )
}

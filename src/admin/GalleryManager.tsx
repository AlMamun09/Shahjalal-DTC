import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { GalleryPhoto, GalleryVideo } from '../types'

export function AdminGalleryManager() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [videos, setVideos] = useState<GalleryVideo[]>([])
  const [videoForm, setVideoForm] = useState({ title_bn: '', title_en: '', youtube_url: '' })
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.from('gallery_photos').select('*').order('sort_order').then(({ data }) => {
      if (data) setPhotos(data)
    })
    supabase.from('gallery_videos').select('*').order('sort_order').then(({ data }) => {
      if (data) setVideos(data)
    })
  }, [])

  const uploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()
    const path = `gallery/${Date.now()}.${ext}`

    await supabase.storage.from('gallery').upload(path, file)
    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(path)

    await supabase.from('gallery_photos').insert({ url: publicUrl, alt_text: '' })
    if (fileRef.current) fileRef.current.value = ''

    supabase.from('gallery_photos').select('*').order('sort_order').then(({ data }) => {
      if (data) setPhotos(data)
    })
  }

  const deletePhoto = async (id: string) => {
    await supabase.from('gallery_photos').delete().eq('id', id)
    setPhotos(photos.filter(p => p.id !== id))
  }

  const addVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('gallery_videos').insert(videoForm)
    setVideoForm({ title_bn: '', title_en: '', youtube_url: '' })
    supabase.from('gallery_videos').select('*').order('sort_order').then(({ data }) => {
      if (data) setVideos(data)
    })
  }

  const deleteVideo = async (id: string) => {
    await supabase.from('gallery_videos').delete().eq('id', id)
    setVideos(videos.filter(v => v.id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-poppins font-bold mb-6">Gallery Manager</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Photos Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Photos</h2>
          <div className="mb-4">
            <input ref={fileRef} type="file" accept="image/*" onChange={uploadPhoto}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-brand-red file:text-white hover:file:bg-red-700" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {photos.map(photo => (
              <div key={photo.id} className="relative group">
                <img src={photo.url} alt={photo.alt_text} className="w-full h-24 object-cover rounded-lg" />
                <button onClick={() => deletePhoto(photo.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Videos Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">YouTube Videos</h2>
          <form onSubmit={addVideo} className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Title (Bn)" value={videoForm.title_bn} onChange={e => setVideoForm({ ...videoForm, title_bn: e.target.value })}
                className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" />
              <input placeholder="Title (En)" value={videoForm.title_en} onChange={e => setVideoForm({ ...videoForm, title_en: e.target.value })}
                className="px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
            <input placeholder="YouTube URL" required value={videoForm.youtube_url} onChange={e => setVideoForm({ ...videoForm, youtube_url: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" />
            <button type="submit" className="px-4 py-2 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700">Add Video</button>
          </form>
          <div className="space-y-2">
            {videos.map(video => (
              <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="text-sm truncate">
                  <p className="font-medium">{video.title_en || video.title_bn}</p>
                  <p className="text-gray-500 truncate">{video.youtube_url}</p>
                </div>
                <button onClick={() => deleteVideo(video.id)} className="text-red-600 hover:text-red-800 text-sm ml-2">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

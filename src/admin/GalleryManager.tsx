import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
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

  const inputCls = "w-full px-3 py-2 bg-[#374151] border border-white/[0.06] rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400"

  return (
    <div className="animate-fade-in overflow-hidden">
      <div className="flex items-start justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold text-white">Gallery Manager</h1>
        <Link to="/gallery" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.06] text-gray-300 rounded-xl text-xs sm:text-sm font-medium hover:bg-white/[0.1] hover:text-white transition-all border border-white/[0.06] shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          View Gallery
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 min-w-0">
        {/* Photos */}
        <div className="bg-[#111827] rounded-2xl sm:rounded-[20px] p-4 sm:p-6 border border-white/[0.06] shadow-xl shadow-black/20 overflow-hidden min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Photos</h2>
          <div className="mb-4">
            <input ref={fileRef} type="file" accept="image/*" onChange={uploadPhoto}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-orange-500 file:text-white hover:file:bg-orange-400" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 min-w-0">
            {photos.map(photo => (
              <div key={photo.id} className="relative group aspect-square min-w-0">
                <img src={photo.url} alt={photo.alt_text} className="w-full h-full object-cover rounded-lg" />
                <button onClick={() => deletePhoto(photo.id)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
              </div>
            ))}
          </div>
          {photos.length === 0 && <p className="text-gray-500 text-sm">No photos uploaded yet.</p>}
        </div>

        {/* Videos */}
        <div className="bg-[#111827] rounded-2xl sm:rounded-[20px] p-4 sm:p-6 border border-white/[0.06] shadow-xl shadow-black/20 overflow-hidden min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">YouTube Videos</h2>
          <form onSubmit={addVideo} className="space-y-3 mb-4 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
              <div className="min-w-0"><input placeholder="Title (Bn)" value={videoForm.title_bn} onChange={e => setVideoForm({ ...videoForm, title_bn: e.target.value })} className={inputCls} /></div>
              <div className="min-w-0"><input placeholder="Title (En)" value={videoForm.title_en} onChange={e => setVideoForm({ ...videoForm, title_en: e.target.value })} className={inputCls} /></div>
            </div>
            <input placeholder="YouTube URL" required value={videoForm.youtube_url} onChange={e => setVideoForm({ ...videoForm, youtube_url: e.target.value })} className={inputCls} />
            <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all">Add Video</button>
          </form>
          <div className="space-y-2 min-w-0">
            {videos.map(video => (
              <div key={video.id} className="flex items-center gap-2 p-3 bg-[#374151] rounded-lg min-w-0">
                <div className="text-sm flex-1 min-w-0">
                  <p className="font-medium text-white text-xs sm:text-sm truncate">{video.title_en || video.title_bn}</p>
                  <p className="text-gray-400 text-xs truncate">{video.youtube_url}</p>
                </div>
                <button onClick={() => deleteVideo(video.id)} className="text-red-400 hover:text-red-300 text-xs font-medium shrink-0 px-2 py-1 rounded bg-red-500/10">Delete</button>
              </div>
            ))}
            {videos.length === 0 && <p className="text-gray-500 text-sm">No videos added yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

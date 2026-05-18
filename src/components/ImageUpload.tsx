import { useState, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { cn } from '@/lib/utils'

interface Props {
  value: string
  onChange: (url: string) => void
  folder?: string
  className?: string
}

export function ImageUpload({ value, onChange, folder = 'gallery', className }: Props) {
  const ref = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('gallery').upload(path, file)
    if (error) { alert('Upload failed: ' + error.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(path)
    onChange(publicUrl)
    setUploading(false)
  }

  return (
    <div className={cn('flex flex-wrap gap-3 items-start min-w-0', className)}>
      <input ref={ref} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
        className="shrink-0 px-4 py-2 bg-white/[0.06] text-gray-300 rounded-xl text-sm font-medium hover:bg-white/[0.1] hover:text-white transition-all disabled:opacity-50 border border-white/[0.06]"
      >
        {uploading ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Uploading
          </span>
        ) : 'Choose Image'}
      </button>
      {value && (
        <div className="relative shrink-0">
          <img src={value} alt="" className="w-20 h-16 object-cover rounded-xl border border-white/[0.06]" />
          <button type="button" onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600 transition-colors">✕</button>
        </div>
      )}
    </div>
  )
}
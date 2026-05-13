import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { PageSEO } from '../types'

const PAGE_KEYS = ['home', 'courses', 'about', 'gallery', 'contact']

export function AdminSeoManager() {
  const [pages, setPages] = useState<PageSEO[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.from('page_seo').select('*').then(({ data }) => {
      if (data) setPages(data)
    })
  }, [])

  const update = (page_key: string, field: string, value: string) => {
    setPages(pages.map(p => p.page_key === page_key ? { ...p, [field]: value } : p))
  }

  const save = async () => {
    setMessage('')
    for (const page of pages) {
      await supabase.from('page_seo').upsert(
        { page_key: page.page_key, meta_title: page.meta_title, meta_desc: page.meta_desc, og_image_url: page.og_image_url },
        { onConflict: 'page_key' }
      )
    }
    setMessage('SEO settings saved!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-poppins font-bold">SEO Manager</h1>
        <button onClick={save} className="px-4 py-2 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700">Save All</button>
      </div>

      {message && <p className="text-green-600 font-medium mb-4">{message}</p>}

      <div className="space-y-6">
        {PAGE_KEYS.map(key => {
          const page = pages.find(p => p.page_key === key)
          return (
            <div key={key} className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold capitalize mb-4">{key} Page</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Meta Title</label>
                  <input value={page?.meta_title || ''} onChange={e => update(key, 'meta_title', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Meta Description</label>
                  <textarea value={page?.meta_desc || ''} onChange={e => update(key, 'meta_desc', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" rows={2} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">OG Image URL</label>
                  <input value={page?.og_image_url || ''} onChange={e => update(key, 'og_image_url', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Testimonial } from '../types'

export function AdminTestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', rating: 5, text_bn: '', text_en: '' })

  useEffect(() => {
    supabase.from('testimonials').select('*').order('sort_order').then(({ data }) => {
      if (data) setTestimonials(data)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('testimonials').insert(form)
    setForm({ name: '', rating: 5, text_bn: '', text_en: '' })
    setShowForm(false)
    supabase.from('testimonials').select('*').order('sort_order').then(({ data }) => {
      if (data) setTestimonials(data)
    })
  }

  const toggleVisible = async (id: string, is_visible: boolean) => {
    await supabase.from('testimonials').update({ is_visible: !is_visible }).eq('id', id)
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, is_visible: !is_visible } : t))
  }

  const deleteTestimonial = async (id: string) => {
    await supabase.from('testimonials').delete().eq('id', id)
    setTestimonials(testimonials.filter(t => t.id !== id))
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold text-white">Testimonials</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl text-xs sm:text-sm font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all shrink-0">
          {showForm ? 'Cancel' : 'Add Testimonial'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#111827] rounded-xl p-6 shadow-sm border border-white/[0.06] mb-6 max-w-2xl space-y-4">
          <div><label className="block text-sm font-medium text-gray-300">Name</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-[#374151] border border-white/[0.06] rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
          <div><label className="block text-sm font-medium text-gray-300">Rating (1-5)</label>
            <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-[#374151] border border-white/[0.06] rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white">
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium text-gray-300">Text (Bangla)</label>
            <textarea value={form.text_bn} onChange={e => setForm({ ...form, text_bn: e.target.value })}
              className="w-full px-3 py-2 bg-[#374151] border border-white/[0.06] rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" rows={2} /></div>
          <div><label className="block text-sm font-medium text-gray-300">Text (English)</label>
            <textarea value={form.text_en} onChange={e => setForm({ ...form, text_en: e.target.value })}
              className="w-full px-3 py-2 bg-[#374151] border border-white/[0.06] rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" rows={2} /></div>
          <button type="submit" className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/30">Add</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.map(t => (
          <div key={t.id} className="bg-[#111827] rounded-xl p-5 border border-white/[0.06] flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-semibold text-white">{t.name}</span>
                <span className="text-orange-400">{'★'.repeat(t.rating)}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  t.is_visible ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'
                }`}>{t.is_visible ? 'Visible' : 'Hidden'}</span>
              </div>
              <p className="text-sm text-gray-400 line-clamp-2">{t.text_en || t.text_bn}</p>
            </div>
            <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
              <button onClick={() => toggleVisible(t.id, t.is_visible)} className="flex-1 sm:flex-none px-3 py-1.5 bg-white/[0.04] text-gray-400 rounded-xl text-xs font-medium hover:bg-white/[0.08] transition-all text-center">
                {t.is_visible ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => deleteTestimonial(t.id)} className="flex-1 sm:flex-none px-3 py-1.5 bg-red-500/10 text-red-400 rounded-xl text-xs font-medium hover:bg-red-500/20 transition-all text-center">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
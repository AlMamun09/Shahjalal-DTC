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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-poppins font-bold">Testimonials</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700">
          {showForm ? 'Cancel' : 'Add Testimonial'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 max-w-2xl space-y-4">
          <div><label className="block text-sm font-medium">Name</label>
            <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" /></div>
          <div><label className="block text-sm font-medium">Rating (1-5)</label>
            <select value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg outline-none">
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
            </select></div>
          <div><label className="block text-sm font-medium">Text (Bangla)</label>
            <textarea value={form.text_bn} onChange={e => setForm({ ...form, text_bn: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" rows={2} /></div>
          <div><label className="block text-sm font-medium">Text (English)</label>
            <textarea value={form.text_en} onChange={e => setForm({ ...form, text_en: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" rows={2} /></div>
          <button type="submit" className="px-6 py-2 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700">Add</button>
        </form>
      )}

      <div className="space-y-4">
        {testimonials.map(t => (
          <div key={t.id} className="bg-white rounded-xl p-4 shadow-sm flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{t.name}</span>
                <span className="text-brand-gold">{'★'.repeat(t.rating)}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  t.is_visible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>{t.is_visible ? 'Visible' : 'Hidden'}</span>
              </div>
              <p className="text-sm text-gray-600">{t.text_en || t.text_bn}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleVisible(t.id, t.is_visible)} className="text-sm text-brand-red hover:underline">
                {t.is_visible ? 'Hide' : 'Show'}
              </button>
              <button onClick={() => deleteTestimonial(t.id)} className="text-sm text-red-600 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

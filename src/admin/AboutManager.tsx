import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ImageUpload } from '../components/ImageUpload'
import type { Instructor } from '../types'

export function AdminAboutManager() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name_bn: '', name_en: '', experience: '', specialization: '', photo_url: '' })

  useEffect(() => {
    supabase.from('instructors').select('*').order('sort_order').then(({ data }) => {
      if (data) setInstructors(data)
    })
  }, [])

  const openEdit = (i: Instructor) => {
    setForm({ name_bn: i.name_bn, name_en: i.name_en, experience: i.experience, specialization: i.specialization, photo_url: i.photo_url || '' })
    setEditingId(i.id)
  }

  const resetForm = () => {
    setForm({ name_bn: '', name_en: '', experience: '', specialization: '', photo_url: '' })
    setEditingId(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      await supabase.from('instructors').update(form).eq('id', editingId)
    } else {
      await supabase.from('instructors').insert(form)
    }
    resetForm()
    supabase.from('instructors').select('*').order('sort_order').then(({ data }) => {
      if (data) setInstructors(data)
    })
  }

  const deleteInstructor = async (id: string) => {
    if (!confirm('Delete this instructor?')) return
    await supabase.from('instructors').delete().eq('id', id)
    setInstructors(instructors.filter(i => i.id !== id))
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div><h1 className="text-2xl font-bold text-white">Instructors</h1><p className="text-sm text-gray-400 mt-1">Manage instructor profiles</p></div>
        <Link to="/about" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.06] text-gray-300 rounded-xl text-xs sm:text-sm font-medium hover:bg-white/[0.1] hover:text-white transition-all border border-white/[0.06]"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          View About Page
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] rounded-[20px] p-6 border border-white/[0.06] shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-white mb-4">{editingId ? 'Edit Instructor' : 'Add Instructor'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-gray-300">Name (Bn)</label>
                <input required value={form.name_bn} onChange={e => setForm({ ...form, name_bn: e.target.value })}
                  className="w-full px-3 py-2 bg-[#374151] border border-white/[0.06] rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
              <div><label className="block text-sm font-medium text-gray-300">Name (En)</label>
                <input required value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })}
                  className="w-full px-3 py-2 bg-[#374151] border border-white/[0.06] rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
            </div>
            <div><label className="block text-sm font-medium text-gray-300">Experience</label>
              <input value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
                className="w-full px-3 py-2 bg-[#374151] border border-white/[0.06] rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
            <div><label className="block text-sm font-medium text-gray-300">Specialization</label>
              <input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })}
                className="w-full px-3 py-2 bg-[#374151] border border-white/[0.06] rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
            <div><label className="block text-sm font-medium text-gray-300 mb-1">Photo</label>
              <ImageUpload value={form.photo_url} onChange={url => setForm({ ...form, photo_url: url })} folder="instructors" /></div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-orange-500/30">
                {editingId ? 'Update Instructor' : 'Add Instructor'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="px-4 py-2 bg-white/[0.06] text-gray-300 rounded-xl hover:bg-white/[0.1] transition-all">Cancel</button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-[#111827] rounded-[20px] p-6 border border-white/[0.06] shadow-xl shadow-black/20">
          <h2 className="text-lg font-semibold text-white mb-4">Current Instructors ({instructors.length})</h2>
          <div className="space-y-3">
            {instructors.map(instructor => (
              <div key={instructor.id} className="flex items-center gap-3 p-3 bg-[#374151] rounded-xl">
                {instructor.photo_url ? (
                  <img src={instructor.photo_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/[0.06]" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 text-sm font-bold shrink-0">
                    {instructor.name_en.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{instructor.name_en || instructor.name_bn}</p>
                  <p className="text-sm text-gray-400 truncate">{instructor.experience} · {instructor.specialization}</p>
                </div>
              <div className="flex sm:flex-col gap-1.5 sm:gap-1">
                <button onClick={() => openEdit(instructor)} className="flex-1 sm:flex-none px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded-xl text-xs font-medium hover:bg-orange-500/20 transition-all text-center">Edit</button>
                <button onClick={() => deleteInstructor(instructor.id)} className="flex-1 sm:flex-none px-3 py-1.5 bg-red-500/10 text-red-400 rounded-xl text-xs font-medium hover:bg-red-500/20 transition-all text-center">Delete</button>
              </div>
              </div>
            ))}
            {instructors.length === 0 && <p className="text-gray-500 text-sm">No instructors yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
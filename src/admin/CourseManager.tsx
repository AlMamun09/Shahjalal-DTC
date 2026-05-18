import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { ImageUpload } from '../components/ImageUpload'
import type { Course } from '../types'

interface CourseForm {
  slug: string; name_bn: string; name_en: string; category: Course['category']
  duration_bn: string; duration_en: string; fee: string
  description_bn: string; description_en: string; icon: string
  price_bdt: number; practical_classes: number; auto_classes: number; theory_classes: number
  is_active: boolean; sort_order: number; image_url: string
}

const emptyForm: CourseForm = {
  slug: '', name_bn: '', name_en: '', category: 'car',
  duration_bn: '', duration_en: '', fee: '',
  description_bn: '', description_en: '', icon: '',
  price_bdt: 0, practical_classes: 0, auto_classes: 0, theory_classes: 0,
  is_active: true, sort_order: 0, image_url: '',
}

export function AdminCourseManager() {
  const [courses, setCourses] = useState<Course[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CourseForm>(emptyForm)

  useEffect(() => { loadCourses() }, [])

  function loadCourses() {
    supabase.from('courses').select('*').order('sort_order').then(({ data }) => { if (data) setCourses(data) })
  }

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true) }
  const openEdit = (c: Course) => {
    setForm({
      slug: c.slug, name_bn: c.name_bn, name_en: c.name_en, category: c.category,
      duration_bn: c.duration_bn, duration_en: c.duration_en, fee: c.fee,
      description_bn: c.description_bn, description_en: c.description_en, icon: c.icon,
      price_bdt: c.price_bdt || 0, practical_classes: c.practical_classes || 0,
      auto_classes: c.auto_classes || 0, theory_classes: c.theory_classes || 0,
      is_active: c.is_active, sort_order: c.sort_order, image_url: c.image_url || '',
    })
    setEditingId(c.id)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = form.slug || form.name_en.toLowerCase().replace(/\s+/g, '-')
    const data = { ...form, slug }

    if (editingId) {
      await supabase.from('courses').update(data).eq('id', editingId)
    } else {
      const { error } = await supabase.from('courses').insert(data)
      if (error && error.message.includes('duplicate')) {
        alert('A course with this slug already exists. Change the name or slug.')
        return
      }
    }
    setShowForm(false); setEditingId(null); setForm(emptyForm)
    loadCourses()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('courses').update({ is_active: !current }).eq('id', id)
    loadCourses()
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this course permanently?')) return
    await supabase.from('courses').delete().eq('id', id)
    loadCourses()
  }

  const moveOrder = async (id: string, dir: 'up' | 'down') => {
    const sorted = [...courses].sort((a, b) => a.sort_order - b.sort_order)
    const idx = sorted.findIndex(c => c.id === id)
    if (dir === 'up' && idx > 0) {
      await supabase.from('courses').update({ sort_order: sorted[idx - 1].sort_order }).eq('id', id)
      await supabase.from('courses').update({ sort_order: sorted[idx].sort_order }).eq('id', sorted[idx - 1].id)
    }
    if (dir === 'down' && idx < sorted.length - 1) {
      await supabase.from('courses').update({ sort_order: sorted[idx + 1].sort_order }).eq('id', id)
      await supabase.from('courses').update({ sort_order: sorted[idx].sort_order }).eq('id', sorted[idx + 1].id)
    }
    loadCourses()
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between mb-6 gap-3">
        <div className="min-w-0"><h1 className="text-2xl font-bold text-white">Course Manager</h1><p className="text-sm text-gray-400 mt-1">Add, edit, reorder, or delete courses</p></div>
        <div className="flex flex-col gap-2 shrink-0">
          <Link to="/courses" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white/[0.06] text-gray-300 rounded-xl text-xs sm:text-sm font-medium hover:bg-white/[0.1] hover:text-white transition-all border border-white/[0.06]"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            View Courses
          </Link>
          <button onClick={openNew} className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl text-xs sm:text-sm font-medium transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Course
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 pt-12 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-[#111827] rounded-2xl p-4 sm:p-6 w-full max-w-3xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto border border-white/[0.06]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Course' : 'Add Course'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-orange-500/10 rounded-xl transition-colors text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Name (Bn)</label>
                  <input required value={form.name_bn} onChange={e => setForm({ ...form, name_bn: e.target.value })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Name (En)</label>
                  <input required value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Slug (leave blank for auto)</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Course['category'] })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none text-white">
                    {['car', 'motorcycle', 'professional', 'refresher', 'license'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Price (BDT)</label>
                  <input type="number" value={form.price_bdt} onChange={e => setForm({ ...form, price_bdt: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Practical</label>
                  <input type="number" value={form.practical_classes} onChange={e => setForm({ ...form, practical_classes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Auto Classes</label>
                  <input type="number" value={form.auto_classes} onChange={e => setForm({ ...form, auto_classes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Theory</label>
                  <input type="number" value={form.theory_classes} onChange={e => setForm({ ...form, theory_classes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Duration (Bn)</label>
                  <input value={form.duration_bn} onChange={e => setForm({ ...form, duration_bn: e.target.value })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Duration (En)</label>
                  <input value={form.duration_en} onChange={e => setForm({ ...form, duration_en: e.target.value })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400" /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Fee (text)</label>
                  <input value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400" /></div>
                <div><label className="block text-sm font-medium text-gray-300 mb-1">Icon (emoji)</label>
                  <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Description (Bn)</label>
                <textarea value={form.description_bn} onChange={e => setForm({ ...form, description_bn: e.target.value })} rows={2}
                  className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400" /></div>
              <div><label className="block text-sm font-medium text-gray-300 mb-1">Description (En)</label>
                <textarea value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} rows={2}
                  className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400" /></div>

              <div><label className="block text-sm font-medium text-gray-300 mb-1">Course Image</label>
                <ImageUpload value={form.image_url} onChange={url => setForm({ ...form, image_url: url })} folder="courses" /></div>

              <div className="flex items-center gap-6 pt-4 border-t border-orange-500/10">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-300">Active</span>
                </label>
                <label className="flex items-center gap-2 text-gray-300">
                  <span className="text-sm">Sort Order:</span>
                  <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="w-20 px-3 py-1.5 bg-[#374151] border border-orange-500/10 rounded-xl outline-none text-sm text-white" />
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5">
                  {editingId ? 'Update Course' : 'Create Course'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="w-full sm:w-auto px-6 py-2.5 bg-[#374151] text-gray-300 rounded-xl font-medium hover:bg-orange-500/10 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...courses].sort((a, b) => a.sort_order - b.sort_order).map((course, i) => (
          <div key={course.id} className="bg-[#111827] rounded-[20px] border border-white/[0.06] shadow-xl shadow-black/20 p-4 transition-all hover:shadow-orange-500/10">
            {course.image_url ? (
              <div className="relative h-32 rounded-[16px] overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent mb-4">
                <img src={course.image_url} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="h-32 rounded-[16px] mb-4 bg-[#374151] flex items-center justify-center text-4xl opacity-40">{course.icon || '🚗'}</div>
            )}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{course.icon || '🚗'}</span>
                <div>
                  <h3 className="font-semibold text-sm text-white">{course.name_en}</h3>
                  <p className="text-xs text-gray-500">{course.name_bn}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${course.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                {course.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            {course.price_bdt && <p className="text-lg font-bold text-orange-400 mb-2">৳{course.price_bdt.toLocaleString()}</p>}
            <p className="text-xs text-gray-400 mb-3 line-clamp-2">{course.description_en}</p>
            <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
              <button onClick={() => openEdit(course)} className="w-full sm:w-auto px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded-xl text-xs font-medium hover:bg-orange-500/20 transition-all">Edit</button>
              <button onClick={() => toggleActive(course.id, course.is_active)} className="w-full sm:w-auto px-3 py-1.5 bg-white/[0.04] text-gray-400 rounded-xl text-xs font-medium hover:bg-white/[0.08] transition-all">{course.is_active ? 'Deactivate' : 'Activate'}</button>
              <div className="flex gap-1.5">
                <button onClick={() => moveOrder(course.id, 'up')} disabled={i === 0} className="flex-1 sm:flex-none px-2 py-1.5 bg-white/[0.04] text-gray-400 rounded-xl text-xs hover:bg-white/[0.08] disabled:opacity-30 transition-all">↑</button>
                <button onClick={() => moveOrder(course.id, 'down')} disabled={i === courses.length - 1} className="flex-1 sm:flex-none px-2 py-1.5 bg-white/[0.04] text-gray-400 rounded-xl text-xs hover:bg-white/[0.08] disabled:opacity-30 transition-all">↓</button>
                <button onClick={() => remove(course.id)} className="flex-1 sm:flex-none px-2 py-1.5 bg-red-500/10 text-red-400 rounded-xl text-xs hover:bg-red-500/20 transition-all">🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {courses.length === 0 && <p className="text-center text-gray-500 py-12">No courses yet. Click "Add Course" to create one.</p>}
    </div>
  )
}
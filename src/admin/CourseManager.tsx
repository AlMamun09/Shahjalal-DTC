import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Course } from '../types'

interface CourseForm {
  slug: string; name_bn: string; name_en: string; category: Course['category']
  duration_bn: string; duration_en: string; fee: string
  description_bn: string; description_en: string; icon: string
  price_bdt: number; practical_classes: number; auto_classes: number; theory_classes: number
  is_active: boolean; sort_order: number
}

const emptyForm: CourseForm = {
  slug: '', name_bn: '', name_en: '', category: 'car',
  duration_bn: '', duration_en: '', fee: '',
  description_bn: '', description_en: '', icon: '',
  price_bdt: 0, practical_classes: 0, auto_classes: 0, theory_classes: 0,
  is_active: true, sort_order: 0,
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
      is_active: c.is_active, sort_order: c.sort_order,
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
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-inter font-bold text-gray-900">Course Manager</h1><p className="text-sm text-gray-500 mt-1">Add, edit, reorder, or delete courses</p></div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-red to-brand-red-light text-white rounded-xl font-medium transition-all shadow-lg shadow-brand-red/25 hover:shadow-xl hover:-translate-y-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Course
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 pt-12 overflow-y-auto" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-inter font-bold">{editingId ? 'Edit Course' : 'Add Course'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Name (Bn)</label>
                  <input required value={form.name_bn} onChange={e => setForm({ ...form, name_bn: e.target.value })} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-red" /></div>
                <div><label className="block text-sm font-medium mb-1">Name (En)</label>
                  <input required value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-red" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Slug (leave blank for auto)</label>
                  <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-red" /></div>
                <div><label className="block text-sm font-medium mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Course['category'] })} className="w-full px-3 py-2 border rounded-xl outline-none">
                    {['car', 'motorcycle', 'professional', 'refresher', 'license'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div><label className="block text-sm font-medium mb-1">Price (BDT)</label>
                  <input type="number" value={form.price_bdt} onChange={e => setForm({ ...form, price_bdt: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-red" /></div>
                <div><label className="block text-sm font-medium mb-1">Practical</label>
                  <input type="number" value={form.practical_classes} onChange={e => setForm({ ...form, practical_classes: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-red" /></div>
                <div><label className="block text-sm font-medium mb-1">Auto Classes</label>
                  <input type="number" value={form.auto_classes} onChange={e => setForm({ ...form, auto_classes: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-red" /></div>
                <div><label className="block text-sm font-medium mb-1">Theory</label>
                  <input type="number" value={form.theory_classes} onChange={e => setForm({ ...form, theory_classes: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-red" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Duration (Bn)</label>
                  <input value={form.duration_bn} onChange={e => setForm({ ...form, duration_bn: e.target.value })} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-red" /></div>
                <div><label className="block text-sm font-medium mb-1">Duration (En)</label>
                  <input value={form.duration_en} onChange={e => setForm({ ...form, duration_en: e.target.value })} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-red" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium mb-1">Fee (text)</label>
                  <input value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-red" /></div>
                <div><label className="block text-sm font-medium mb-1">Icon (emoji)</label>
                  <input value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-red" /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1">Description (Bn)</label>
                <textarea value={form.description_bn} onChange={e => setForm({ ...form, description_bn: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-red" /></div>
              <div><label className="block text-sm font-medium mb-1">Description (En)</label>
                <textarea value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-brand-red" /></div>

              <div className="flex items-center gap-6 pt-4 border-t">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded" />
                  <span className="text-sm">Active</span>
                </label>
                <label className="flex items-center gap-2">
                  <span className="text-sm">Sort Order:</span>
                  <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: Number(e.target.value) })}
                    className="w-20 px-3 py-1.5 border rounded-xl outline-none text-sm" />
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-brand-red to-brand-red-light text-white rounded-xl font-medium transition-all shadow-lg shadow-brand-red/25 hover:shadow-xl hover:-translate-y-0.5">
                  {editingId ? 'Update Course' : 'Create Course'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...courses].sort((a, b) => a.sort_order - b.sort_order).map((course, i) => (
          <div key={course.id} className={`bg-white rounded-2xl p-5 shadow-sm border transition-all hover:shadow-md ${course.is_active ? 'border-gray-100' : 'border-gray-200 bg-gray-50/50'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{course.icon || '🚗'}</span>
                <div>
                  <h3 className="font-semibold text-sm">{course.name_en}</h3>
                  <p className="text-xs text-gray-400">{course.name_bn}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${course.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {course.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            {course.price_bdt && <p className="text-lg font-bold text-brand-red mb-2">৳{course.price_bdt.toLocaleString()}</p>}
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{course.description_en}</p>
            <div className="flex gap-2">
              <button onClick={() => openEdit(course)} className="flex-1 px-3 py-1.5 bg-brand-red/10 text-brand-red rounded-xl text-xs font-medium hover:bg-brand-red/20 transition-all">Edit</button>
              <button onClick={() => toggleActive(course.id, course.is_active)} className="px-3 py-1.5 bg-gray-100 rounded-xl text-xs font-medium hover:bg-gray-200 transition-all">{course.is_active ? 'Deactivate' : 'Activate'}</button>
              <button onClick={() => moveOrder(course.id, 'up')} disabled={i === 0} className="px-2 py-1.5 bg-gray-100 rounded-xl text-xs hover:bg-gray-200 disabled:opacity-30 transition-all">↑</button>
              <button onClick={() => moveOrder(course.id, 'down')} disabled={i === courses.length - 1} className="px-2 py-1.5 bg-gray-100 rounded-xl text-xs hover:bg-gray-200 disabled:opacity-30 transition-all">↓</button>
              <button onClick={() => remove(course.id)} className="px-2 py-1.5 bg-red-50 text-red-600 rounded-xl text-xs hover:bg-red-100 transition-all">🗑</button>
            </div>
          </div>
        ))}
      </div>
      {courses.length === 0 && <p className="text-center text-gray-400 py-12">No courses yet. Click "Add Course" to create one.</p>}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Course } from '../types'

const emptyCourse = {
  slug: '', name_bn: '', name_en: '', category: 'car' as const,
  duration_bn: '', duration_en: '', fee: '',
  description_bn: '', description_en: '', icon: '', is_active: true, sort_order: 0,
}

export function AdminCourseManager() {
  const [courses, setCourses] = useState<Course[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Omit<Course, 'id' | 'created_at'>>(emptyCourse)

  useEffect(() => {
    supabase.from('courses').select('*').order('sort_order').then(({ data }) => {
      if (data) setCourses(data)
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = form.slug || form.name_en.toLowerCase().replace(/\s+/g, '-')
    await supabase.from('courses').insert({ ...form, slug })
    setForm(emptyCourse)
    setShowForm(false)
    supabase.from('courses').select('*').order('sort_order').then(({ data }) => {
      if (data) setCourses(data)
    })
  }

  const deleteCourse = async (id: string) => {
    await supabase.from('courses').update({ is_active: false }).eq('id', id)
    setCourses(courses.filter(c => c.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-poppins font-bold">Course Manager</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700">
          {showForm ? 'Cancel' : 'Add Course'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm mb-6 space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium">Name (Bn)</label>
              <input required value={form.name_bn} onChange={e => setForm({ ...form, name_bn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" /></div>
            <div><label className="block text-sm font-medium">Name (En)</label>
              <input required value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="block text-sm font-medium">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Course['category'] })}
                className="w-full px-3 py-2 border rounded-lg outline-none">
                <option value="car">Car</option><option value="motorcycle">Motorcycle</option>
                <option value="professional">Professional</option><option value="refresher">Refresher</option>
                <option value="license">License</option>
              </select></div>
            <div><label className="block text-sm font-medium">Duration (Bn)</label>
              <input value={form.duration_bn} onChange={e => setForm({ ...form, duration_bn: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" /></div>
            <div><label className="block text-sm font-medium">Fee</label>
              <input value={form.fee} onChange={e => setForm({ ...form, fee: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" /></div>
          </div>
          <div><label className="block text-sm font-medium">Description (Bn)</label>
            <textarea value={form.description_bn} onChange={e => setForm({ ...form, description_bn: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" rows={2} /></div>
          <div><label className="block text-sm font-medium">Description (En)</label>
            <textarea value={form.description_en} onChange={e => setForm({ ...form, description_en: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" rows={2} /></div>
          <button type="submit" className="px-6 py-2 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700">Add Course</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map(course => (
          <div key={course.id} className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold">{course.name_en}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                course.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>{course.is_active ? 'Active' : 'Inactive'}</span>
            </div>
            <p className="text-sm text-gray-500 mb-1">{course.category} · {course.duration_en} · {course.fee}</p>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description_en}</p>
            <button onClick={() => deleteCourse(course.id)} className="text-sm text-red-600 hover:underline">Soft Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

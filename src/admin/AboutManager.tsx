import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Instructor } from '../types'

export function AdminAboutManager() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [form, setForm] = useState({ name_bn: '', name_en: '', experience: '', specialization: '', photo_url: '' })

  useEffect(() => {
    supabase.from('instructors').select('*').order('sort_order').then(({ data }) => {
      if (data) setInstructors(data)
    })
  }, [])

  const addInstructor = async (e: React.FormEvent) => {
    e.preventDefault()
    await supabase.from('instructors').insert(form)
    setForm({ name_bn: '', name_en: '', experience: '', specialization: '', photo_url: '' })
    supabase.from('instructors').select('*').order('sort_order').then(({ data }) => {
      if (data) setInstructors(data)
    })
  }

  const deleteInstructor = async (id: string) => {
    await supabase.from('instructors').delete().eq('id', id)
    setInstructors(instructors.filter(i => i.id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-poppins font-bold mb-6">About & Instructors</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Add Instructor</h2>
          <form onSubmit={addInstructor} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium">Name (Bn)</label>
                <input required value={form.name_bn} onChange={e => setForm({ ...form, name_bn: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" /></div>
              <div><label className="block text-sm font-medium">Name (En)</label>
                <input required value={form.name_en} onChange={e => setForm({ ...form, name_en: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" /></div>
            </div>
            <div><label className="block text-sm font-medium">Experience</label>
              <input value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" /></div>
            <div><label className="block text-sm font-medium">Specialization</label>
              <input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" /></div>
            <button type="submit" className="px-4 py-2 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700">Add Instructor</button>
          </form>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Current Instructors</h2>
          <div className="space-y-3">
            {instructors.map(instructor => (
              <div key={instructor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{instructor.name_en || instructor.name_bn}</p>
                  <p className="text-sm text-gray-500">{instructor.experience} · {instructor.specialization}</p>
                </div>
                <button onClick={() => deleteInstructor(instructor.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </div>
            ))}
            {instructors.length === 0 && <p className="text-gray-500 text-sm">No instructors yet.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

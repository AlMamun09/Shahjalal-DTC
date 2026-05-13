import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Lead } from '../types'

const STATUSES = ['new', 'contacted', 'enrolled', 'closed']

export function AdminLeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => { loadLeads() }, [statusFilter])

  async function loadLeads() {
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (statusFilter) query = query.eq('status', statusFilter)
    const { data } = await query
    if (data) setLeads(data)
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('leads').update({ status }).eq('id', id)
    loadLeads()
  }

  const viewDetails = (lead: Lead) => {
    setSelected(lead)
    setNotes(lead.admin_notes || '')
  }

  const saveNotes = async () => {
    if (!selected) return
    await supabase.from('leads').update({ admin_notes: notes }).eq('id', selected.id)
    setSelected(null)
    loadLeads()
  }

  const exportCSV = () => {
    const headers = ['Date', 'Name', 'Phone', 'Email', 'Branch', 'Course', 'Message', 'Status']
    const rows = leads.map(l => [
      new Date(l.created_at).toLocaleDateString(), l.name, l.phone,
      l.email || '', l.branch_pref || '', l.course_interest || '',
      l.message || '', l.status
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'leads.csv'; a.click()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-poppins font-bold">Lead Manager</h1>
        <div className="flex gap-3">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg outline-none">
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button onClick={exportCSV} className="px-4 py-2 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700">Export CSV</button>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Lead Details</h2>
            <div className="space-y-2 text-sm mb-4">
              <p><strong>Name:</strong> {selected.name}</p>
              <p><strong>Phone:</strong> {selected.phone}</p>
              <p><strong>Email:</strong> {selected.email || 'N/A'}</p>
              <p><strong>Branch:</strong> {selected.branch_pref || 'N/A'}</p>
              <p><strong>Course:</strong> {selected.course_interest || 'N/A'}</p>
              <p><strong>Message:</strong> {selected.message || 'N/A'}</p>
              <p><strong>Date:</strong> {new Date(selected.created_at).toLocaleString()}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Admin Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-brand-red" rows={3} />
            </div>
            <div className="flex gap-2">
              <button onClick={saveNotes} className="px-4 py-2 bg-brand-red text-white rounded-lg font-medium">Save Notes</button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 bg-gray-100 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {['Date', 'Name', 'Phone', 'Email', 'Branch', 'Course', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-inter font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{new Date(lead.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-medium">{lead.name}</td>
                <td className="px-4 py-3">{lead.phone}</td>
                <td className="px-4 py-3 text-gray-500">{lead.email || '-'}</td>
                <td className="px-4 py-3">{lead.branch_pref || '-'}</td>
                <td className="px-4 py-3">{lead.course_interest || '-'}</td>
                <td className="px-4 py-3">
                  <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium border ${
                      lead.status === 'new' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      lead.status === 'contacted' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      lead.status === 'enrolled' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    }`}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => viewDetails(lead)} className="text-brand-red hover:underline text-xs">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

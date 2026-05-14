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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold text-white">Lead Manager</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-[#374151] border border-white/[0.06] rounded-xl outline-none text-white text-sm focus:ring-2 focus:ring-orange-500">
            <option value="">All Status</option>
            {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button onClick={exportCSV} className="w-full sm:w-auto px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl text-xs sm:text-sm font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all">Export CSV</button>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-[#111827] rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto border border-white/[0.06]" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white mb-4">Lead Details</h2>
            <div className="space-y-2 text-sm text-gray-300 mb-4">
              <p><strong className="text-white">Name:</strong> {selected.name}</p>
              <p><strong className="text-white">Phone:</strong> {selected.phone}</p>
              <p><strong className="text-white">Email:</strong> {selected.email || 'N/A'}</p>
              <p><strong className="text-white">Branch:</strong> {selected.branch_pref || 'N/A'}</p>
              <p><strong className="text-white">Course:</strong> {selected.course_interest || 'N/A'}</p>
              <p><strong className="text-white">Message:</strong> {selected.message || 'N/A'}</p>
              <p><strong className="text-white">Date:</strong> {new Date(selected.created_at).toLocaleString()}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-1">Admin Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" rows={3} />
            </div>
            <div className="flex gap-2">
              <button onClick={saveNotes} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-medium">Save Notes</button>
              <button onClick={() => setSelected(null)} className="px-4 py-2 bg-[#374151] text-gray-300 rounded-lg">Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#1F2937] rounded-xl shadow-sm border border-white/[0.06] overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#374151]">
            <tr>
              {['Date', 'Name', 'Phone', 'Email', 'Branch', 'Course', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-3 py-3 font-medium text-gray-400 text-xs whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id} className="border-t border-white/[0.06] hover:bg-white/[0.02]">
                <td className="px-3 py-3 text-gray-300 text-xs whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-3 font-medium text-white text-sm whitespace-nowrap">{lead.name}</td>
                <td className="px-3 py-3 text-gray-300 text-xs whitespace-nowrap">{lead.phone}</td>
                <td className="px-3 py-3 text-gray-400 text-xs max-w-[120px] truncate">{lead.email || '-'}</td>
                <td className="px-3 py-3 text-gray-300 text-xs whitespace-nowrap">{lead.branch_pref || '-'}</td>
                <td className="px-3 py-3 text-gray-300 text-xs max-w-[100px] truncate">{lead.course_interest || '-'}</td>
                <td className="px-3 py-3">
                  <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}
                    className={`px-2 py-1 rounded-lg text-xs font-medium border outline-none focus:ring-2 focus:ring-orange-500 ${
                      lead.status === 'new' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      lead.status === 'contacted' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      lead.status === 'enrolled' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                    {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3">
                  <button onClick={() => viewDetails(lead)} className="text-orange-400 hover:underline text-xs font-medium">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
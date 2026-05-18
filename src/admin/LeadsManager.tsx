import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Lead } from '../types'

const STATUSES = ['new', 'contacted', 'enrolled', 'closed']

export function AdminLeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState<Lead | null>(null)
  const [notes, setNotes] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => { loadLeads() }, [statusFilter])
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
      <div className="flex items-start justify-between mb-6 gap-3">
        <div className="min-w-0"><h1 className="text-2xl font-bold text-white">Lead Manager</h1><p className="text-sm text-gray-400 mt-1">Manage and track student leads</p></div>
        <div className="flex flex-col gap-2 shrink-0">
          <button onClick={exportCSV} className="px-3 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl text-xs sm:text-sm font-medium hover:shadow-lg hover:shadow-orange-500/30 transition-all">Export CSV</button>
          <div ref={dropdownRef} className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between gap-2 w-[140px] px-3 py-2 bg-[#111827] border border-white/[0.08] rounded-xl text-sm text-white shadow-lg shadow-black/20 hover:border-orange-500/30 transition-all">
              <span className="truncate">{statusFilter ? statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1) : 'All Status'}</span>
              <svg className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-[140px] bg-[#111827] border border-white/[0.08] rounded-xl p-1.5 shadow-xl shadow-black/30 z-50 animate-scale-in">
                {[{ value: '', label: 'All Status' }, ...STATUSES.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))].map(opt => (
                  <button key={opt.value} onClick={() => { setStatusFilter(opt.value); setDropdownOpen(false) }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      statusFilter === opt.value
                        ? 'bg-orange-500/15 text-orange-400 font-medium'
                        : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
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

      {/* Desktop table */}
      <div className="hidden md:block bg-[#1F2937] rounded-xl shadow-sm border border-white/[0.06] overflow-x-auto">
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

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {leads.map(lead => (
          <div key={lead.id} className="bg-[#1F2937] rounded-xl p-4 border border-white/[0.06]">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="font-medium text-white text-sm truncate">{lead.name}</p>
                <p className="text-gray-400 text-xs">{new Date(lead.created_at).toLocaleDateString()}</p>
              </div>
              <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}
                className={`px-2 py-1 rounded-lg text-xs font-medium border outline-none focus:ring-2 focus:ring-orange-500 shrink-0 ${
                  lead.status === 'new' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  lead.status === 'contacted' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  lead.status === 'enrolled' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  'bg-gray-500/10 text-gray-400 border-gray-500/20'
                }`}>
                {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs mb-3">
              <p className="text-gray-400"><span className="text-gray-500">Phone:</span> <span className="text-gray-300">{lead.phone}</span></p>
              {lead.email && <p className="text-gray-400 truncate"><span className="text-gray-500">Email:</span> <span className="text-gray-300">{lead.email}</span></p>}
              {lead.branch_pref && <p className="text-gray-400"><span className="text-gray-500">Branch:</span> <span className="text-gray-300">{lead.branch_pref}</span></p>}
              {lead.course_interest && <p className="text-gray-400 truncate"><span className="text-gray-500">Course:</span> <span className="text-gray-300">{lead.course_interest}</span></p>}
            </div>
            <button onClick={() => viewDetails(lead)} className="text-orange-400 hover:underline text-xs font-medium">View Details</button>
          </div>
        ))}
      </div>
    </div>
  )
}
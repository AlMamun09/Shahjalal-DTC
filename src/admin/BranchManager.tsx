import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Branch } from '../types'

export function AdminBranchManager() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [editing, setEditing] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('branches').select('*').order('sort_order').then(({ data }) => {
      if (data) setBranches(data)
    })
  }, [])

  const handleSave = async (branch: Branch) => {
    await supabase.from('branches').update(branch).eq('id', branch.id)
    setEditing(null)
  }

  const addPhone = (branch: Branch) => {
    const updated = { ...branch, phones: [...branch.phones, ''] }
    if (editing === branch.id) setBranches(branches.map(b => b.id === branch.id ? updated : b))
  }

  const updatePhone = (branch: Branch, i: number, val: string) => {
    const phones = [...branch.phones]; phones[i] = val
    setBranches(branches.map(b => b.id === branch.id ? { ...branch, phones } : b))
  }

  const removePhone = (branch: Branch, i: number) => {
    setBranches(branches.map(b => b.id === branch.id ? { ...branch, phones: branch.phones.filter((_, idx) => idx !== i) } : b))
  }

  const addEmail = (branch: Branch) => {
    setBranches(branches.map(b => b.id === branch.id ? { ...branch, emails: [...branch.emails, ''] } : b))
  }

  const updateEmail = (branch: Branch, i: number, val: string) => {
    const emails = [...branch.emails]; emails[i] = val
    setBranches(branches.map(b => b.id === branch.id ? { ...branch, emails } : b))
  }

  const removeEmail = (branch: Branch, i: number) => {
    setBranches(branches.map(b => b.id === branch.id ? { ...branch, emails: branch.emails.filter((_, idx) => idx !== i) } : b))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Branch Manager</h1>
      <div className="space-y-6">
        {branches.map(branch => (
          <div key={branch.id} className="bg-[#1F2937] rounded-xl p-6 shadow-sm border border-orange-500/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{branch.name_en}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => supabase.from('branches').update({ is_active: !branch.is_active }).eq('id', branch.id).then(() =>
                    setBranches(branches.map(b => b.id === branch.id ? { ...branch, is_active: !branch.is_active } : b))
                  )}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    branch.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'
                  }`}
                >
                  {branch.is_active ? 'Active' : 'Inactive'}
                </button>
                <button onClick={() => setEditing(editing === branch.id ? null : branch.id)}
                  className="px-3 py-1 bg-orange-500 text-white rounded-lg text-sm">
                  {editing === branch.id ? 'Cancel' : 'Edit'}
                </button>
              </div>
            </div>

            {editing === branch.id ? (
              <div className="space-y-4">
                <div><label className="block text-sm font-medium text-gray-300">Name (Bn)</label>
                  <input value={branch.name_bn} onChange={e => setBranches(branches.map(b => b.id === branch.id ? { ...branch, name_bn: e.target.value } : b))}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
                <div><label className="block text-sm font-medium text-gray-300">Name (En)</label>
                  <input value={branch.name_en} onChange={e => setBranches(branches.map(b => b.id === branch.id ? { ...branch, name_en: e.target.value } : b))}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
                <div><label className="block text-sm font-medium text-gray-300">Address (Bn)</label>
                  <textarea value={branch.address_bn} onChange={e => setBranches(branches.map(b => b.id === branch.id ? { ...branch, address_bn: e.target.value } : b))}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" rows={2} /></div>
                <div><label className="block text-sm font-medium text-gray-300">Address (En)</label>
                  <textarea value={branch.address_en} onChange={e => setBranches(branches.map(b => b.id === branch.id ? { ...branch, address_en: e.target.value } : b))}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" rows={2} /></div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">Phone Numbers</label>
                  {branch.phones.map((phone, i) => (
                    <div key={i} className="flex gap-2 mt-1">
                      <input value={phone} onChange={e => updatePhone(branch, i, e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" />
                      <button onClick={() => removePhone(branch, i)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                    </div>
                  ))}
                  <button onClick={() => addPhone(branch)} className="mt-1 text-sm text-orange-400 hover:underline">+ Add Phone</button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">Emails</label>
                  {branch.emails.map((email, i) => (
                    <div key={i} className="flex gap-2 mt-1">
                      <input value={email} onChange={e => updateEmail(branch, i, e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" />
                      <button onClick={() => removeEmail(branch, i)} className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                    </div>
                  ))}
                  <button onClick={() => addEmail(branch)} className="mt-1 text-sm text-orange-400 hover:underline">+ Add Email</button>
                </div>

                <div><label className="block text-sm font-medium text-gray-300">WhatsApp</label>
                  <input value={branch.whatsapp} onChange={e => setBranches(branches.map(b => b.id === branch.id ? { ...branch, whatsapp: e.target.value } : b))}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>
                <div><label className="block text-sm font-medium text-gray-300">Google Maps Embed URL</label>
                  <input value={branch.map_embed_url} onChange={e => setBranches(branches.map(b => b.id === branch.id ? { ...branch, map_embed_url: e.target.value } : b))}
                    className="w-full px-3 py-2 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white" /></div>

                <button onClick={() => handleSave(branch)}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-orange-500/30">
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-400 space-y-1">
                <p><strong className="text-gray-300">Bn:</strong> {branch.name_bn}</p>
                <p><strong className="text-gray-300">Phones:</strong> {branch.phones.join(', ')}</p>
                <p><strong className="text-gray-300">Emails:</strong> {branch.emails.join(', ')}</p>
                <p><strong className="text-gray-300">WhatsApp:</strong> {branch.whatsapp}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
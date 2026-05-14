import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { ImageUpload } from '../components/ImageUpload'

const SETTING_KEYS = [
  'site_name_bn', 'site_name_en', 'site_logo',
  'admin_email',
  'whatsapp_default', 'facebook_url', 'youtube_url',
  'hero_title_bn', 'hero_title_en', 'hero_subtitle_bn', 'hero_subtitle_en',
  'stat_students', 'stat_years', 'stat_success_rate',
  'brta_reg_number', 'footer_text',
]

const LABELS: Record<string, string> = {
  site_name_bn: 'Center Name (Bangla)', site_name_en: 'Center Name (English)',
  site_logo: 'Website Logo',
  admin_email: 'Admin Notification Email', whatsapp_default: 'Default WhatsApp',
  facebook_url: 'Facebook URL', youtube_url: 'YouTube URL',
  hero_title_bn: 'Hero Title (Bangla)', hero_title_en: 'Hero Title (English)',
  hero_subtitle_bn: 'Hero Subtitle (Bangla)', hero_subtitle_en: 'Hero Subtitle (English)',
  stat_students: 'Students Trained', stat_years: 'Years Active',
  stat_success_rate: 'Success Rate (%)', brta_reg_number: 'BRTA Reg Number',
  footer_text: 'Footer Copyright Text',
}

export function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.from('site_settings').select('*').then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {}
        data.forEach(s => { map[s.key] = s.value })
        setSettings(map)
      }
    })
  }, [])

  const update = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    for (const key of SETTING_KEYS) {
      await supabase.from('site_settings').upsert(
        { key, value: settings[key] || '' },
        { onConflict: 'key' }
      )
    }

    setSaving(false)
    setMessage('Settings saved!')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Site Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your center's global configuration</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-[#1F2937] rounded-2xl p-8 shadow-sm border border-orange-500/10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SETTING_KEYS.map(key => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{LABELS[key]}</label>
              {key === 'site_logo' ? (
                <ImageUpload value={settings[key] || ''} onChange={url => update(key, url)} folder="logo" />
              ) : (
                <input
                  type="text"
                  value={settings[key] || ''}
                  onChange={e => update(key, e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#374151] border border-orange-500/10 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-300 text-sm text-white placeholder-gray-400"
                />
              )}
            </div>
          ))}
        </div>

        {message && (
          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 flex items-center gap-2 animate-slide-down">
            <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-emerald-400 text-sm font-medium">{message}</p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-orange-500/10 flex items-center justify-between">
          <p className="text-xs text-gray-500">Changes take effect immediately</p>
          <button
            type="submit" disabled={saving}
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-medium transition-all duration-300 disabled:opacity-50 shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center gap-2">
              {saving ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              )}
              {saving ? 'Saving...' : 'Save Settings'}
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}
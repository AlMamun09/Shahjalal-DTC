import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { SiteSetting } from '../types'

const SETTING_KEYS = [
  'site_name_bn', 'site_name_en', 'admin_email',
  'whatsapp_default', 'facebook_url', 'youtube_url',
  'hero_title_bn', 'hero_title_en', 'hero_subtitle_bn', 'hero_subtitle_en',
  'stat_students', 'stat_years', 'stat_success_rate',
  'brta_reg_number', 'footer_text',
]

const LABELS: Record<string, string> = {
  site_name_bn: 'Center Name (Bangla)', site_name_en: 'Center Name (English)',
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
    <div>
      <h1 className="text-2xl font-poppins font-bold mb-6">Site Settings</h1>

      <form onSubmit={handleSave} className="bg-white rounded-xl p-6 shadow-sm max-w-2xl space-y-4">
        {SETTING_KEYS.map(key => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{LABELS[key]}</label>
            <input
              type="text"
              value={settings[key] || ''}
              onChange={e => update(key, e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent outline-none"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hero Image</label>
          <p className="text-sm text-gray-500 mb-2">Upload from Gallery Manager</p>
        </div>

        {message && <p className="text-green-600 font-medium">{message}</p>}

        <button
          type="submit" disabled={saving}
          className="px-6 py-2 bg-brand-red text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { Branch } from '../types'

export function BranchesPage() {
  const { t, i18n } = useTranslation()
  const [branches, setBranches] = useState<Branch[]>([])
  const lang = i18n.language === 'bn' ? 'bn' : 'en'

  useEffect(() => {
    supabase.from('branches').select('*').eq('is_active', true).order('sort_order').then(({ data }) => {
      if (data) setBranches(data)
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-poppins font-bold text-center mb-10">{t('branches.title')}</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {branches.map(branch => (
          <div key={branch.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            {branch.photo_url && (
              <img src={branch.photo_url} alt="" className="w-full h-48 object-cover" />
            )}
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{lang === 'bn' ? branch.name_bn : branch.name_en}</h2>
              <p className="text-gray-600 mb-4">{lang === 'bn' ? branch.address_bn : branch.address_en}</p>

              <div className="space-y-2 text-sm mb-4">
                <p className="font-medium">Phone:</p>
                {branch.phones.map(p => (
                  <a key={p} href={`tel:${p}`} className="block text-brand-red hover:underline">{p}</a>
                ))}
                {branch.emails.length > 0 && (
                  <>
                    <p className="font-medium mt-2">Email:</p>
                    {branch.emails.map(e => <p key={e} className="text-gray-600">{e}</p>)}
                  </>
                )}
              </div>

              <div className="flex gap-3">
                <a href={`https://wa.me/88${branch.whatsapp}`} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
                  {t('branches.whatsapp')}
                </a>
                <Link to={`/branches/${branch.slug}`} className="px-4 py-2 border border-brand-red text-brand-red rounded-lg text-sm font-medium hover:bg-brand-red hover:text-white transition-colors">
                  {t('branches.view_map')}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

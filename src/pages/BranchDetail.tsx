import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { Branch } from '../types'
import { InquiryForm } from '../components/InquiryForm'

export function BranchDetailPage() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const [branch, setBranch] = useState<Branch | null>(null)
  const lang = i18n.language === 'bn' ? 'bn' : 'en'

  useEffect(() => {
    if (!slug) return
    supabase.from('branches').select('*').eq('slug', slug).single().then(({ data }) => {
      if (data) setBranch(data)
    })
  }, [slug])

  if (!branch) return <div className="p-8 text-center text-gray-500">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "DrivingSchool",
          "name": "Shahjalal Driving Training Center",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": lang === 'bn' ? branch.address_bn : branch.address_en,
            "addressCountry": "BD"
          },
          "telephone": `+88${branch.phones[0] || ''}`,
          "url": `https://shahjalaldrivingcenter.com/branches/${branch.slug}`,
        })}
      </script>

      <div className="grid lg:grid-cols-2 gap-10">
        <div>
          <h1 className="text-3xl font-heading font-bold mb-4 text-white">{lang === 'bn' ? branch.name_bn : branch.name_en}</h1>
          <p className="text-gray-300 mb-6">{lang === 'bn' ? branch.address_bn : branch.address_en}</p>

          <div className="space-y-3 mb-6">
            <p className="font-semibold text-white">{t('branches.title')}:</p>
            {branch.phones.map(p => (
              <a key={p} href={`tel:${p}`} className="block text-orange-400 hover:underline text-lg">{p}</a>
            ))}
          </div>

          {branch.map_embed_url && (
            <div className="rounded-xl overflow-hidden mb-6 aspect-video">
              <iframe src={branch.map_embed_url} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
            </div>
          )}

          <a href={`https://wa.me/88${branch.whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-green-600 transition-colors">
            {t('branches.whatsapp')}
          </a>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-white">{t('enroll.title')}</h2>
          <div className="bg-[#1F2937] rounded-2xl p-8 shadow-sm border border-orange-500/10">
            <InquiryForm preselectedBranch={branch.slug} />
          </div>
        </div>
      </div>
    </div>
  )
}
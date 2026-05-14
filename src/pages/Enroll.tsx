import { useTranslation } from 'react-i18next'
import { InquiryForm } from '../components/InquiryForm'

export function EnrollPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-heading font-bold text-center mb-2 text-white">{t('enroll.title')}</h1>
      <p className="text-gray-400 text-center mb-8">Fill out the form and we'll contact you shortly</p>
      <div className="bg-[#1F2937] rounded-xl p-8 shadow-sm border border-orange-500/10">
        <InquiryForm />
      </div>
    </div>
  )
}
import { useTranslation } from 'react-i18next'
import { InquiryForm } from '../components/InquiryForm'

export function EnrollPage() {
  const { t } = useTranslation()

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-poppins font-bold text-center mb-2">{t('enroll.title')}</h1>
      <p className="text-gray-500 text-center mb-8">Fill out the form and we'll contact you shortly</p>
      <div className="bg-white rounded-xl p-8 shadow-sm border">
        <InquiryForm />
      </div>
    </div>
  )
}

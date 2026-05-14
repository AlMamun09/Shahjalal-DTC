import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import type { Branch, Course } from '../types'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'Enter a valid BD phone number (01XXXXXXXXX)'),
  email: z.string().email().optional().or(z.literal('')),
  branch_pref: z.string().optional(),
  course_interest: z.string().optional(),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  preselectedBranch?: string
}

export function InquiryForm({ preselectedBranch }: Props) {
  const { t } = useTranslation()
  const [branches, setBranches] = useState<Branch[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    supabase.from('branches').select('*').eq('is_active', true).then(({ data }) => {
      if (data) setBranches(data)
    })
    supabase.from('courses').select('*').eq('is_active', true).then(({ data }) => {
      if (data) setCourses(data)
    })
    if (preselectedBranch) setValue('branch_pref', preselectedBranch)
  }, [preselectedBranch, setValue])

  const onSubmit = async (data: FormData) => {
    await supabase.from('leads').insert(data)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
        <p className="text-green-400 font-semibold text-lg">{t('enroll.success')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input {...register('name')} placeholder={t('enroll.name')}
          className="w-full px-4 py-3 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all" />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <input {...register('phone')} placeholder={t('enroll.phone')}
          className="w-full px-4 py-3 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all" />
        {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>}
      </div>
      <div>
        <input {...register('email')} placeholder={t('enroll.email')}
          className="w-full px-4 py-3 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <select {...register('branch_pref')} className="px-4 py-3 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white transition-all">
          <option value="">{t('enroll.branch')}</option>
          {branches.map(b => <option key={b.id} value={b.slug}>{b.name_en}</option>)}
        </select>
        <select {...register('course_interest')} className="px-4 py-3 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white transition-all">
          <option value="">{t('enroll.course')}</option>
          {courses.map(c => <option key={c.id} value={c.name_en}>{c.name_en}</option>)}
        </select>
      </div>
      <div>
        <textarea {...register('message')} placeholder={t('enroll.message')} rows={3}
          className="w-full px-4 py-3 bg-[#374151] border border-orange-500/10 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 text-white placeholder-gray-400 transition-all" />
      </div>
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <button type="submit"
        className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-all text-lg">
        {t('enroll.submit')}
      </button>
    </form>
  )
}
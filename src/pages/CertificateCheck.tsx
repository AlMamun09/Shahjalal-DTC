import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'

function Section({ children }: { children: React.ReactNode }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>{children}</div>
}

export function CertificateCheckPage() {
  const [certNo, setCertNo] = useState('')
  const [dob, setDob] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    const { data } = await supabase.from('certificates').select('*').eq('certificate_no', certNo.toUpperCase()).maybeSingle()
    if (data) {
      setResult(data)
    } else {
      setError('No certificate found with this number')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Section>
        <h1 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-3">Certificate Check</h1>
        <div className="section-divider" />
        <p className="text-gray-500 text-center mt-4">Verify the authenticity of a driving certificate issued by Shahjalal Driving Training Center</p>
      </Section>

      <Section>
        <form onSubmit={handleSearch} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mt-10 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Certificate Number</label>
            <input required value={certNo} onChange={e => setCertNo(e.target.value)} placeholder="e.g. SDC-2026-0001"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-red to-brand-red-light text-white rounded-xl font-medium transition-all shadow-lg shadow-brand-red/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50">
            {loading ? 'Searching...' : 'Verify Certificate'}
          </button>
          {error && <p className="text-red-600 text-sm text-center bg-red-50 rounded-xl px-4 py-3">{error}</p>}
        </form>
      </Section>

      {result && (
        <Section>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 mt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-emerald-800">Valid Certificate</h2>
                <p className="text-emerald-600 text-sm">This certificate is authentic and verified</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-xl p-4"><span className="text-gray-500 block">Student Name</span><span className="font-semibold">{result.student_name}</span></div>
              <div className="bg-white rounded-xl p-4"><span className="text-gray-500 block">Course</span><span className="font-semibold">{result.course_name}</span></div>
              <div className="bg-white rounded-xl p-4"><span className="text-gray-500 block">Certificate No</span><span className="font-semibold">{result.certificate_no}</span></div>
              <div className="bg-white rounded-xl p-4"><span className="text-gray-500 block">Issue Date</span><span className="font-semibold">{new Date(result.issue_date).toLocaleDateString()}</span></div>
            </div>
          </div>
        </Section>
      )}
    </div>
  )
}

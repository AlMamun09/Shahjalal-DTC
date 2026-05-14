import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useReveal } from '../hooks/useReveal'

function Section({ children }: { children: React.ReactNode }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>{children}</div>
}

export function CertificateCheckPage() {
  const [certNo, setCertNo] = useState('')
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
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-center mb-3 text-white">Certificate Check</h1>
        <div className="section-divider" />
        <p className="text-gray-400 text-center mt-4">Verify the authenticity of a driving certificate issued by Shahjalal Driving Training Center</p>
      </Section>

      <Section>
        <form onSubmit={handleSearch} className="bg-[#1F2937] rounded-2xl p-8 shadow-sm border border-orange-500/10 mt-10 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Certificate Number</label>
            <input required value={certNo} onChange={e => setCertNo(e.target.value)} placeholder="e.g. SDC-2026-0001"
              className="w-full px-4 py-3 bg-[#374151] border border-orange-500/10 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none text-white placeholder-gray-400 transition-all" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-orange-500/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50">
            {loading ? 'Searching...' : 'Verify Certificate'}
          </button>
          {error && <p className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl px-4 py-3">{error}</p>}
        </form>
      </Section>

      {result && (
        <Section>
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 mt-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-green-400">Valid Certificate</h2>
                <p className="text-green-500 text-sm">This certificate is authentic and verified</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-[#374151] rounded-xl p-4"><span className="text-gray-400 block">Student Name</span><span className="font-semibold text-white">{result.student_name}</span></div>
              <div className="bg-[#374151] rounded-xl p-4"><span className="text-gray-400 block">Course</span><span className="font-semibold text-white">{result.course_name}</span></div>
              <div className="bg-[#374151] rounded-xl p-4"><span className="text-gray-400 block">Certificate No</span><span className="font-semibold text-white">{result.certificate_no}</span></div>
              <div className="bg-[#374151] rounded-xl p-4"><span className="text-gray-400 block">Issue Date</span><span className="font-semibold text-white">{new Date(result.issue_date).toLocaleDateString()}</span></div>
            </div>
          </div>
        </Section>
      )}
    </div>
  )
}
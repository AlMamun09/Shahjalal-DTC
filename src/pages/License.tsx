import { Link } from 'react-router-dom'
import { useReveal } from '../hooks/useReveal'

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>
}

export function LicensePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Section>
        <h1 className="text-3xl md:text-4xl font-poppins font-bold text-center mb-3">Driving License</h1>
        <div className="section-divider" />
        <p className="text-gray-500 text-center mt-4 max-w-2xl mx-auto">Complete guidance for obtaining your BRTA driving license</p>
      </Section>

      <Section delay={100}>
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-semibold mb-3">License Types</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3"><span className="w-6 h-6 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red text-sm shrink-0 mt-0.5">1</span><div><strong>Learner License</strong> — Temporary permit for practicing driving (valid 6 months)</div></li>
              <li className="flex items-start gap-3"><span className="w-6 h-6 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red text-sm shrink-0 mt-0.5">2</span><div><strong>Full License</strong> — Permanent driving license after passing BRTA test (valid 5 years)</div></li>
              <li className="flex items-start gap-3"><span className="w-6 h-6 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red text-sm shrink-0 mt-0.5">3</span><div><strong>Professional License</strong> — For commercial drivers (taxi, truck, bus)</div></li>
              <li className="flex items-start gap-3"><span className="w-6 h-6 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red text-sm shrink-0 mt-0.5">4</span><div><strong>International License</strong> — For driving abroad with IDP (International Driving Permit)</div></li>
              <li className="flex items-start gap-3"><span className="w-6 h-6 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red text-sm shrink-0 mt-0.5">5</span><div><strong>Motorcycle License</strong> — For bike and scooter riders</div></li>
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 card-hover">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-xl font-semibold mb-3">Application Process</h2>
            <ol className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3"><span className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white text-sm shrink-0 mt-0.5">1</span><div><strong>Enroll in Training</strong> — Complete driving course at Shahjalal Driving Center</div></li>
              <li className="flex items-start gap-3"><span className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white text-sm shrink-0 mt-0.5">2</span><div><strong>Document Collection</strong> — NID, passport photos, medical certificate, application form</div></li>
              <li className="flex items-start gap-3"><span className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white text-sm shrink-0 mt-0.5">3</span><div><strong>Written Exam</strong> — Pass the BRTA written/oral test on traffic rules</div></li>
              <li className="flex items-start gap-3"><span className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white text-sm shrink-0 mt-0.5">4</span><div><strong>Practical Test</strong> — Demonstrate driving skills at BRTA designated area</div></li>
              <li className="flex items-start gap-3"><span className="w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white text-sm shrink-0 mt-0.5">5</span><div><strong>Receive License</strong> — Collect your license from BRTA office or home delivery</div></li>
            </ol>
          </div>
        </div>
      </Section>

      <Section delay={150}>
        <div className="mt-10 bg-gradient-to-r from-brand-red to-brand-red-light rounded-2xl p-10 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">Need Help With Your License?</h2>
          <p className="text-white/80 mb-6">We provide end-to-end license assistance — from form fill-up to test preparation.</p>
          <Link to="/enroll" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-brand-red rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105">Get License Assistance →</Link>
        </div>
      </Section>
    </div>
  )
}

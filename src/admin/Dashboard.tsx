import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#CC1616', '#F5C518', '#16A34A', '#1E293B', '#6B7280']

export function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, today: 0, week: 0, month: 0 })
  const [leadsByCourse, setLeadsByCourse] = useState<{ name: string; value: number }[]>([])
  const [leadsByBranch, setLeadsByBranch] = useState<{ name: string; value: number }[]>([])
  const [leadsOverTime, setLeadsOverTime] = useState<{ date: string; count: number }[]>([])
  const [recentLeads, setRecentLeads] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const monthStart = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: total } = await supabase.from('leads').select('id', { count: 'exact' })
    const { count: todayCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', todayStart)
    const { count: weekCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', weekStart)
    const { count: monthCount } = await supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', monthStart)

    setStats({
      total: total?.length ?? 0,
      today: todayCount ?? 0,
      week: weekCount ?? 0,
      month: monthCount ?? 0,
    })

    const { data: courses } = await supabase.from('leads').select('course_interest')
    if (courses) {
      const grouped = courses.reduce<Record<string, number>>((acc, l) => {
        const key = l.course_interest || 'Not specified'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})
      setLeadsByCourse(Object.entries(grouped).map(([name, value]) => ({ name, value })))
    }

    const { data: branches } = await supabase.from('leads').select('branch_pref')
    if (branches) {
      const grouped = branches.reduce<Record<string, number>>((acc, l) => {
        const key = l.branch_pref || 'Not specified'
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {})
      setLeadsByBranch(Object.entries(grouped).map(([name, value]) => ({ name, value })))
    }

    const { data: timeData } = await supabase.from('leads').select('created_at').gte('created_at', monthStart)
    if (timeData) {
      const daily = timeData.reduce<Record<string, number>>((acc, l) => {
        const day = l.created_at.slice(0, 10)
        acc[day] = (acc[day] || 0) + 1
        return acc
      }, {})
      setLeadsOverTime(Object.entries(daily).sort().map(([date, count]) => ({ date: date.slice(5), count })))
    }

    const { data: recent } = await supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(10)
    setRecentLeads(recent || [])
  }

  const Card = ({ label, value }: { label: string; value: number }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <p className="text-sm text-gray-500 font-inter">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  )

  return (
    <div>
      <h1 className="text-2xl font-poppins font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card label="Total Leads" value={stats.total} />
        <Card label="Today" value={stats.today} />
        <Card label="This Week" value={stats.week} />
        <Card label="This Month" value={stats.month} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Leads Over Time (30d)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={leadsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#CC1616" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Leads by Course</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={leadsByCourse} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {leadsByCourse.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Leads by Branch</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={leadsByBranch}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#CC1616" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold mb-4">Recent Submissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-2 font-inter">Name</th>
                  <th className="pb-2 font-inter">Phone</th>
                  <th className="pb-2 font-inter">Status</th>
                  <th className="pb-2 font-inter">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map(lead => (
                  <tr key={lead.id} className="border-b last:border-0">
                    <td className="py-2">{lead.name}</td>
                    <td className="py-2">{lead.phone}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        lead.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                        lead.status === 'enrolled' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{lead.status}</span>
                    </td>
                    <td className="py-2 text-gray-500">{new Date(lead.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

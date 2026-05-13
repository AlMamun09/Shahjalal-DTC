import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#CC1616', '#F5C518', '#16A34A', '#1E293B', '#6B7280']

function StatCard({ label, value, icon, trend }: { label: string; value: number | string; icon: string; trend?: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-red/10 to-brand-gold/10 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {trend && <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">{trend}</span>}
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
      <p className="text-sm text-gray-500 font-inter">{label}</p>
    </div>
  )
}

export function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, today: 0, week: 0, month: 0 })
  const [leadsByCourse, setLeadsByCourse] = useState<{ name: string; value: number }[]>([])
  const [leadsByBranch, setLeadsByBranch] = useState<{ name: string; value: number }[]>([])
  const [leadsOverTime, setLeadsOverTime] = useState<{ date: string; count: number }[]>([])
  const [recentLeads, setRecentLeads] = useState<any[]>([])

  useEffect(() => { loadData() }, [])

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

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-inter font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your driving school leads and inquiries</p>
        </div>
        <button onClick={loadData} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-medium shadow-sm hover:shadow">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Leads" value={stats.total} icon="📋" />
        <StatCard label="Today" value={stats.today} icon="📅" trend={stats.today > 0 ? '+ today' : undefined} />
        <StatCard label="This Week" value={stats.week} icon="📊" />
        <StatCard label="This Month" value={stats.month} icon="📈" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-inter font-semibold text-gray-900">Leads Over Time (30d)</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-brand-red" />
              Leads
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={leadsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" fontSize={11} tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis fontSize={11} tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Line type="monotone" dataKey="count" stroke="#CC1616" strokeWidth={2.5} dot={{ fill: '#CC1616', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-inter font-semibold text-gray-900">Leads by Course</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={leadsByCourse} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                {leadsByCourse.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {leadsByCourse.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {item.name}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-inter font-semibold text-gray-900">Leads by Branch</h2>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={leadsByBranch} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={11} tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis fontSize={11} tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} cursor={{ fill: '#f8f8f8' }} />
              <Bar dataKey="value" fill="#CC1616" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-inter font-semibold text-gray-900">Recent Submissions</h2>
            <span className="text-xs text-gray-400">{recentLeads.length} entries</span>
          </div>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-3 px-6 font-inter font-medium text-gray-400 text-xs uppercase tracking-wider">Name</th>
                  <th className="pb-3 px-6 font-inter font-medium text-gray-400 text-xs uppercase tracking-wider">Phone</th>
                  <th className="pb-3 px-6 font-inter font-medium text-gray-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="pb-3 px-6 font-inter font-medium text-gray-400 text-xs uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead, i) => (
                  <tr key={lead.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i === 0 ? 'animate-slide-down' : ''}`}>
                    <td className="py-3 px-6 font-medium text-gray-900">{lead.name}</td>
                    <td className="py-3 px-6 text-gray-500">{lead.phone}</td>
                    <td className="py-3 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'new' ? 'bg-blue-50 text-blue-700' :
                        lead.status === 'contacted' ? 'bg-amber-50 text-amber-700' :
                        lead.status === 'enrolled' ? 'bg-emerald-50 text-emerald-700' :
                        'bg-gray-50 text-gray-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          lead.status === 'new' ? 'bg-blue-500' :
                          lead.status === 'contacted' ? 'bg-amber-500' :
                          lead.status === 'enrolled' ? 'bg-emerald-500' :
                          'bg-gray-400'
                        }`} />
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-gray-400 text-xs">{new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentLeads.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">No leads yet</div>
          )}
        </div>
      </div>
    </div>
  )
}

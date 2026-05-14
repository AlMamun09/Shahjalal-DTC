import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'

const COLORS = ['#F97316', '#FB923C', '#22C55E', '#F59E0B', '#EF4444']

function StatCard({ label, value, icon, trend }: { label: string; value: number | string; icon: string; trend?: string }) {
  return (
    <div className="bg-[#1F2937] rounded-2xl p-6 shadow-sm border border-orange-500/10 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-400/10 flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        {trend && <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full font-medium">{trend}</span>}
      </div>
      <p className="text-2xl font-bold text-white mb-0.5">{value}</p>
      <p className="text-sm text-gray-400">{label}</p>
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
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Overview of your driving school leads and inquiries</p>
        </div>
        <button onClick={loadData} className="inline-flex items-center gap-2 px-4 py-2 bg-[#1F2937] border border-orange-500/10 rounded-xl text-sm text-gray-300 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-300 font-medium shadow-sm hover:shadow-md">
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
        <div className="bg-[#111827] rounded-[20px] p-4 sm:p-6 border border-white/[0.06] shadow-xl shadow-black/20 w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-white">Leads Over Time (30d)</h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              Leads
            </div>
          </div>
          <div className="w-full min-w-0">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={leadsOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" fontSize={11} tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis fontSize={11} tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #374151', background: '#1F2937', color: '#F8FAFC' }} />
                <Line type="monotone" dataKey="count" stroke="#F97316" strokeWidth={2.5} dot={{ fill: '#F97316', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[20px] p-4 sm:p-6 border border-white/[0.06] shadow-xl shadow-black/20 w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-white">Leads by Course</h2>
          </div>
          <div className="w-full min-w-0">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={leadsByCourse} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
                  {leadsByCourse.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #374151', background: '#1F2937', color: '#F8FAFC' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {leadsByCourse.map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {item.name}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111827] rounded-[20px] p-4 sm:p-6 border border-white/[0.06] shadow-xl shadow-black/20 w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-white">Leads by Branch</h2>
          </div>
          <div className="w-full min-w-0">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={leadsByBranch} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" fontSize={11} tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis fontSize={11} tick={{ fill: '#9CA3AF' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #374151', background: '#1F2937', color: '#F8FAFC' }} cursor={{ fill: '#37415155' }} />
                <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111827] rounded-[20px] p-4 sm:p-6 border border-white/[0.06] shadow-xl shadow-black/20 w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-white">Recent Submissions</h2>
            <span className="text-xs text-gray-500">{recentLeads.length} entries</span>
          </div>
          <div className="overflow-x-auto -mx-4 sm:-mx-6">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="text-left border-b border-orange-500/10">
                  <th className="pb-3 px-4 sm:px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">Name</th>
                  <th className="pb-3 px-4 sm:px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">Phone</th>
                  <th className="pb-3 px-4 sm:px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="pb-3 px-4 sm:px-6 font-medium text-gray-500 text-xs uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead, i) => (
                  <tr key={lead.id} className={`border-b border-orange-500/5 hover:bg-orange-500/5 transition-colors ${i === 0 ? 'animate-slide-down' : ''}`}>
                    <td className="py-3 px-4 sm:px-6 font-medium text-white whitespace-nowrap">{lead.name}</td>
                    <td className="py-3 px-4 sm:px-6 text-gray-400 whitespace-nowrap">{lead.phone}</td>
                    <td className="py-3 px-4 sm:px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'new' ? 'bg-blue-500/10 text-blue-400' :
                        lead.status === 'contacted' ? 'bg-amber-500/10 text-amber-400' :
                        lead.status === 'enrolled' ? 'bg-emerald-500/10 text-emerald-400' :
                        'bg-gray-500/10 text-gray-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          lead.status === 'new' ? 'bg-blue-400' :
                          lead.status === 'contacted' ? 'bg-amber-400' :
                          lead.status === 'enrolled' ? 'bg-emerald-400' :
                          'bg-gray-400'
                        }`} />
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-gray-500 text-xs whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentLeads.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">No leads yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
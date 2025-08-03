import { useState, useEffect } from 'react'
import { useAuth, useData } from '../App'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts'
import {
  TrendingUp, Users, Target, Phone, Calendar, Clock, CheckCircle, 
  AlertTriangle, Award, Activity, MessageCircle, UserCheck, Eye,
  ArrowUp, ArrowDown, RotateCcw, Filter
} from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

const AgentAnalytics = () => {
  const { user } = useAuth()
  const { leads } = useData()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [agentMetrics, setAgentMetrics] = useState({
    totalLeads: 0,
    contactedLeads: 0,
    qualifiedLeads: 0,
    closedDeals: 0,
    contactRate: 0,
    qualificationRate: 0,
    conversionRate: 0,
    avgResponseTime: 0,
    needsAttention: [],
    dailyActivity: [],
    statusDistribution: [],
    sourcePerformance: [],
    monthlyTrends: []
  })

  // Calculate agent-specific metrics
  const calculateAgentMetrics = () => {
    if (!leads || leads.length === 0) {
      setLoading(false)
      return
    }

    // Filter leads assigned to current user
    const agentLeads = leads.filter(lead => 
      lead.assignedTo === user?.name || lead.assigned_to === user?.name
    )

    console.log('🔍 Agent Analytics - Total leads:', leads.length)
    console.log('🔍 Agent Analytics - Agent leads:', agentLeads.length)
    console.log('🔍 Agent Analytics - User name:', user?.name)

    const totalLeads = agentLeads.length
    const contactedLeads = agentLeads.filter(lead => 
      ['contacted', 'relance', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'].includes(lead.status)
    ).length
    const qualifiedLeads = agentLeads.filter(lead => 
      ['qualified', 'proposal', 'negotiation', 'closed-won'].includes(lead.status)
    ).length
    const closedDeals = agentLeads.filter(lead => lead.status === 'closed-won').length

    // Calculate rates
    const contactRate = totalLeads > 0 ? (contactedLeads / totalLeads) * 100 : 0
    const qualificationRate = contactedLeads > 0 ? (qualifiedLeads / contactedLeads) * 100 : 0
    const conversionRate = totalLeads > 0 ? (closedDeals / totalLeads) * 100 : 0

    // Calculate average response time (mock for now - would need timestamps)
    const avgResponseTime = Math.random() * 4 + 1 // 1-5 hours

    // Identify leads needing attention (new leads older than 24h, contacted leads older than 48h)
    const now = new Date()
    const needsAttention = agentLeads.filter(lead => {
      const createdAt = new Date(lead.created_at || lead.createdAt || now)
      const hoursSinceCreated = (now - createdAt) / (1000 * 60 * 60)
      
      if (lead.status === 'new' && hoursSinceCreated > 24) return true
      if (lead.status === 'contacted' && hoursSinceCreated > 48) return true
      if (lead.status === 'relance' && hoursSinceCreated > 72) return true
      return false
    })

    // Status distribution
    const statusCounts = {}
    agentLeads.forEach(lead => {
      statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1
    })

    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      status: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
      count,
      percentage: ((count / totalLeads) * 100).toFixed(1)
    }))

    // Source performance
    const sourceCounts = {}
    agentLeads.forEach(lead => {
      const source = lead.source || 'Unknown'
      if (!sourceCounts[source]) {
        sourceCounts[source] = { total: 0, contacted: 0, qualified: 0, closed: 0 }
      }
      sourceCounts[source].total++
      if (['contacted', 'relance', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'].includes(lead.status)) {
        sourceCounts[source].contacted++
      }
      if (['qualified', 'proposal', 'negotiation', 'closed-won'].includes(lead.status)) {
        sourceCounts[source].qualified++
      }
      if (lead.status === 'closed-won') {
        sourceCounts[source].closed++
      }
    })

    const sourcePerformance = Object.entries(sourceCounts).map(([source, data]) => ({
      source,
      total: data.total,
      contactRate: data.total > 0 ? ((data.contacted / data.total) * 100).toFixed(1) : 0,
      conversionRate: data.total > 0 ? ((data.closed / data.total) * 100).toFixed(1) : 0
    }))

    // Daily activity (last 7 days)
    const dailyActivity = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dayLeads = agentLeads.filter(lead => {
        const leadDate = new Date(lead.created_at || lead.createdAt || date)
        return leadDate.toDateString() === date.toDateString()
      })
      
      dailyActivity.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        leads: dayLeads.length,
        contacted: dayLeads.filter(lead => 
          ['contacted', 'relance', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'].includes(lead.status)
        ).length,
        qualified: dayLeads.filter(lead => 
          ['qualified', 'proposal', 'negotiation', 'closed-won'].includes(lead.status)
        ).length
      })
    }

    // Monthly trends (last 6 months)
    const monthlyTrends = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthLeads = agentLeads.filter(lead => {
        const leadDate = new Date(lead.created_at || lead.createdAt || date)
        return leadDate.getMonth() === date.getMonth() && leadDate.getFullYear() === date.getFullYear()
      })
      
      monthlyTrends.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        leads: monthLeads.length,
        contacted: monthLeads.filter(lead => 
          ['contacted', 'relance', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost'].includes(lead.status)
        ).length,
        closed: monthLeads.filter(lead => lead.status === 'closed-won').length
      })
    }

    setAgentMetrics({
      totalLeads,
      contactedLeads,
      qualifiedLeads,
      closedDeals,
      contactRate: contactRate.toFixed(1),
      qualificationRate: qualificationRate.toFixed(1),
      conversionRate: conversionRate.toFixed(1),
      avgResponseTime: avgResponseTime.toFixed(1),
      needsAttention,
      dailyActivity,
      statusDistribution,
      sourcePerformance,
      monthlyTrends
    })

    setLoading(false)
  }

  useEffect(() => {
    calculateAgentMetrics()
  }, [leads, user])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading your analytics...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Performance Analytics</h1>
            <p className="text-blue-100">Track your lead management performance and identify improvement opportunities</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{agentMetrics.totalLeads}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contact Rate</p>
              <p className="text-2xl font-bold text-gray-900">{agentMetrics.contactRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{agentMetrics.conversionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{agentMetrics.avgResponseTime}h</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Needs Attention Alert */}
      {agentMetrics.needsAttention.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <h3 className="text-lg font-semibold text-amber-900">Leads Needing Attention</h3>
            <span className="bg-amber-200 text-amber-800 px-2 py-1 rounded-full text-sm font-medium">
              {agentMetrics.needsAttention.length}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentMetrics.needsAttention.slice(0, 6).map((lead, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{lead.name || `${lead.first_name} ${lead.last_name}`}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                    lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {lead.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{lead.phone}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Created: {new Date(lead.created_at || lead.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Activity Chart */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Activity (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={agentMetrics.dailyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Area type="monotone" dataKey="leads" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                <Area type="monotone" dataKey="contacted" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                <Area type="monotone" dataKey="qualified" stackId="3" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={agentMetrics.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percentage }) => `${status}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {agentMetrics.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Performance Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={agentMetrics.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2} name="Total Leads" />
                <Line type="monotone" dataKey="contacted" stroke="#10B981" strokeWidth={2} name="Contacted" />
                <Line type="monotone" dataKey="closed" stroke="#8B5CF6" strokeWidth={2} name="Closed Deals" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Performance */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Source Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentMetrics.sourcePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="total" fill="#3B82F6" name="Total Leads" />
                <Bar dataKey="contactRate" fill="#10B981" name="Contact Rate %" />
                <Bar dataKey="conversionRate" fill="#8B5CF6" name="Conversion Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Contacted Leads</h4>
            <p className="text-2xl font-bold text-green-600">{agentMetrics.contactedLeads}</p>
            <p className="text-sm text-gray-600">out of {agentMetrics.totalLeads} total</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Qualified Leads</h4>
            <p className="text-2xl font-bold text-blue-600">{agentMetrics.qualifiedLeads}</p>
            <p className="text-sm text-gray-600">{agentMetrics.qualificationRate}% qualification rate</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900">Closed Deals</h4>
            <p className="text-2xl font-bold text-purple-600">{agentMetrics.closedDeals}</p>
            <p className="text-sm text-gray-600">{agentMetrics.conversionRate}% conversion rate</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentAnalytics

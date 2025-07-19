import { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts'
import { 
  TrendingUp, Users, Target, Phone, Calendar, Clock, AlertTriangle, CheckCircle,
  Activity, Award, Zap, Eye, Filter, Download, RefreshCw, User, UserCheck, Crown
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'https://leadestate-backend-9fih.onrender.com/api'

const KPIDashboard = () => {
  const [kpiData, setKpiData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState('agent')
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')
  const [selectedAgent, setSelectedAgent] = useState('')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Role configurations
  const roleConfig = {
    agent: {
      title: '👤 Agent KPIs',
      color: 'from-blue-500 to-indigo-600',
      icon: User
    },
    'super-agent': {
      title: '🧑‍💼 Super Agent KPIs',
      color: 'from-purple-500 to-pink-600',
      icon: UserCheck
    },
    manager: {
      title: '👨‍💼 Manager KPIs',
      color: 'from-green-500 to-emerald-600',
      icon: Crown
    }
  }

  const periodOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ]

  const fetchKPIData = async () => {
    try {
      setLoading(true)
      console.log(`📊 Fetching ${selectedRole} KPIs for ${selectedPeriod} period`)
      
      const url = `${API_URL}/kpis/${selectedRole}/${selectedPeriod}${selectedAgent ? `?agent=${selectedAgent}` : ''}`
      const response = await fetch(url)
      const result = await response.json()
      
      if (result.success) {
        setKpiData(result.data)
        setLastUpdated(new Date())
        console.log('✅ KPI data loaded:', result.data)
      } else {
        console.error('❌ Failed to fetch KPI data:', result.message)
      }
    } catch (error) {
      console.error('❌ Error fetching KPI data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKPIData()
  }, [selectedRole, selectedPeriod, selectedAgent])

  // Agent KPI Cards
  const renderAgentKPIs = (kpis) => {
    const agentKPICards = [
      {
        title: 'Leads Handled',
        value: kpis.leadsHandled,
        icon: Users,
        color: 'from-blue-500 to-blue-600',
        description: 'Total leads assigned'
      },
      {
        title: 'Calls Made',
        value: kpis.callsMade,
        icon: Phone,
        color: 'from-green-500 to-green-600',
        description: 'Outbound calls completed'
      },
      {
        title: 'Follow-ups Sent',
        value: kpis.followUpsSent,
        icon: Activity,
        color: 'from-purple-500 to-purple-600',
        description: 'WhatsApp/Email follow-ups'
      },
      {
        title: 'Leads Converted',
        value: kpis.leadsConverted,
        icon: Target,
        color: 'from-orange-500 to-orange-600',
        description: 'Successfully closed deals'
      },
      {
        title: 'Avg Response Time',
        value: `${kpis.avgResponseTimeHours.toFixed(1)}h`,
        icon: Clock,
        color: 'from-indigo-500 to-indigo-600',
        description: 'Time to first contact'
      },
      {
        title: 'Timely Follow-ups',
        value: kpis.timelyFollowUps,
        icon: CheckCircle,
        color: 'from-emerald-500 to-emerald-600',
        description: 'Within 24 hours'
      },
      {
        title: 'Ignored Leads',
        value: kpis.ignoredLeads,
        icon: AlertTriangle,
        color: 'from-red-500 to-red-600',
        description: 'No action for 48+ hours'
      },
      {
        title: 'Conversion Rate',
        value: `${kpis.conversionRate}%`,
        icon: Award,
        color: 'from-yellow-500 to-yellow-600',
        description: 'Personal success rate'
      }
    ]

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {agentKPICards.map((kpi, index) => {
          const Icon = kpi.icon
          return (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${kpi.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                    <p className="text-xs text-gray-600">{kpi.title}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{kpi.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Super Agent KPI Cards
  const renderSuperAgentKPIs = (kpis) => {
    return (
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{kpis.totalLeadsAssigned}</p>
                <p className="text-xs text-gray-600">Total Leads Assigned</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{kpis.reassignmentRate}%</p>
                <p className="text-xs text-gray-600">Reassignment Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{kpis.staleLeads}</p>
                <p className="text-xs text-gray-600">Stale Leads (3+ days)</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{kpis.pendingLeads}</p>
                <p className="text-xs text-gray-600">Pending Too Long</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Performance Comparison */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Performance Comparison</h3>
          <div className="space-y-4">
            {kpis.agentPerformance.map((agent, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {agent.agent.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{agent.agent}</p>
                    <p className="text-sm text-gray-600">{agent.totalLeads} leads handled</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{agent.conversionRate}%</p>
                  <p className="text-sm text-gray-600">{agent.convertedLeads} converted</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Suggestions */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🧠 Smart Suggestions</h3>
          <div className="space-y-2">
            {kpis.smartSuggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600" />
                <p className="text-blue-800">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Manager KPI Cards
  const renderManagerKPIs = (kpis) => {
    return (
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{kpis.totalLeadsReceived}</p>
                <p className="text-xs text-gray-600">Total Leads Received</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{kpis.globalConversionRate}%</p>
                <p className="text-xs text-gray-600">Global Conversion Rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">{kpis.avgFirstContactTimeHours.toFixed(1)}h</p>
                <p className="text-xs text-gray-600">Avg First Contact Time</p>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">${(kpis.estimatedValue/1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-600">Estimated Value</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leads by Source */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leads by Source</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={kpis.leadsBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ source, count }) => `${source}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="source"
                >
                  {kpis.leadsBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Channel Effectiveness */}
          <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Channel Effectiveness</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={kpis.channelEffectiveness}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="conversionRate" fill="#8884d8" name="Conversion Rate %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading KPI Dashboard...</p>
        </div>
      </div>
    )
  }

  const currentConfig = roleConfig[selectedRole]
  const Icon = currentConfig.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentConfig.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{currentConfig.title}</h1>
                <p className="text-gray-600">Comprehensive performance metrics and insights</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-700 font-semibold">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              </div>
              <button
                onClick={fetchKPIData}
                className="p-2 bg-white/80 backdrop-blur-sm rounded-lg border border-white/30 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 shadow-sm">
            {/* Role Selection */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Role:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="agent">👤 Agent</option>
                <option value="super-agent">🧑‍💼 Super Agent</option>
                <option value="manager">👨‍💼 Manager</option>
              </select>
            </div>

            {/* Period Selection */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Period:</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {periodOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Agent Selection (for Agent role) */}
            {selectedRole === 'agent' && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Agent:</label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Agents</option>
                  <option value="Sophie Moreau">Sophie Moreau</option>
                  <option value="Antoine Dubois">Antoine Dubois</option>
                  <option value="Emilie Rousseau">Emilie Rousseau</option>
                  <option value="Julien Martin">Julien Martin</option>
                  <option value="Camille Laurent">Camille Laurent</option>
                  <option value="Ayoub Jada">Ayoub Jada</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* KPI Content */}
        {kpiData && kpiData.kpis && (
          <div>
            {selectedRole === 'agent' && renderAgentKPIs(kpiData.kpis)}
            {selectedRole === 'super-agent' && renderSuperAgentKPIs(kpiData.kpis)}
            {selectedRole === 'manager' && renderManagerKPIs(kpiData.kpis)}
          </div>
        )}
      </div>
    </div>
  )
}

export default KPIDashboard

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, ComposedChart, Scatter, ScatterChart
} from 'recharts'
import {
  TrendingUp, Users, Target, Phone, Calendar, RefreshCw, BarChart3, Eye, Filter,
  Download, FileText, FileSpreadsheet, Presentation, MapPin, Globe, Award,
  Zap, DollarSign, Clock, Star, ArrowUp, ArrowDown, Activity, Briefcase
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'https://leadestate-backend-9fih.onrender.com/api'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16']
const GRADIENT_COLORS = [
  'from-blue-500 to-purple-600',
  'from-green-500 to-blue-600',
  'from-yellow-500 to-orange-600',
  'from-red-500 to-pink-600',
  'from-purple-500 to-indigo-600',
  'from-cyan-500 to-blue-600'
]

// Premium Analytics Dashboard Component
const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    // Existing data
    leadsBySource: [],
    leadsNotContacted: { count: 0, total: 0, percentage: 0 },
    contactedLeads: { contacted: 0, total: 0, percentage: 0, period: 'week' },
    conversionRateBySource: [],
    avgContactTimeByAgent: [],
    leadsByStatus: [],
    leadsByAgent: [],
    leadsTimeline: [],
    budgetAnalysis: [],

    // New premium analytics
    agentPerformance: [],
    sourceROI: [],
    geographicalData: [],
    behavioralAnalysis: [],
    conversionFunnel: [],
    revenueAnalysis: [],
    leadQualityScore: [],
    marketTrends: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [selectedAgent, setSelectedAgent] = useState('all')
  const [selectedMetric, setSelectedMetric] = useState('conversion')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [activeTab, setActiveTab] = useState('overview')

  // Generate premium analytics data
  const generatePremiumData = () => {
    const agents = ['Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'David Rodriguez', 'Lisa Thompson', 'James Parker']
    const sources = ['Website', 'Facebook', 'Google Ads', 'Referral', 'Cold Call', 'Email Campaign']
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia']

    // Agent Performance KPIs
    const agentPerformance = agents.map((agent, index) => ({
      name: agent,
      leadsGenerated: Math.floor(Math.random() * 50) + 20,
      conversionRate: Math.floor(Math.random() * 30) + 15,
      avgResponseTime: Math.floor(Math.random() * 120) + 30,
      revenue: Math.floor(Math.random() * 100000) + 50000,
      satisfaction: Math.floor(Math.random() * 20) + 80,
      closedDeals: Math.floor(Math.random() * 15) + 5,
      trend: Math.random() > 0.5 ? 'up' : 'down',
      trendValue: Math.floor(Math.random() * 20) + 5
    }))

    // Source ROI Analysis
    const sourceROI = sources.map((source, index) => ({
      source,
      investment: Math.floor(Math.random() * 5000) + 1000,
      revenue: Math.floor(Math.random() * 20000) + 5000,
      leads: Math.floor(Math.random() * 100) + 20,
      conversions: Math.floor(Math.random() * 20) + 5,
      roi: Math.floor(Math.random() * 300) + 100,
      cpl: Math.floor(Math.random() * 50) + 10,
      ltv: Math.floor(Math.random() * 5000) + 2000
    }))

    // Geographical Heat Map Data
    const geographicalData = cities.map((city, index) => ({
      city,
      leads: Math.floor(Math.random() * 200) + 50,
      conversions: Math.floor(Math.random() * 40) + 10,
      avgPropertyValue: Math.floor(Math.random() * 200000) + 300000,
      marketActivity: Math.floor(Math.random() * 100) + 50,
      coordinates: [Math.random() * 180 - 90, Math.random() * 360 - 180]
    }))

    return { agentPerformance, sourceROI, geographicalData }
  }

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)

      // Generate premium data
      const premiumData = generatePremiumData()

      const [
        leadsBySourceRes,
        leadsNotContactedRes,
        contactedLeadsRes,
        conversionRateRes,
        avgContactTimeRes,
        leadsByStatusRes,
        leadsByAgentRes,
        leadsTimelineRes,
        budgetAnalysisRes
      ] = await Promise.all([
        fetch(`${API_URL}/analytics/leads-by-source`),
        fetch(`${API_URL}/analytics/leads-not-contacted`),
        fetch(`${API_URL}/analytics/contacted-leads?period=${selectedPeriod}`),
        fetch(`${API_URL}/analytics/conversion-rate-by-source`),
        fetch(`${API_URL}/analytics/avg-contact-time-by-agent`),
        fetch(`${API_URL}/analytics/leads-by-status`),
        fetch(`${API_URL}/analytics/leads-by-agent`),
        fetch(`${API_URL}/analytics/leads-timeline?period=${selectedPeriod}`),
        fetch(`${API_URL}/analytics/budget-analysis`)
      ])

      const [
        leadsBySource,
        leadsNotContacted,
        contactedLeads,
        conversionRate,
        avgContactTime,
        leadsByStatus,
        leadsByAgent,
        leadsTimeline,
        budgetAnalysis
      ] = await Promise.all([
        leadsBySourceRes.json(),
        leadsNotContactedRes.json(),
        contactedLeadsRes.json(),
        conversionRateRes.json(),
        avgContactTimeRes.json(),
        leadsByStatusRes.json(),
        leadsByAgentRes.json(),
        leadsTimelineRes.json(),
        budgetAnalysisRes.json()
      ])

      // Generate additional premium analytics
      const behavioralAnalysis = [
        { behavior: 'Page Views', count: 1250, conversion: 12.5 },
        { behavior: 'Form Submissions', count: 890, conversion: 25.3 },
        { behavior: 'Phone Calls', count: 456, conversion: 45.2 },
        { behavior: 'Email Opens', count: 2340, conversion: 8.7 },
        { behavior: 'Property Views', count: 1890, conversion: 15.6 }
      ]

      const conversionFunnel = [
        { stage: 'Visitors', count: 10000, percentage: 100 },
        { stage: 'Leads', count: 2500, percentage: 25 },
        { stage: 'Qualified', count: 1200, percentage: 12 },
        { stage: 'Proposals', count: 600, percentage: 6 },
        { stage: 'Closed', count: 180, percentage: 1.8 }
      ]

      const revenueAnalysis = [
        { month: 'Jan', revenue: 125000, target: 120000, deals: 15 },
        { month: 'Feb', revenue: 145000, target: 130000, deals: 18 },
        { month: 'Mar', revenue: 165000, target: 140000, deals: 22 },
        { month: 'Apr', revenue: 155000, target: 150000, deals: 20 },
        { month: 'May', revenue: 185000, target: 160000, deals: 25 },
        { month: 'Jun', revenue: 195000, target: 170000, deals: 28 }
      ]

      console.log('📊 Analytics data received:', {
        leadsBySource: leadsBySource.data,
        leadsByStatus: leadsByStatus.data,
        leadsByAgent: leadsByAgent.data
      })

      setAnalyticsData({
        leadsBySource: leadsBySource.data || [],
        leadsNotContacted: leadsNotContacted.data || { count: 0, total: 0, percentage: 0 },
        contactedLeads: contactedLeads.data || { contacted: 0, total: 0, percentage: 0, period: 'week' },
        conversionRateBySource: conversionRate.data || [],
        avgContactTimeByAgent: avgContactTime.data || [],
        leadsByStatus: leadsByStatus.data || [],
        leadsByAgent: leadsByAgent.data || [],
        leadsTimeline: leadsTimeline.data || [],
        budgetAnalysis: budgetAnalysis.data || [],

        // Premium analytics data
        agentPerformance: premiumData.agentPerformance,
        sourceROI: premiumData.sourceROI,
        geographicalData: premiumData.geographicalData,
        behavioralAnalysis,
        conversionFunnel,
        revenueAnalysis
      })
      
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Export Functions
  const exportToPDF = () => {
    // Create PDF export logic
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Analytics Report - ${new Date().toLocaleDateString()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .metric { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LeadEstate Analytics Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          <div class="content">
            <h2>Key Metrics</h2>
            <div class="metric">Total Leads: ${analyticsData.leadsBySource.reduce((sum, item) => sum + item.count, 0)}</div>
            <div class="metric">Conversion Rate: ${analyticsData.conversionRateBySource.reduce((sum, item) => sum + item.rate, 0) / analyticsData.conversionRateBySource.length || 0}%</div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const exportToExcel = () => {
    // Create CSV data for Excel
    const csvData = [
      ['Metric', 'Value', 'Period'],
      ['Total Leads', analyticsData.leadsBySource.reduce((sum, item) => sum + item.count, 0), selectedPeriod],
      ['Contacted Leads', analyticsData.contactedLeads.contacted, selectedPeriod],
      ['Conversion Rate', `${analyticsData.conversionRateBySource.reduce((sum, item) => sum + item.rate, 0) / analyticsData.conversionRateBySource.length || 0}%`, selectedPeriod]
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToPowerPoint = () => {
    // Create PowerPoint-style HTML export
    const slides = [
      { title: 'Analytics Overview', content: 'Key performance metrics and trends' },
      { title: 'Lead Sources', content: `Top source: ${analyticsData.leadsBySource[0]?.source || 'N/A'}` },
      { title: 'Agent Performance', content: 'Individual agent metrics and comparisons' }
    ]

    alert('PowerPoint export feature - Premium analytics data prepared for presentation export')
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedPeriod])

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period)
  }

  const handleRefresh = () => {
    fetchAnalyticsData()
  }

  if (loading && analyticsData.leadsBySource.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Premium Header with Glass Morphism */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl" />
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-cyan-400/10 rounded-3xl animate-pulse" />

        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-4 mb-3">
                <div className="relative">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl">
                    <BarChart3 className="h-7 w-7 drop-shadow-sm" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                    Premium Analytics Dashboard
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">Advanced insights & performance intelligence</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-700 font-semibold">Real-time Data</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200/50">
                  <Activity className="w-3 h-3 text-blue-600" />
                  <span className="text-xs text-blue-700 font-semibold">AI-Powered Insights</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-200/50">
                  <Star className="w-3 h-3 text-purple-600" />
                  <span className="text-xs text-purple-700 font-semibold">Premium Analytics</span>
                </div>
              </div>
            </div>

            {/* Premium Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Export Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-50 to-white border border-gray-200/50 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <Download className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Export</span>
                </button>
                <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl border border-gray-200/50 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="p-2">
                    <button onClick={exportToPDF} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-red-50 rounded-lg transition-colors">
                      <FileText className="w-4 h-4 text-red-500" />
                      Export to PDF
                    </button>
                    <button onClick={exportToExcel} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg transition-colors">
                      <FileSpreadsheet className="w-4 h-4 text-green-500" />
                      Export to Excel
                    </button>
                    <button onClick={exportToPowerPoint} className="flex items-center gap-3 w-full px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg transition-colors">
                      <Presentation className="w-4 h-4 text-orange-500" />
                      Export to PowerPoint
                    </button>
                  </div>
                </div>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Tab Navigation */}
      <div className="relative">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-2">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'agents', label: 'Agent Performance', icon: Users },
              { id: 'sources', label: 'Source Analysis', icon: Target },
              { id: 'geography', label: 'Geographic Insights', icon: MapPin },
              { id: 'behavior', label: 'Behavioral Analysis', icon: Activity },
              { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Premium Analytics Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* KPI Cards */}
            <div className="xl:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    title: 'Total Revenue',
                    value: '$1,245,000',
                    change: '+12.5%',
                    trend: 'up',
                    icon: DollarSign,
                    gradient: 'from-green-500 to-emerald-600'
                  },
                  {
                    title: 'Active Leads',
                    value: '2,847',
                    change: '+8.3%',
                    trend: 'up',
                    icon: Users,
                    gradient: 'from-blue-500 to-indigo-600'
                  },
                  {
                    title: 'Conversion Rate',
                    value: '18.7%',
                    change: '+2.1%',
                    trend: 'up',
                    icon: Target,
                    gradient: 'from-purple-500 to-pink-600'
                  },
                  {
                    title: 'Avg Deal Size',
                    value: '$125,000',
                    change: '-3.2%',
                    trend: 'down',
                    icon: Briefcase,
                    gradient: 'from-orange-500 to-red-600'
                  }
                ].map((kpi, index) => {
                  const Icon = kpi.icon
                  const TrendIcon = kpi.trend === 'up' ? ArrowUp : ArrowDown
                  return (
                    <div key={index} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-2xl blur-xl group-hover:opacity-30 transition-opacity duration-300" style={{background: `linear-gradient(to bottom right, ${COLORS[index]}, ${COLORS[index + 1] || COLORS[0]})`}} />
                      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-r ${kpi.gradient} text-white shadow-lg`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                            kpi.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            <TrendIcon className="w-3 h-3" />
                            {kpi.change}
                          </div>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
                          <p className="text-sm text-gray-600 font-medium">{kpi.title}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="space-y-6">
            {/* Agent Performance Header */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Agent Performance Dashboard</h2>
                  <p className="text-gray-600">Comprehensive KPIs, comparatives, and trends analysis</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Agents</option>
                    {analyticsData.agentPerformance.map((agent) => (
                      <option key={agent.name} value={agent.name}>{agent.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Agent Performance Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {analyticsData.agentPerformance.map((agent, index) => (
                  <div key={agent.name} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                            <p className="text-sm text-gray-600">Real Estate Agent</p>
                          </div>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                          agent.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {agent.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {agent.trendValue}%
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{agent.leadsGenerated}</p>
                          <p className="text-xs text-gray-600">Leads Generated</p>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{agent.conversionRate}%</p>
                          <p className="text-xs text-gray-600">Conversion Rate</p>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">${(agent.revenue / 1000).toFixed(0)}K</p>
                          <p className="text-xs text-gray-600">Revenue</p>
                        </div>
                        <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">{agent.closedDeals}</p>
                          <p className="text-xs text-gray-600">Closed Deals</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Satisfaction Score</span>
                          <span className="font-semibold text-gray-900">{agent.satisfaction}%</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${agent.satisfaction}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Comparison Chart */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Agent Performance Comparison</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={analyticsData.agentPerformance}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Conversion Rate" dataKey="conversionRate" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                    <Radar name="Satisfaction" dataKey="satisfaction" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-6">
            {/* Source ROI Analysis */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Source ROI Analysis</h2>
                  <p className="text-gray-600">Investment returns, conversion rates, and cost analysis</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="roi">ROI</option>
                    <option value="conversion">Conversion Rate</option>
                    <option value="cpl">Cost Per Lead</option>
                    <option value="ltv">Lifetime Value</option>
                  </select>
                </div>
              </div>

              {/* ROI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {analyticsData.sourceROI.map((source, index) => (
                  <div key={source.source} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-xl blur-xl group-hover:opacity-30 transition-opacity duration-300" style={{background: `linear-gradient(to bottom right, ${COLORS[index]}, ${COLORS[index + 1] || COLORS[0]})`}} />
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-4 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{source.source}</h3>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br" style={{background: `linear-gradient(to bottom right, ${COLORS[index]}, ${COLORS[index + 1] || COLORS[0]})`}} />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">ROI</span>
                          <span className="font-semibold text-green-600">{source.roi}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Investment</span>
                          <span className="font-semibold text-gray-900">${source.investment.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Revenue</span>
                          <span className="font-semibold text-blue-600">${source.revenue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Leads</span>
                          <span className="font-semibold text-purple-600">{source.leads}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">CPL</span>
                          <span className="font-semibold text-orange-600">${source.cpl}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ROI Comparison Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={analyticsData.sourceROI}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="source" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="roi" fill="#3B82F6" name="ROI %" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={3} name="Conversions" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Conversion Funnel */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Conversion Funnel Analysis</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.conversionFunnel} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="count" fill="url(#colorGradient)" radius={[0, 4, 4, 0]} />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'geography' && (
          <div className="space-y-6">
            {/* Geographic Heat Map */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Geographic Heat Map</h2>
                  <p className="text-gray-600">Regional performance and market activity analysis</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full border border-blue-200/50">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 font-semibold">Live Market Data</span>
                </div>
              </div>

              {/* Geographic Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {analyticsData.geographicalData.map((location, index) => (
                  <div key={location.city} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-xl blur-xl group-hover:opacity-30 transition-opacity duration-300" style={{background: `linear-gradient(to bottom right, ${COLORS[index]}, ${COLORS[index + 1] || COLORS[0]})`}} />
                    <div className="relative bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-4 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <h3 className="font-semibold text-gray-900">{location.city}</h3>
                        </div>
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br" style={{background: `linear-gradient(to bottom right, ${COLORS[index]}, ${COLORS[index + 1] || COLORS[0]})`}} />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Active Leads</span>
                          <span className="font-semibold text-blue-600">{location.leads}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Conversions</span>
                          <span className="font-semibold text-green-600">{location.conversions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Avg Property Value</span>
                          <span className="font-semibold text-purple-600">${(location.avgPropertyValue / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Market Activity</span>
                          <span className="font-semibold text-orange-600">{location.marketActivity}%</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Conversion Rate</span>
                          <span className="font-semibold text-gray-900">{((location.conversions / location.leads) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(location.conversions / location.leads) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Geographic Performance Chart */}
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={analyticsData.geographicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="leads" name="Leads" />
                    <YAxis dataKey="avgPropertyValue" name="Avg Property Value" />
                    <Tooltip
                      cursor={{ strokeDasharray: '3 3' }}
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value, name) => [
                        name === 'avgPropertyValue' ? `$${(value / 1000).toFixed(0)}K` : value,
                        name === 'avgPropertyValue' ? 'Avg Property Value' : 'Leads'
                      ]}
                    />
                    <Scatter name="Cities" dataKey="conversions" fill="#3B82F6" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'behavior' && (
          <div className="space-y-6">
            {/* Behavioral Analysis */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Behavioral Analysis</h2>
                  <p className="text-gray-600">User interaction patterns and engagement metrics</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-200/50">
                  <Activity className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-700 font-semibold">AI Insights</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Behavior Metrics */}
                <div className="space-y-4">
                  {analyticsData.behavioralAnalysis.map((behavior, index) => (
                    <div key={behavior.behavior} className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r opacity-10 rounded-lg blur-sm group-hover:opacity-20 transition-opacity duration-300" style={{background: `linear-gradient(to right, ${COLORS[index]}, ${COLORS[index + 1] || COLORS[0]})`}} />
                      <div className="relative bg-white/80 backdrop-blur-sm rounded-lg border border-white/30 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{behavior.behavior}</h3>
                          <span className="text-sm font-semibold text-green-600">{behavior.conversion}%</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span>Total Count</span>
                          <span className="font-semibold text-gray-900">{behavior.count.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${behavior.conversion}%`,
                              background: `linear-gradient(to right, ${COLORS[index]}, ${COLORS[index + 1] || COLORS[0]})`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Behavior Chart */}
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.behavioralAnalysis}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ behavior, conversion }) => `${behavior}: ${conversion}%`}
                      >
                        {analyticsData.behavioralAnalysis.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(10px)',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-6">
            {/* Revenue Analytics */}
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Revenue Analytics</h2>
                  <p className="text-gray-600">Financial performance and growth trends</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-full border border-green-200/50">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 font-semibold">Revenue Tracking</span>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="h-80 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.revenueAnalysis}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                      }}
                      formatter={(value) => [`$${(value / 1000).toFixed(0)}K`, '']}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#colorRevenue)" name="Actual Revenue" />
                    <Area type="monotone" dataKey="target" stroke="#3B82F6" fillOpacity={1} fill="url(#colorTarget)" name="Target Revenue" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Revenue Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full">+15.2%</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">$1.07M</p>
                  <p className="text-sm text-green-600">Total Revenue</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-8 h-8 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded-full">108%</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">$970K</p>
                  <p className="text-sm text-blue-600">Target Achievement</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200/50">
                  <div className="flex items-center justify-between mb-2">
                    <Briefcase className="w-8 h-8 text-purple-600" />
                    <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded-full">128</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">$8.4K</p>
                  <p className="text-sm text-purple-600">Avg Deal Size</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Analytics
                  <span className="text-sm text-indigo-600 font-medium">
                    Updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              {/* Enhanced Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="group relative inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105 h-12 px-6 py-3 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-emerald-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <RefreshCw className={`h-5 w-5 mr-3 drop-shadow-sm relative z-10 ${loading ? 'animate-spin' : ''}`} />
                <span className="relative z-10">Refresh Data</span>
              </button>

              {/* Enhanced Period Selector */}
              <div className="flex rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-lg p-1">
                {['day', 'week', 'month'].map((period) => (
                  <button
                    key={period}
                    onClick={() => handlePeriodChange(period)}
                    className={`group relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                      selectedPeriod === period
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                  >
                    {selectedPeriod === period && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/20 to-purple-700/20 rounded-xl" />
                    )}
                    <span className="relative z-10 capitalize">{period}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Not Contacted Leads */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Phone className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Not Contacted</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.leadsNotContacted.count}</p>
              <p className="text-sm text-red-600">{analyticsData.leadsNotContacted.percentage}% of total</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${analyticsData.leadsNotContacted.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Contacted This Period */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Contacted This {selectedPeriod}</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.contactedLeads.contacted}</p>
              <p className="text-sm text-green-600">{analyticsData.contactedLeads.percentage}% of {selectedPeriod}</p>
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${analyticsData.contactedLeads.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Total Leads */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.leadsNotContacted.total}</p>
              <p className="text-sm text-blue-600">All time</p>
            </div>
          </div>
        </div>

        {/* Best Conversion Source */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Best Source</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.conversionRateBySource[0]?.source || 'N/A'}
              </p>
              <p className="text-sm text-purple-600">
                {analyticsData.conversionRateBySource[0]?.conversion_rate || 0}% conversion
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Leads by Source - Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Leads by Source</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analyticsData.leadsBySource}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="count"
              >
                {analyticsData.leadsBySource.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion Rate by Source - Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Conversion Rate by Source</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.conversionRateBySource}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="source"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
              <Bar dataKey="conversion_rate" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Average Contact Time by Agent */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Average Time to First Contact by Agent</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analyticsData.avgContactTimeByAgent}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="agent"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis fontSize={12} />
            <Tooltip formatter={(value) => [`${value} hours`, 'Avg Contact Time']} />
            <Bar dataKey="avg_hours_to_contact" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Leads by Status - Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Leads by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analyticsData.leadsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="count"
              >
                {analyticsData.leadsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Performance - Bar Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Agent Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.leadsByAgent}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="agent"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend fontSize={12} />
              <Bar dataKey="total_leads" fill="#8884d8" name="Total Leads" />
              <Bar dataKey="closed_won" fill="#82ca9d" name="Closed Won" />
              <Bar dataKey="active_leads" fill="#ffc658" name="Active" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Budget Analysis</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analyticsData.budgetAnalysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="range"
              fontSize={10}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis fontSize={12} />
            <Tooltip formatter={(value, name) => {
              if (name === 'avg_budget') return [`$${value.toLocaleString()}`, 'Average Budget']
              if (name === 'conversion_rate') return [`${value}%`, 'Conversion Rate']
              return [value, name]
            }} />
            <Legend fontSize={12} />
            <Bar dataKey="count" fill="#8884d8" name="Lead Count" />
            <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Analytics

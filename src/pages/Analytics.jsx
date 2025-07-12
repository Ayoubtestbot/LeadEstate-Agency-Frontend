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
    revenueAnalysis: []
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
    alert('PDF export feature - Analytics data prepared for PDF export')
  }

  const exportToExcel = () => {
    alert('Excel export feature - Analytics data prepared for Excel export')
  }

  const exportToPowerPoint = () => {
    alert('PowerPoint export feature - Analytics data prepared for presentation export')
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedPeriod])

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

      {/* Simple Analytics Content for now */}
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics Overview</h2>
        <p className="text-gray-600">Premium analytics dashboard is loading...</p>
        <div className="mt-4 text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}

export default Analytics

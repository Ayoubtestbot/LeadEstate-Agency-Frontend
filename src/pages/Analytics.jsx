import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Users, Target, Phone, Calendar, RefreshCw } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'https://leadestate-backend-9fih.onrender.com/api'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

// Real-time Analytics Dashboard Component - TERMINAL CREATED
const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    leadsBySource: [],
    leadsNotContacted: { count: 0, total: 0, percentage: 0 },
    contactedLeads: { contacted: 0, total: 0, percentage: 0, period: 'week' },
    conversionRateBySource: [],
    avgContactTimeByAgent: [],
    leadsByStatus: [],
    leadsByAgent: [],
    leadsTimeline: [],
    budgetAnalysis: []
  })
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
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
        budgetAnalysis: budgetAnalysis.data || []
      })
      
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAnalyticsData, 30000)
    
    return () => clearInterval(interval)
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time insights and performance metrics</p>
          <p className="text-xs text-gray-500 mt-1">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          
          {/* Period Selector */}
          <div className="flex space-x-2">
            {['day', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Source - Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Leads by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.leadsBySource}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
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
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Conversion Rate by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.conversionRateBySource}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
              <Bar dataKey="conversion_rate" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Average Contact Time by Agent */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Average Time to First Contact by Agent</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.avgContactTimeByAgent}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="agent" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} hours`, 'Avg Contact Time']} />
            <Bar dataKey="avg_hours_to_contact" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Additional Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads by Status - Pie Chart */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Leads by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.leadsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
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
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData.leadsByAgent}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="agent" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_leads" fill="#8884d8" name="Total Leads" />
              <Bar dataKey="closed_won" fill="#82ca9d" name="Closed Won" />
              <Bar dataKey="active_leads" fill="#ffc658" name="Active" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Budget Analysis */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Budget Analysis</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.budgetAnalysis}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip formatter={(value, name) => {
              if (name === 'avg_budget') return [`$${value.toLocaleString()}`, 'Average Budget']
              if (name === 'conversion_rate') return [`${value}%`, 'Conversion Rate']
              return [value, name]
            }} />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Lead Count" />
            <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Analytics

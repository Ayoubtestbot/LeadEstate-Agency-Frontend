import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
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
    avgContactTimeByAgent: []
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
        avgContactTimeRes
      ] = await Promise.all([
        fetch(`${API_URL}/analytics/leads-by-source`),
        fetch(`${API_URL}/analytics/leads-not-contacted`),
        fetch(`${API_URL}/analytics/contacted-leads?period=${selectedPeriod}`),
        fetch(`${API_URL}/analytics/conversion-rate-by-source`),
        fetch(`${API_URL}/analytics/avg-contact-time-by-agent`)
      ])

      const [
        leadsBySource,
        leadsNotContacted,
        contactedLeads,
        conversionRate,
        avgContactTime
      ] = await Promise.all([
        leadsBySourceRes.json(),
        leadsNotContactedRes.json(),
        contactedLeadsRes.json(),
        conversionRateRes.json(),
        avgContactTimeRes.json()
      ])

      setAnalyticsData({
        leadsBySource: leadsBySource.data || [],
        leadsNotContacted: leadsNotContacted.data || { count: 0, total: 0, percentage: 0 },
        contactedLeads: contactedLeads.data || { contacted: 0, total: 0, percentage: 0, period: 'week' },
        conversionRateBySource: conversionRate.data || [],
        avgContactTimeByAgent: avgContactTime.data || []
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

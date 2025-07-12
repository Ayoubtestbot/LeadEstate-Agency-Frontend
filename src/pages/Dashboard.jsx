import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Home,
  TrendingUp,
  DollarSign,
  Plus,
  Eye,
  Clock,
  BarChart3,
  Zap
} from 'lucide-react'
import { useAuth, useData } from '../App'
import { useLanguage } from '../contexts/LanguageContext'
import { useToast } from '../components/Toast'
import AddLeadModal from '../components/AddLeadModal'
import AddPropertyModal from '../components/AddPropertyModal'

const Dashboard = () => {
  const { user } = useAuth()
  const { leads, properties, addLead, addProperty, refreshData } = useData()
  const { showToast } = useToast()
  const { t, language } = useLanguage()
  const navigate = useNavigate()

  // French translations fallback
  const translations = {
    'common.welcomeBack': 'Bon retour',
    'dashboard.subtitle': "Voici ce qui se passe avec votre entreprise immobilière aujourd'hui.",
    'dashboard.closedDeals': 'Affaires conclues',
    'dashboard.quickStats': 'Statistiques rapides',
    'dashboard.thisMonth': 'Ce mois-ci',
    'dashboard.newLeads': 'Nouveaux prospects',
    'dashboard.propertiesListed': 'Propriétés listées',
    'dashboard.latestUpdates': 'Dernières mises à jour',
    'dashboard.recentActivity': 'Activité récente',
    'dashboard.noRecentActivity': 'Aucune activité récente',
    'dashboard.addLead': 'Ajouter un prospect',
    'dashboard.addProperty': 'Ajouter une propriété',
    'dashboard.viewReports': 'Voir les rapports',
    'dashboard.addLeadDescription': 'Ajouter un nouveau prospect à votre pipeline',
    'dashboard.addPropertyDescription': 'Lister une nouvelle propriété',
    'dashboard.analyzePerformance': 'Analyser vos performances',
    'dashboard.closeDeal': 'Conclure une affaire',
    'dashboard.markLeadClosed': 'Marquer un prospect comme fermé',
    'dashboard.activityWillAppear': "L'activité apparaîtra ici lorsque vous utiliserez le CRM"
  }

  // Smart translation function
  const getText = (key, fallback = '') => {
    if (language === 'fr') {
      return translations[key] || fallback || key
    }
    return fallback || key
  }
  const [showAddLead, setShowAddLead] = useState(false)
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [stats, setStats] = useState({
    totalLeads: 0,
    availableProperties: 0,
    conversionRate: 0,
    closedWonLeads: 0
  })
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [recentActivity, setRecentActivity] = useState([])

  // Calculate initial stats when component mounts
  useEffect(() => {
    setLoading(false)
  }, [])

  // Generate recent activity from leads and properties data
  useEffect(() => {
    const activities = []

    // Get recent leads (last 3)
    const recentLeads = [...(leads || [])].sort((a, b) =>
      new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0)
    ).slice(0, 3)

    recentLeads.forEach(lead => {
      activities.push({
        id: `lead-${lead.id}`,
        type: 'lead_added',
        message: language === 'fr'
          ? `Nouveau prospect: ${lead.name}`
          : `New lead: ${lead.name}`,
        time: lead.created_at || lead.createdAt,
        icon: 'user'
      })
    })

    // Get recent properties (last 2)
    const recentProperties = [...(properties || [])].sort((a, b) =>
      new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0)
    ).slice(0, 2)

    recentProperties.forEach(property => {
      activities.push({
        id: `property-${property.id}`,
        type: 'property_added',
        message: language === 'fr'
          ? `Nouvelle propriété: ${property.title}`
          : `New property: ${property.title}`,
        time: property.created_at || property.createdAt,
        icon: 'home'
      })
    })

    // Sort all activities by time and take the most recent 5
    const sortedActivities = activities
      .filter(activity => activity.time)
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5)

    setRecentActivity(sortedActivities)
  }, [leads, properties, language])

  // Calculate stats directly from local data for instant updates
  useEffect(() => {
    console.log('📊 Dashboard: Data changed, calculating stats from local data...')
    console.log('📊 Current leads:', leads?.length || 0)
    console.log('📊 Current properties:', properties?.length || 0)

    setUpdating(true)

    // Calculate stats directly from the current data
    const calculatedStats = {
      totalLeads: leads?.length || 0,
      availableProperties: properties?.length || 0,
      conversionRate: leads?.length > 0 ?
        ((leads.filter(l => l.status === 'closed_won').length / leads.length) * 100).toFixed(1) : 0,
      closedWonLeads: leads?.filter(l => l.status === 'closed_won').length || 0
    }

    setStats(calculatedStats)
    setUpdating(false)
    console.log('✅ Dashboard stats updated instantly:', calculatedStats)
  }, [leads, properties])

  // Removed fetchDashboardStats - now calculating directly from local data for instant updates

  const handleAddLead = (leadData) => {
    const newLead = addLead(leadData)
    showToast(`Lead "${leadData.name}" added successfully!`, 'success')
  }

  const handleAddProperty = (propertyData) => {
    const newProperty = addProperty(propertyData)
    showToast(`Property "${propertyData.title}" added successfully!`, 'success')
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl" />

        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                  {getText('common.welcomeBack', 'Welcome back')}, {user?.name}!
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {getText('dashboard.subtitle', "Here's what's happening with your real estate business today.")}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="text-xs text-gray-500">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <div className="text-xs text-blue-600 font-medium">Live Dashboard</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => alert('Reports functionality coming soon!')}
                className="group relative inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:pointer-events-none disabled:opacity-50 border border-gray-200/50 bg-white/80 text-gray-700 shadow-md hover:shadow-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 h-10 px-4 py-2 w-full sm:w-auto backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/0 to-blue-500/0 group-hover:from-gray-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-300" />
                <Eye className="h-4 w-4 mr-2 text-gray-500 group-hover:text-blue-600 transition-colors duration-300 drop-shadow-sm" />
                <span className="hidden sm:inline relative z-10">{t('dashboard.viewReports') || 'View Reports'}</span>
                <span className="sm:hidden relative z-10">{t('dashboard.reports') || 'Reports'}</span>
              </button>

              <button
                onClick={() => setShowAddLead(true)}
                className="group relative inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg h-10 px-4 py-2 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 to-purple-700/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Plus className="h-4 w-4 mr-2 drop-shadow-sm relative z-10" />
                <span className="hidden sm:inline relative z-10">{t('dashboard.addLead') || 'Add Lead'}</span>
                <span className="sm:hidden relative z-10">{t('common.add') || 'Add'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads Card */}
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-600 truncate mb-2">{t('dashboard.totalLeads')}</p>
                <p className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent transition-opacity duration-300 ${updating ? 'opacity-50' : 'opacity-100'}`}>
                  {stats?.totalLeads || 0}
                  {updating && <span className="ml-2 text-sm text-blue-500 animate-spin">↻</span>}
                </p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2" />
                  <span className="text-xs text-blue-600 font-medium">Live Data</span>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Users className="h-6 w-6 lg:h-8 lg:w-8 drop-shadow-sm" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Card */}
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-600 truncate mb-2">{t('dashboard.properties')}</p>
                <p className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  {stats?.availableProperties || 0}
                </p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                  <span className="text-xs text-green-600 font-medium">Active Listings</span>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Home className="h-6 w-6 lg:h-8 lg:w-8 drop-shadow-sm" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Rate Card */}
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-600 truncate mb-2">{t('dashboard.conversionRate')}</p>
                <p className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                  {stats?.conversionRate || 0}%
                </p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse mr-2" />
                  <span className="text-xs text-purple-600 font-medium">Success Rate</span>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <TrendingUp className="h-6 w-6 lg:h-8 lg:w-8 drop-shadow-sm" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closed Deals Card */}
        <div className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-6 lg:p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-600 truncate mb-2">{getText('dashboard.closedDeals', 'Closed Deals')}</p>
                <p className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                  {stats?.closedWonLeads || 0}
                </p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse mr-2" />
                  <span className="text-xs text-orange-600 font-medium">Won Deals</span>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="relative p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <DollarSign className="h-6 w-6 lg:h-8 lg:w-8 drop-shadow-sm" />
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Enhanced Recent Activity */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl" />
          <div className="relative">
            <div className="flex flex-col space-y-2 p-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {language === 'fr' ? 'Activité récente' : 'Recent Activity'}
                </h3>
              </div>
              <p className="text-sm text-gray-600 ml-12">
                {language === 'fr' ? 'Dernières mises à jour' : 'Latest updates'}
              </p>
            </div>

            <div className="px-8 pb-8">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="group relative">
                      <div className="flex items-start space-x-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50/50 to-blue-50/50 hover:from-blue-50 hover:to-purple-50 transition-all duration-300 hover:shadow-md">
                        <div className="flex-shrink-0">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-lg ${
                            activity.icon === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                              : 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          }`}>
                            {activity.icon === 'user' ? (
                              <Users className="h-5 w-5 drop-shadow-sm" />
                            ) : (
                              <Home className="h-5 w-5 drop-shadow-sm" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-1">{activity.message}</p>
                          <div className="flex items-center space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                            <p className="text-xs text-gray-500 font-medium">
                              {activity.time ? new Date(activity.time).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              }) : ''}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="relative mx-auto mb-6">
                    <div className="h-16 w-16 mx-auto bg-gradient-to-r from-gray-100 to-blue-100 rounded-2xl flex items-center justify-center shadow-lg">
                      <Users className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Clock className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <p className="text-base font-medium text-gray-600 mb-2">
                    {language === 'fr' ? 'Aucune activité récente' : 'No recent activity'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {language === 'fr' ? "L'activité apparaîtra ici lorsque vous utiliserez le CRM" : 'Activity will appear here as you use the CRM'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-3xl" />
          <div className="relative">
            <div className="flex flex-col space-y-2 p-8">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {getText('dashboard.quickStats', 'Quick Stats')}
                </h3>
              </div>
              <p className="text-sm text-gray-600 ml-12">
                {getText('dashboard.thisMonth', 'This month')}
              </p>
            </div>

            <div className="px-8 pb-8">
              <div className="space-y-4">
                <div className="group flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-blue-50/50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">{getText('dashboard.newLeads', 'New Leads')}</span>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {stats?.totalLeads || 0}
                  </span>
                </div>

                <div className="group flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-green-50/50 to-green-100/50 hover:from-green-100 hover:to-green-200 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">{getText('dashboard.propertiesListed', 'Properties Listed')}</span>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                    {stats?.availableProperties || 0}
                  </span>
                </div>

                <div className="group flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-orange-50/50 to-orange-100/50 hover:from-orange-100 hover:to-orange-200 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">{getText('dashboard.closedDeals', 'Closed Deals')}</span>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                    {stats?.closedWonLeads || 0}
                  </span>
                </div>

                <div className="group flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-purple-50/50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200 transition-all duration-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-gray-700">{t('dashboard.conversionRate') || 'Conversion Rate'}</span>
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    {stats?.conversionRate || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Quick Actions */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl" />
        <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl p-8">
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Quick Actions
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => setShowAddLead(true)}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-6 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Users className="h-6 w-6 drop-shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-base mb-2">{getText('dashboard.addLead', 'Add Lead')}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{getText('dashboard.addLeadDescription', 'Add a new lead to your pipeline')}</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowAddProperty(true)}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-6 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Home className="h-6 w-6 drop-shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-base mb-2">{getText('dashboard.addProperty', 'Add Property')}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{getText('dashboard.addPropertyDescription', 'List a new property')}</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-6 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <TrendingUp className="h-6 w-6 drop-shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-base mb-2">{getText('dashboard.viewReports', 'View Reports')}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{getText('dashboard.analyzePerformance', 'Analyze your performance')}</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/leads')}
              className="group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 p-6 text-left"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <DollarSign className="h-6 w-6 drop-shadow-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-base mb-2">{getText('dashboard.closeDeal', 'Close Deal')}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{getText('dashboard.markLeadClosed', 'Mark a lead as closed')}</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddLeadModal
        isOpen={showAddLead}
        onClose={() => setShowAddLead(false)}
        onSubmit={handleAddLead}
      />

      <AddPropertyModal
        isOpen={showAddProperty}
        onClose={() => setShowAddProperty(false)}
        onSubmit={handleAddProperty}
      />
    </div>
  )
}

export default Dashboard

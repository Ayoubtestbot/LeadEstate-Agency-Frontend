import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Home,
  TrendingUp,
  DollarSign,
  Plus,
  Eye
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
  const { t } = useLanguage()
  const navigate = useNavigate()
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

  // Calculate initial stats when component mounts
  useEffect(() => {
    setLoading(false)
  }, [])

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
            {t('common.welcomeBack') === 'common.welcomeBack' ? 'Bon retour' : t('common.welcomeBack')}, {user?.name}!
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            {t('dashboard.subtitle') === 'dashboard.subtitle' ? "Voici ce qui se passe avec votre entreprise immobilière aujourd'hui." : t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={() => alert('Reports functionality coming soon!')}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 h-9 px-4 py-2 w-full sm:w-auto"
          >
            <Eye className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('dashboard.viewReports') || 'View Reports'}</span>
            <span className="sm:hidden">{t('dashboard.reports') || 'Reports'}</span>
          </button>
          <button
            onClick={() => setShowAddLead(true)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('dashboard.addLead') || 'Add Lead'}</span>
            <span className="sm:hidden">{t('common.add') || 'Add'}</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 truncate">{t('dashboard.totalLeads')}</p>
                <p className={`text-xl lg:text-2xl font-bold text-gray-900 mt-1 transition-opacity ${updating ? 'opacity-50' : 'opacity-100'}`}>
                  {stats?.totalLeads || 0}
                  {updating && <span className="ml-2 text-sm text-blue-500">↻</span>}
                </p>
                {/* Real-time data - no mock percentages */}
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="p-2 lg:p-3 rounded-lg bg-blue-100 text-blue-600">
                  <Users className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 truncate">{t('dashboard.properties')}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">{stats?.availableProperties || 0}</p>
                {/* Real-time data - no mock percentages */}
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="p-2 lg:p-3 rounded-lg bg-green-100 text-green-600">
                  <Home className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 truncate">{t('dashboard.conversionRate')}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">{stats?.conversionRate || 0}%</p>
                {/* Real-time data - no mock percentages */}
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="p-2 lg:p-3 rounded-lg bg-purple-100 text-purple-600">
                  <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 truncate">{t('dashboard.closedDeals') === 'dashboard.closedDeals' ? 'Affaires conclues' : t('dashboard.closedDeals')}</p>
                <p className="text-xl lg:text-2xl font-bold text-gray-900 mt-1">{stats?.closedWonLeads || 0}</p>
                {/* Real-time data - no mock percentages */}
              </div>
              <div className="flex-shrink-0 ml-4">
                <div className="p-2 lg:p-3 rounded-lg bg-orange-100 text-orange-600">
                  <DollarSign className="h-5 w-5 lg:h-6 lg:w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col space-y-1.5 p-4 lg:p-6">
            <h3 className="text-lg font-medium text-gray-900">{t('dashboard.recentActivity') || 'Recent Activity'}</h3>
            <p className="text-sm text-gray-500">{t('dashboard.latestUpdates') || 'Latest updates'}</p>
          </div>
          <div className="p-4 lg:p-6 pt-0">
            <div className="text-center py-8">
              <div className="h-12 w-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">{t('dashboard.noRecentActivity') || 'No recent activity'}</p>
              <p className="text-xs text-gray-400 mt-1">{t('dashboard.activityWillAppear') || 'Activity will appear here as you use the CRM'}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-col space-y-1.5 p-4 lg:p-6">
            <h3 className="text-lg font-medium text-gray-900">{t('dashboard.quickStats') === 'dashboard.quickStats' ? 'Statistiques rapides' : t('dashboard.quickStats')}</h3>
            <p className="text-sm text-gray-500">{t('dashboard.thisMonth') === 'dashboard.thisMonth' ? 'Ce mois-ci' : t('dashboard.thisMonth')}</p>
          </div>
          <div className="p-4 lg:p-6 pt-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('dashboard.newLeads') === 'dashboard.newLeads' ? 'Nouveaux prospects' : t('dashboard.newLeads')}</span>
                <span className="text-sm font-medium text-gray-900">{stats?.totalLeads || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('dashboard.propertiesListed') === 'dashboard.propertiesListed' ? 'Propriétés listées' : t('dashboard.propertiesListed')}</span>
                <span className="text-sm font-medium text-gray-900">{stats?.availableProperties || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('dashboard.closedDeals') === 'dashboard.closedDeals' ? 'Affaires conclues' : t('dashboard.closedDeals')}</span>
                <span className="text-sm font-medium text-gray-900">{stats?.closedWonLeads || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('dashboard.conversionRate') || 'Conversion Rate'}</span>
                <span className="text-sm font-medium text-gray-900">{stats?.conversionRate || 0}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setShowAddLead(true)}
          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 lg:p-6 text-left"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm lg:text-base">{t('dashboard.addLead') || 'New Lead'}</h4>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">{t('dashboard.addLeadDescription') || 'Add a new lead to your pipeline'}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setShowAddProperty(true)}
          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 lg:p-6 text-left"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
              <Home className="h-5 w-5 lg:h-6 lg:w-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm lg:text-base">{t('dashboard.addProperty') || 'Add Property'}</h4>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">{t('dashboard.addPropertyDescription') || 'List a new property'}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/reports')}
          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 lg:p-6 text-left"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm lg:text-base">{t('dashboard.viewReports') || 'View Reports'}</h4>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">{t('dashboard.analyzePerformance') || 'Analyze your performance'}</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => navigate('/leads')}
          className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 lg:p-6 text-left"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 p-2 bg-orange-100 rounded-lg">
              <DollarSign className="h-5 w-5 lg:h-6 lg:w-6 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 text-sm lg:text-base">{t('dashboard.closeDeal') || 'Close Deal'}</h4>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">{t('dashboard.markLeadClosed') || 'Mark a lead as closed'}</p>
            </div>
          </div>
        </button>
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

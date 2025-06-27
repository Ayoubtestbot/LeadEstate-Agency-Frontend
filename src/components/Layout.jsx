import { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../App'
import { usePermissions, PERMISSIONS } from '../contexts/PermissionsContext'
import { useLanguage } from '../contexts/LanguageContext'
import ProtectedComponent from './ProtectedComponent'
import LanguageSelector from './LanguageSelector'
import LanguageToggle from './LanguageToggle'
import {
  LayoutDashboard,
  Users,
  Home,
  Menu,
  LogOut,
  Building2,
  BarChart3,
  Zap,
  Clock,
  UserCheck
} from 'lucide-react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const { hasPermission, hasAnyPermission, roleDisplayName } = usePermissions()
  const { t } = useLanguage()

  // Safe translation function with fallback
  const safeT = (key, fallback) => {
    try {
      if (!t || typeof t !== 'function') {
        return fallback
      }
      const translation = t(key)
      return translation && translation !== key ? translation : fallback
    } catch (error) {
      console.warn('Translation missing for key:', key)
      return fallback
    }
  }

  // Define navigation items with permissions
  const navigationItems = [
    {
      name: safeT('nav.dashboard', 'Dashboard'),
      href: '/dashboard',
      icon: LayoutDashboard,
      permission: PERMISSIONS.VIEW_DASHBOARD
    },
    {
      name: safeT('nav.leads', 'Leads'),
      href: '/leads',
      icon: Users,
      permissions: [PERMISSIONS.VIEW_ALL_LEADS, PERMISSIONS.VIEW_ASSIGNED_LEADS] // Manager/Super Agent OR Agent
    },
    {
      name: safeT('nav.properties', 'Properties'),
      href: '/properties',
      icon: Home,
      permission: PERMISSIONS.VIEW_PROPERTIES
    },
    {
      name: safeT('nav.analytics', 'Analytics'),
      href: '/analytics',
      icon: BarChart3,
      permission: PERMISSIONS.VIEW_ANALYTICS
    },
    {
      name: safeT('nav.automation', 'Automation'),
      href: '/automation',
      icon: Zap,
      permission: PERMISSIONS.MANAGE_AUTOMATION
    },
    {
      name: safeT('nav.followUp', 'Follow-up'),
      href: '/follow-up',
      icon: Clock,
      permission: PERMISSIONS.MANAGE_FOLLOW_UP
    },
    {
      name: safeT('nav.team', 'Team'),
      href: '/team',
      icon: UserCheck,
      permission: PERMISSIONS.VIEW_TEAM
    }
  ]

  // For demo purposes, show all navigation items (bypass permissions)
  const navigation = navigationItems

  // Debug: Log navigation items
  console.log('Navigation items:', navigation.length, navigation.map(item => item.name))

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">RealEstate CRM</span>
            </div>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {roleDisplayName}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100 ${
                    isActive ? 'bg-blue-100 text-blue-700' : ''
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Building2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">RealEstate CRM</span>
            </div>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {roleDisplayName}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${location.pathname === item.href
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }
                `}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Logout */}
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span className="font-medium">{t('common.logout')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{safeT('common.welcomeBack', 'Welcome back')}, {user?.name}!</span>
              <LanguageToggle />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

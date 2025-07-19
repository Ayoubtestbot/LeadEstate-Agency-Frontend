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
  Target,
  Zap,
  Clock,
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Load collapsed state from localStorage
    const saved = localStorage.getItem('sidebarCollapsed')
    return saved ? JSON.parse(saved) : false
  })
  const location = useLocation()
  const { user, logout } = useAuth()
  const { hasPermission, hasAnyPermission, roleDisplayName } = usePermissions()
  const { t } = useLanguage()

  // Toggle sidebar collapsed state and save to localStorage
  const toggleSidebarCollapsed = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
  }

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

  // Filter navigation items based on user permissions
  const navigation = navigationItems.filter(item => {
    if (item.permission) {
      // Single permission check
      return hasPermission(item.permission)
    } else if (item.permissions) {
      // Multiple permissions check (user needs ANY of these permissions)
      return hasAnyPermission(item.permissions)
    }
    // If no permissions specified, show the item
    return true
  })

  // Debug: Log navigation items and user role
  console.log('User role:', user?.role)
  console.log('Available navigation items:', navigation.length, navigation.map(item => item.name))
  console.log('All navigation items:', navigationItems.length, navigationItems.map(item => item.name))

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <div className={`hidden lg:flex ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'} bg-gradient-to-b from-white to-gray-50 shadow-2xl border-r border-gray-200/50 transition-all duration-500 ease-in-out backdrop-blur-sm relative`} style={{ zIndex: 1000 }}>
        <div className="flex flex-col h-full w-full relative">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

          {/* Logo */}
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center px-3' : 'justify-between px-4'} h-20 border-b border-gray-200/50 relative z-10`}>
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="relative flex-shrink-0">
                <Building2 className={`${sidebarCollapsed ? 'h-8 w-8' : 'h-9 w-9'} text-blue-600 flex-shrink-0 drop-shadow-sm transition-all duration-300`} />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
              </div>
              <div className={`flex flex-col transition-all duration-500 overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0 translate-x-4' : 'opacity-100 w-auto translate-x-0 delay-300'}`}>
                <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent whitespace-nowrap">
                  RealEstate CRM
                </span>
                <span className="text-xs text-gray-500 font-medium whitespace-nowrap">Professional Edition</span>
              </div>
            </div>
            {/* Enhanced Collapse toggle button */}
            {!sidebarCollapsed && (
              <button
                onClick={toggleSidebarCollapsed}
                className="group relative p-1.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-md flex-shrink-0"
                title="Collapse sidebar"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ChevronLeft className="h-4 w-4 text-blue-600 relative z-10 transition-transform duration-300 group-hover:-translate-x-0.5" />
              </button>
            )}
          </div>

          {/* Enhanced User info */}
          <div className={`${sidebarCollapsed ? 'px-3' : 'px-4'} py-4 border-b border-gray-200/50 relative z-10`}>
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="relative flex-shrink-0">
                <div className={`${sidebarCollapsed ? 'h-10 w-10' : 'h-11 w-11'} rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg ring-2 ring-blue-100/50 transition-all duration-300`}>
                  <span className={`text-white font-bold ${sidebarCollapsed ? 'text-base' : 'text-lg'} drop-shadow-sm transition-all duration-300`}>
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className={`absolute -bottom-1 -right-1 ${sidebarCollapsed ? 'w-3 h-3' : 'w-4 h-4'} bg-green-500 rounded-full border-2 border-white shadow-sm transition-all duration-300`} />
              </div>
              <div className={`flex-1 min-w-0 transition-all duration-500 overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0 translate-x-4' : 'opacity-100 w-auto translate-x-0 delay-300'}`}>
                <p className="text-base font-semibold text-gray-900 truncate mb-1 whitespace-nowrap">
                  {user?.name}
                </p>
                <div className="flex items-center space-x-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200/50 whitespace-nowrap">
                    {roleDisplayName}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Expand button for collapsed state */}
          {sidebarCollapsed && (
            <div className="px-3 py-3 border-b border-gray-200/50">
              <button
                onClick={toggleSidebarCollapsed}
                className="group relative p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-md w-full flex justify-center"
                title="Expand sidebar"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ChevronRight className="h-4 w-4 text-blue-600 relative z-10 transition-transform duration-300 group-hover:translate-x-0.5" />
              </button>
            </div>
          )}

          {/* Enhanced Navigation */}
          <nav className={`flex-1 ${sidebarCollapsed ? 'px-3' : 'px-4'} py-4 space-y-2 relative z-10`}>
            {navigation.map((item, index) => {
              const isActive = location.pathname === item.href
              const Icon = item.icon

              return (
                <div key={item.name} className="relative group">
                  <Link
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center ${sidebarCollapsed ? 'justify-center px-3 py-3' : 'gap-4 px-4 py-3'} rounded-2xl transition-all duration-300 hover:scale-105 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:shadow-md'
                    }`}
                    title={sidebarCollapsed ? item.name : ''}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl animate-pulse" />
                    )}

                    {/* Icon with enhanced styling */}
                    <div className={`relative ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'} transition-colors duration-300`}>
                      <Icon className="h-6 w-6 flex-shrink-0 drop-shadow-sm" />
                      {isActive && (
                        <div className="absolute inset-0 bg-white/20 rounded-lg animate-ping" />
                      )}
                    </div>

                    <span className={`font-semibold text-sm relative z-10 whitespace-nowrap overflow-hidden ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'} transition-all duration-500 ${sidebarCollapsed ? 'opacity-0 w-0 translate-x-4' : 'opacity-100 w-auto translate-x-0 delay-300'}`}>
                      {item.name}
                    </span>

                    {/* Hover effect */}
                    {!isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300" />
                    )}
                  </Link>

                  {/* Tooltip for collapsed state */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-gray-700" style={{ zIndex: 99999 }}>
                      {item.name}
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Enhanced Logout */}
          <div className={`${sidebarCollapsed ? 'px-3' : 'px-4'} py-4 border-t border-gray-200/50 relative z-10`}>
            <div className="relative group">
              <button
                onClick={logout}
                className={`relative flex items-center w-full ${sidebarCollapsed ? 'justify-center px-3 py-3' : 'px-4 py-3 gap-4'} text-gray-500 hover:text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-md group`}
                title={sidebarCollapsed ? 'Logout' : ''}
              >
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 to-pink-500/0 group-hover:from-red-500/5 group-hover:to-pink-500/5 rounded-2xl transition-all duration-300" />

                <div className="relative text-gray-500 group-hover:text-red-600 transition-colors duration-300">
                  <LogOut className="h-6 w-6 flex-shrink-0 drop-shadow-sm" />
                </div>

                <span className={`font-semibold text-sm text-gray-700 group-hover:text-red-600 transition-all duration-500 relative z-10 whitespace-nowrap overflow-hidden ${sidebarCollapsed ? 'opacity-0 w-0 translate-x-4' : 'opacity-100 w-auto translate-x-0 delay-300'}`}>
                  {safeT('common.logout', 'Logout')}
                </span>
              </button>

              {/* Tooltip for collapsed state */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl border border-gray-700" style={{ zIndex: 99999 }}>
                  {safeT('common.logout', 'Logout')}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              )}
            </div>
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

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
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
                onClick={() => setSidebarOpen(false)}
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
              {safeT('common.logout', 'Logout')}
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
        {/* Enhanced Header */}
        <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden group p-2 rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 hover:from-gray-100 hover:to-blue-100 border border-gray-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-md"
              >
                <Menu className="h-5 w-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-300" />
              </button>

              {/* Enhanced Desktop sidebar toggle button */}
              <button
                onClick={toggleSidebarCollapsed}
                className="hidden lg:block group relative p-2 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-md"
                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Menu className="h-4 w-4 text-blue-600 relative z-10 transition-transform duration-300 group-hover:rotate-180" />
              </button>

              {/* Breadcrumb or page indicator */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <span className="text-gray-400">/</span>
                <span className="font-medium text-gray-700 capitalize">
                  {location.pathname.slice(1) || 'dashboard'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* Enhanced welcome message */}
              <div className="hidden sm:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {safeT('common.welcomeBack', 'Welcome back')}, {user?.name}!
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              </div>

              {/* Enhanced Language Toggle */}
              <div className="relative">
                <LanguageToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="h-full w-full p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

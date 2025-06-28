import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import {
  Home,
  Users,
  Building,
  BarChart3,
  Settings as SettingsIcon,
  UserCheck,
  Menu,
  LogOut,
  Plus,
  Search,
  Filter
} from 'lucide-react'

// Import pages
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Properties from './pages/Properties'
import Team from './pages/Team'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Automation from './pages/Automation'
import FollowUp from './pages/FollowUp'
import Clients from './pages/Clients'
import Tasks from './pages/Tasks'
import Reports from './pages/Reports'
import Profile from './pages/Profile'

// Import components
import Layout from './components/Layout'

// Import contexts
import { LanguageProvider } from './contexts/LanguageContext'
import { PermissionsProvider } from './contexts/PermissionsContext'
import { ToastProvider } from './components/Toast'

// API Configuration - Force correct backend URL
const API_URL = 'https://leadestate-backend-9fih.onrender.com/api'

// Debug API URL
console.log('🔧 Environment VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('🔧 Final API_URL:', API_URL)

// Auth Context
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Data Context for leads and properties
const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

// Data Provider Component
const DataProvider = ({ children }) => {
  const [leads, setLeads] = useState([])
  const [properties, setProperties] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch data from API on component mount
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    console.log('🔄 Fetching all data from API...')
    console.log('🌐 API_URL:', API_URL)
    setLoading(true)
    try {
      const [leadsRes, propertiesRes, teamRes] = await Promise.all([
        fetch(`${API_URL}/leads`).catch((err) => {
          console.error('❌ Error fetching leads:', err)
          return { ok: false }
        }),
        fetch(`${API_URL}/properties`).catch((err) => {
          console.error('❌ Error fetching properties:', err)
          return { ok: false }
        }),
        fetch(`${API_URL}/team`).catch((err) => {
          console.error('❌ Error fetching team:', err)
          return { ok: false }
        })
      ])

      console.log('📊 Leads response status:', leadsRes.status, leadsRes.ok)
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json()
        console.log('✅ Leads data received:', leadsData)
        setLeads(leadsData.data || [])
      } else {
        console.warn('❌ Failed to fetch leads from API, status:', leadsRes.status)
        setLeads([])
      }

      console.log('🏠 Properties response status:', propertiesRes.status, propertiesRes.ok)
      if (propertiesRes.ok) {
        const propertiesData = await propertiesRes.json()
        console.log('✅ Properties data received:', propertiesData)
        setProperties(propertiesData.data || [])
      } else {
        console.warn('❌ Failed to fetch properties from API, status:', propertiesRes.status)
        setProperties([])
      }

      console.log('👥 Team response status:', teamRes.status, teamRes.ok)
      if (teamRes.ok) {
        const teamData = await teamRes.json()
        console.log('✅ Team data received:', teamData)
        setTeamMembers(teamData.data || [])
      } else {
        console.warn('❌ Failed to fetch team members from API, status:', teamRes.status)
        setTeamMembers([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      // Set empty arrays as fallback
      setLeads([])
      setProperties([])
      setTeamMembers([])
    } finally {
      setLoading(false)
    }
  }

  // Refresh data function for real-time updates
  const refreshData = async (skipLoading = true) => {
    console.log('🔄 Refreshing all data...')

    if (!skipLoading) setLoading(true)

    try {
      const [leadsRes, propertiesRes, teamRes] = await Promise.all([
        fetch(`${API_URL}/leads`).catch(() => ({ ok: false })),
        fetch(`${API_URL}/properties`).catch(() => ({ ok: false })),
        fetch(`${API_URL}/team`).catch(() => ({ ok: false }))
      ])

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json()
        setLeads(leadsData.data || [])
      }

      if (propertiesRes.ok) {
        const propertiesData = await propertiesRes.json()
        setProperties(propertiesData.data || [])
      }

      if (teamRes.ok) {
        const teamData = await teamRes.json()
        setTeamMembers(teamData.data || [])
      }

      console.log('✅ Data refreshed successfully')
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      if (!skipLoading) setLoading(false)
    }
  }

  const addLead = async (leadData) => {
    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...leadData,
          assignedTo: leadData.assignedTo || null,
          status: leadData.status || 'new'
        })
      })

      if (response.ok) {
        const result = await response.json()

        // Optimistic update: Update UI immediately and keep it
        setLeads(prev => [...prev, result.data])

        // Check if WhatsApp message was sent automatically
        if (result.whatsapp) {
          if (result.whatsapp.success && result.whatsapp.method === 'twilio') {
            console.log('📱 WhatsApp message sent automatically via Twilio!');
            // Could show a success notification here
          } else if (result.whatsapp.success && result.whatsapp.method === 'url_only') {
            console.log('📱 WhatsApp message prepared (Twilio not configured)');
            // Could offer to open WhatsApp manually
          }
        }

        // No background refresh needed - the optimistic update is reliable
        console.log('✅ Lead added and UI updated immediately')

        return result.data
      } else {
        throw new Error('Failed to add lead')
      }
    } catch (error) {
      console.error('Error adding lead:', error)
      throw error
    }
  }

  const sendWhatsAppWelcome = async (leadId) => {
    try {
      const response = await fetch(`${API_URL}/whatsapp/welcome/${leadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const result = await response.json()
        console.log('📱 WhatsApp welcome message prepared:', result.data)

        // Show notification with WhatsApp link
        if (result.data.whatsappUrl) {
          const shouldOpen = window.confirm(
            `📱 WhatsApp welcome message ready for ${result.data.leadName}!\n\n` +
            `Agent: ${result.data.agent}\n\n` +
            `Click OK to open WhatsApp and send the welcome message.`
          );

          if (shouldOpen) {
            window.open(result.data.whatsappUrl, '_blank');
          }
        }

        return result.data
      } else {
        throw new Error('Failed to prepare WhatsApp message')
      }
    } catch (error) {
      console.error('Error preparing WhatsApp welcome:', error)
      throw error
    }
  }

  const addProperty = async (propertyData) => {
    try {
      const response = await fetch(`${API_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData)
      })

      if (response.ok) {
        const result = await response.json()

        // Optimistic update: Update UI immediately and keep it
        setProperties(prev => [...prev, result.data])

        console.log('✅ Property added and UI updated immediately')

        return result.data
      } else {
        throw new Error('Failed to add property')
      }
    } catch (error) {
      console.error('Error adding property:', error)
      throw error
    }
  }

  const addTeamMember = async (memberData) => {
    try {
      console.log('🔄 Adding team member:', memberData)
      console.log('🌐 API URL:', `${API_URL}/team`)

      const response = await fetch(`${API_URL}/team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData)
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Team member added successfully:', result)

        // Optimistic update: Update UI immediately and keep it
        setTeamMembers(prev => [...prev, result.data])

        return result.data
      } else {
        const errorText = await response.text()
        console.error('❌ API Error:', response.status, errorText)
        throw new Error(`Failed to add team member: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Error adding team member:', error)
      throw error
    }
  }

  const updateTeamMember = async (id, memberData) => {
    try {
      const response = await fetch(`${API_URL}/team/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData)
      })

      if (response.ok) {
        const result = await response.json()

        // Update UI immediately with server response
        setTeamMembers(prev => prev.map(member =>
          member.id === id ? result.data : member
        ))

        console.log('✅ Team member updated successfully:', result.data)
        return result.data
      } else {
        throw new Error('Failed to update team member')
      }
    } catch (error) {
      console.error('Error updating team member:', error)
      // Fallback to local update if API fails
      setTeamMembers(prev => prev.map(member =>
        member.id === id ? { ...member, ...memberData } : member
      ))
      throw error
    }
  }

  const deleteTeamMember = (id) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id))
  }

  const updateLead = async (id, leadData) => {
    try {
      const response = await fetch(`${API_URL}/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
      })

      if (response.ok) {
        const result = await response.json()

        // Optimistic update: Update UI immediately and keep it
        setLeads(prev => prev.map(lead =>
          lead.id === id ? result.data : lead
        ))

        return result.data
      } else {
        throw new Error('Failed to update lead')
      }
    } catch (error) {
      console.error('Error updating lead:', error)
      // Fallback to local update if API fails
      setLeads(prev => prev.map(lead =>
        lead.id === id ? { ...lead, ...leadData } : lead
      ))
    }
  }

  const deleteLead = (id) => {
    setLeads(prev => prev.filter(lead => lead.id !== id))
  }

  const updateProperty = async (id, propertyData) => {
    try {
      const response = await fetch(`${API_URL}/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData)
      })

      if (response.ok) {
        const result = await response.json()

        // Update UI immediately with server response
        setProperties(prev => prev.map(property =>
          property.id === id ? result.data : property
        ))

        console.log('✅ Property updated successfully:', result.data)
        return result.data
      } else {
        throw new Error('Failed to update property')
      }
    } catch (error) {
      console.error('Error updating property:', error)
      // Fallback to local update if API fails
      setProperties(prev => prev.map(property =>
        property.id === id ? { ...property, ...propertyData } : property
      ))
      throw error
    }
  }

  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(property => property.id !== id))
  }

  const linkPropertyToLead = async (leadId, propertyId) => {
    try {
      await updateLead(leadId, { linkedPropertyId: propertyId })
      console.log('✅ Property linked to lead successfully')
    } catch (error) {
      console.error('Error linking property to lead:', error)
      // Fallback to local update if API fails
      setLeads(prev => prev.map(lead =>
        lead.id === leadId ? { ...lead, linkedPropertyId: propertyId } : lead
      ))
    }
  }

  const unlinkPropertyFromLead = async (leadId) => {
    try {
      await updateLead(leadId, { linkedPropertyId: null })
      console.log('✅ Property unlinked from lead successfully')
    } catch (error) {
      console.error('Error unlinking property from lead:', error)
      // Fallback to local update if API fails
      setLeads(prev => prev.map(lead =>
        lead.id === leadId ? { ...lead, linkedPropertyId: null } : lead
      ))
    }
  }

  const clearAllData = () => {
    setLeads([])
    setProperties([])
    setTeamMembers([])
    localStorage.removeItem('leadestate_leads')
    localStorage.removeItem('leadestate_properties')
    localStorage.removeItem('leadestate_team_members')
  }

  const value = {
    leads,
    properties,
    teamMembers,
    loading,
    setLeads,
    setProperties,
    setTeamMembers,
    addLead,
    addProperty,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    updateLead,
    deleteLead,
    updateProperty,
    deleteProperty,
    linkPropertyToLead,
    unlinkPropertyFromLead,
    refreshData
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let token = localStorage.getItem('token')

    // If no token exists, create a demo token for development
    if (!token) {
      token = 'demo-token-' + Date.now()
      localStorage.setItem('token', token)
    }

    // Create a demo user
    setUser({
      firstName: 'Demo User',
      name: 'Demo User',
      role: 'manager',
      email: 'demo@agency.com'
    })

    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
        toast.success('Login successful!')
        return { success: true }
      } else {
        toast.error(data.message || 'Invalid credentials')
        return { success: false, message: data.message }
      }
    } catch (error) {
      toast.error('Login failed')
      return { success: false, message: 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Login Component
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login({ email, password })
    if (result.success) {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">LeadEstate</h2>
          <p className="mt-2 text-sm text-gray-600">Complete Real Estate CRM</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
          <p className="text-center text-sm text-gray-600">
            Demo: admin@demo.com / password
          </p>
        </form>
      </div>
    </div>
  )
}

// Sidebar Component
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Properties', href: '/properties', icon: Building },
    { name: 'Team', href: '/team', icon: UserCheck },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ]

  return (
    <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-40 lg:relative lg:inset-0 lg:block lg:w-64 lg:flex-shrink-0`}>
      <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">LeadEstate</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

// Header Component
const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <button
          type="button"
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">
            Welcome, {user?.firstName || 'User'}
          </span>
          <button
            onClick={logout}
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}



// Rename Settings to avoid conflict with SettingsIcon
const SettingsPage = Settings

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}



// Main App Component
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppWithAuth />
      </LanguageProvider>
    </AuthProvider>
  )
}

// Component that has access to auth context
function AppWithAuth() {
  const { user } = useAuth()

  // Debug: Log user object
  console.log('AppWithAuth user:', user)

  return (
    <PermissionsProvider userRole={user?.role || 'manager'}>
      <ToastProvider>
        <DataProvider>
          <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/leads" element={
                <ProtectedRoute>
                  <Layout>
                    <Leads />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/properties" element={
                <ProtectedRoute>
                  <Layout>
                    <Properties />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/team" element={
                <ProtectedRoute>
                  <Layout>
                    <Team />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Layout>
                    <Analytics />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/automation" element={
                <ProtectedRoute>
                  <Layout>
                    <Automation />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/follow-up" element={
                <ProtectedRoute>
                  <Layout>
                    <FollowUp />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/clients" element={
                <ProtectedRoute>
                  <Layout>
                    <Clients />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <Layout>
                    <Tasks />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </DataProvider>
    </ToastProvider>
    </PermissionsProvider>
  )
}

export default App

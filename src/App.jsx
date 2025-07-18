import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom'
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
import Login from './components/Login'

// Import components
import Layout from './components/Layout'

// Import contexts
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { PermissionsProvider, usePermissions, PERMISSIONS } from './contexts/PermissionsContext'
import { ToastProvider } from './components/Toast'

// API Configuration - Force correct backend URL
const API_URL = 'https://leadestate-backend-9fih.onrender.com/api'

// Debug API URL
console.log('🔧 Environment VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('🔧 Final API_URL:', API_URL)

// Navigation handler to prevent blank pages
const NavigationHandler = ({ children }) => {
  const location = useLocation()

  useEffect(() => {
    // Force page refresh on navigation to prevent blank pages
    const handlePopState = (event) => {
      // Small delay to ensure proper navigation
      setTimeout(() => {
        const mainContent = document.querySelector('#root')
        if (!mainContent || mainContent.innerHTML.trim() === '' || mainContent.children.length === 0) {
          console.log('🔄 Blank page detected, refreshing...')
          window.location.reload()
        }
      }, 100)
    }

    // Listen for browser navigation events
    window.addEventListener('popstate', handlePopState)

    // Cleanup
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [location])

  // Check if page is blank and force refresh
  useEffect(() => {
    const checkPageContent = () => {
      const mainContent = document.querySelector('#root')
      if (!mainContent || mainContent.innerHTML.trim() === '' || mainContent.children.length === 0) {
        console.log('🔄 Blank page detected on route change, refreshing...')
        window.location.reload()
      }
    }

    // Check after a short delay
    const timer = setTimeout(checkPageContent, 500)

    return () => clearTimeout(timer)
  }, [location.pathname])

  return children
}

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

  // PERFORMANCE: Add caching to avoid repeated API calls
  const [dataCache, setDataCache] = useState({
    data: null,
    timestamp: null,
    isValid: false
  })
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

  // Get language context for WhatsApp messages (always call hook)
  const languageContext = useLanguage()
  const language = languageContext?.language || 'en'

  // Fetch data from API on component mount (with debug counter)
  useEffect(() => {
    console.log('🔍 useEffect triggered - fetchAllData called')
    fetchAllData()
  }, [])

  // OPTIMIZED: Load all data with caching + single API call + fallback
  const fetchAllData = async (forceRefresh = false) => {
    console.log('🚀 Starting optimized data loading...')
    console.log('🌐 API_URL:', API_URL)
    console.log('🔄 Force refresh:', forceRefresh)

    // FORCE REFRESH: Clear cache if requested
    if (forceRefresh) {
      console.log('🧹 Force refresh: Clearing all caches...')
      setDataCache({
        data: null,
        timestamp: null,
        isValid: false
      })
      localStorage.removeItem('leadEstate_dataCache')
      sessionStorage.removeItem('leadEstate_dataCache')
    }

    // Check cache first (unless force refresh)
    if (!forceRefresh && dataCache.isValid && dataCache.timestamp) {
      const cacheAge = Date.now() - dataCache.timestamp
      if (cacheAge < CACHE_DURATION) {
        console.log('📦 Using cached data (age:', Math.round(cacheAge / 1000), 'seconds)')
        setLeads(dataCache.data.leads || [])
        setProperties(dataCache.data.properties || [])
        setTeamMembers(dataCache.data.team || [])
        return // Exit early with cached data
      } else {
        console.log('⏰ Cache expired, fetching fresh data...')
      }
    }

    setLoading(true)

    // Add cache busting for force refresh (declare at top level)
    const cacheBuster = forceRefresh ? `?_t=${Date.now()}&force=true` : ''
    console.log('📡 API call with cache buster:', cacheBuster)

    try {

      // PERFORMANCE: Use optimized dashboard endpoint (single API call with parallel queries)
      console.log('🚀 Using high-performance dashboard endpoint...')
      const startTime = Date.now()

      const dashboardRes = await fetch(`${API_URL}/dashboard${cacheBuster}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }).catch((err) => {
        console.error('❌ Error fetching dashboard data:', err)
        return { ok: false }
      })

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json()
        const loadTime = Date.now() - startTime

        console.log(`✅ Dashboard data loaded in ${loadTime}ms (backend: ${dashboardData.performance?.queryTime}ms)`)
        console.log('📊 Dashboard API response:', dashboardData)
        console.log('🔍 Dashboard response keys:', Object.keys(dashboardData))

        // Debug properties specifically
        const dashboardProperties = dashboardData.data?.properties || []
        console.log('🏠 Dashboard properties count:', dashboardProperties.length)
        if (dashboardProperties.length > 0) {
          console.log('🔍 Dashboard first property fields:', Object.keys(dashboardProperties[0]))
          console.log('🔍 Dashboard first property city:', dashboardProperties[0].city)
        }

        // Set all data at once
        setLeads(dashboardData.data?.leads || [])
        setProperties(dashboardProperties)
        setTeamMembers(dashboardData.data?.team || [])

        // PERFORMANCE: Cache the data for future use
        setDataCache({
          data: dashboardData.data,
          timestamp: Date.now(),
          isValid: true
        })

        console.log('📊 High-performance data loaded and cached:', {
          leads: dashboardData.data?.leads?.length || 0,
          properties: dashboardData.data?.properties?.length || 0,
          team: dashboardData.data?.team?.length || 0,
          totalLoadTime: `${loadTime}ms`,
          backendTime: `${dashboardData.performance?.queryTime}ms`,
          performance: '🚀 OPTIMIZED'
        })
        return // Success, exit early
      }

      console.warn('❌ High-performance dashboard endpoint failed, using fallback...')
    } catch (error) {
      console.error('Error with high-performance dashboard endpoint:', error)
    }

    // Fallback: Use parallel individual calls (NO LIMITS)
    try {
      console.log('🔄 Using fallback individual API calls (ALL DATA)...')

      const [leadsRes, propertiesRes, teamRes] = await Promise.all([
        fetch(`${API_URL}/leads${cacheBuster ? '?' + cacheBuster.substring(1) : ''}`).catch((err) => {
          console.error('❌ Error fetching leads:', err)
          return { ok: false }
        }),
        fetch(`${API_URL}/properties${cacheBuster}`).catch((err) => {
          console.error('❌ Error fetching properties:', err)
          return { ok: false }
        }),
        fetch(`${API_URL}/team${cacheBuster ? '?' + cacheBuster.substring(1) : ''}`).catch((err) => {
          console.error('❌ Error fetching team:', err)
          return { ok: false }
        })
      ])

      console.log('📡 Properties API response status:', propertiesRes.status, propertiesRes.ok)

      // Process all responses in parallel
      const [leadsData, propertiesData, teamData] = await Promise.all([
        leadsRes.ok ? leadsRes.json().catch(() => ({ data: [] })) : { data: [] },
        propertiesRes.ok ? propertiesRes.json().catch(() => ({ data: [] })) : { data: [] },
        teamRes.ok ? teamRes.json().catch(() => ({ data: [] })) : { data: [] }
      ])

      console.log('🔍 DEBUGGING API RESPONSES:')
      console.log('📋 Properties API response:', propertiesData)
      console.log('📋 Properties response keys:', Object.keys(propertiesData))

      // Handle different response structures - FIXED to match direct API call
      let finalProperties = []
      if (Array.isArray(propertiesData)) {
        finalProperties = propertiesData
        console.log('✅ Properties: Direct array format')
      } else if (propertiesData.success && propertiesData.data && Array.isArray(propertiesData.data)) {
        finalProperties = propertiesData.data
        console.log('✅ Properties: API success format with data array')
      } else if (propertiesData.data && Array.isArray(propertiesData.data)) {
        finalProperties = propertiesData.data
        console.log('✅ Properties: Nested in data field')
      } else if (propertiesData.properties && Array.isArray(propertiesData.properties)) {
        finalProperties = propertiesData.properties
        console.log('✅ Properties: Nested in properties field')
      } else {
        console.log('❌ Unknown properties response structure:', propertiesData)
        console.log('❌ Available keys:', Object.keys(propertiesData))
        finalProperties = []
      }

      console.log('🏠 Final properties count:', finalProperties.length)
      if (finalProperties.length > 0) {
        console.log('🔍 First property fields:', Object.keys(finalProperties[0]))
        console.log('🔍 First property city:', finalProperties[0].city)
        console.log('🔍 First property image_url:', finalProperties[0].image_url)
      }

      setLeads(leadsData.data || [])
      setProperties(finalProperties)
      setTeamMembers(teamData.data || [])

      // PERFORMANCE: Cache fallback data too
      setDataCache({
        data: {
          leads: leadsData.data || [],
          properties: propertiesData.data || [],
          team: teamData.data || []
        },
        timestamp: Date.now(),
        isValid: true
      })

      console.log('✅ FALLBACK data loaded and cached (ALL DATA):', {
        leads: leadsData.data?.length || 0,
        properties: propertiesData.data?.length || 0,
        team: teamData.data?.length || 0,
        method: '🔄 FALLBACK (Individual API calls)',
        note: 'Dashboard endpoint failed, using individual calls'
      })
    } catch (error) {
      console.error('Error in fallback data loading:', error)
      // Set empty arrays as final fallback
      setLeads([])
      setProperties([])
      setTeamMembers([])
    } finally {
      setLoading(false)
    }
  }

  // REAL-TIME: Smart refresh function - updates data instantly without loading delays
  const refreshData = async (skipLoading = true) => {
    console.log('⚡ Smart refresh: Updating data in background...')
    const startTime = Date.now()

    try {
      // INSTANT UPDATE: Use optimized dashboard endpoint without loading states
      const dashboardResponse = await fetch(`${API_URL}/dashboard?_refresh=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (dashboardResponse.ok) {
        const dashboardData = await dashboardResponse.json()
        const refreshTime = Date.now() - startTime

        console.log(`⚡ Smart refresh completed in ${refreshTime}ms (backend: ${dashboardData.performance?.queryTime}ms)`)

        // Handle properties data structure
        let dashboardProperties = []
        if (dashboardData.data?.properties) {
          dashboardProperties = Array.isArray(dashboardData.data.properties)
            ? dashboardData.data.properties
            : []
        }

        // INSTANT UPDATE: Set all data at once without loading states
        setLeads(dashboardData.data?.leads || [])
        setProperties(dashboardProperties)
        setTeamMembers(dashboardData.data?.team || [])

        // Update cache with fresh data
        setDataCache({
          data: dashboardData.data,
          timestamp: Date.now(),
          isValid: true
        })

        console.log('⚡ Smart refresh successful:', {
          leads: dashboardData.data?.leads?.length || 0,
          properties: dashboardData.data?.properties?.length || 0,
          team: dashboardData.data?.team?.length || 0,
          refreshTime: `${refreshTime}ms`,
          method: '⚡ SMART REFRESH'
        })
        return
      }

      console.warn('❌ Smart refresh failed, using fallback...')
    } catch (error) {
      console.error('Error in smart refresh:', error)
    }

    // Fallback: If smart refresh fails, use regular refresh
    console.log('🔄 Fallback: Using regular refresh method...')
    if (!skipLoading) {
      await fetchAllData(true) // Force refresh, will show loading
    } else {
      // Force refresh without showing loading spinner
      const currentLoading = loading
      await fetchAllData(true)
      setLoading(currentLoading) // Restore previous loading state
    }

    console.log('✅ Data refreshed successfully')
  }

  // INSTANT: Super-fast refresh for real-time updates (no loading, no delays)
  const instantRefresh = async () => {
    console.log('🚀 Instant refresh: Real-time data update...')
    const startTime = Date.now()

    try {
      const response = await fetch(`${API_URL}/dashboard?_instant=${Date.now()}`)

      if (response.ok) {
        const data = await response.json()
        const updateTime = Date.now() - startTime

        // INSTANT UPDATE: No loading states, just update data
        setLeads(data.data?.leads || [])
        setProperties(data.data?.properties || [])
        setTeamMembers(data.data?.team || [])

        // Update cache
        setDataCache({
          data: data.data,
          timestamp: Date.now(),
          isValid: true
        })

        console.log(`🚀 Instant refresh completed in ${updateTime}ms - REAL-TIME UPDATE`)
        return true
      }
    } catch (error) {
      console.error('Instant refresh failed:', error)
    }

    return false
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
          status: leadData.status || 'new',
          language: language || 'en' // Include user's language preference
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
    console.log('🔗 Linking property:', { leadId, propertyId })
    try {
      const response = await fetch(`${API_URL}/leads/${leadId}/link-property/${propertyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('🔗 Link response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Property linked to lead successfully:', result)

        // Update local state with the returned data
        setLeads(prev => prev.map(lead =>
          lead.id === leadId ? {
            ...lead,
            interestedProperties: JSON.parse(result.data.interested_properties || '[]')
          } : lead
        ))
      } else {
        const errorText = await response.text()
        console.error('❌ Link failed with status:', response.status, errorText)
        throw new Error(`Failed to link property: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Error linking property to lead:', error)
      // Fallback to local update if API fails
      console.log('🔄 Using fallback local update')
      setLeads(prev => prev.map(lead => {
        if (lead.id === leadId) {
          const currentProperties = lead.interestedProperties || []
          if (!currentProperties.includes(propertyId)) {
            const updated = { ...lead, interestedProperties: [...currentProperties, propertyId] }
            console.log('🔄 Fallback updated lead:', updated)
            return updated
          }
        }
        return lead
      }))
    }
  }

  const unlinkPropertyFromLead = async (leadId, propertyId) => {
    try {
      const response = await fetch(`${API_URL}/leads/${leadId}/unlink-property/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Property unlinked from lead successfully')

        // Update local state with the returned data
        setLeads(prev => prev.map(lead =>
          lead.id === leadId ? {
            ...lead,
            interestedProperties: JSON.parse(result.data.interested_properties || '[]')
          } : lead
        ))
      } else {
        throw new Error('Failed to unlink property')
      }
    } catch (error) {
      console.error('Error unlinking property from lead:', error)
      // Fallback to local update if API fails
      setLeads(prev => prev.map(lead => {
        if (lead.id === leadId) {
          const currentProperties = lead.interestedProperties || []
          return { ...lead, interestedProperties: currentProperties.filter(id => id !== propertyId) }
        }
        return lead
      }))
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
    refreshData,
    instantRefresh
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
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    console.log('🔄 AuthProvider useEffect - checking stored auth data')
    console.log('🔄 Token exists:', !!token)
    console.log('🔄 User data exists:', !!userData)

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        console.log('🔄 Parsed user from localStorage:', parsedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      }
    } else {
      console.log('🔄 No stored auth data found')
      setUser(null)
    }

    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)

      // Clear any existing user data first
      setUser(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // Handle both object and separate parameters
      const { email, password } = typeof credentials === 'object'
        ? credentials
        : { email: arguments[0], password: arguments[1] }

      console.log('🔐 Attempting login for:', email)
      console.log('🔐 Cleared existing user data')

      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      console.log('🔐 Login response status:', response.status)
      const result = await response.json()
      console.log('🔐 Login response data:', result)

      if (response.ok && result.success) {
        // Handle both response structures: result.user or result.data.user
        const userData = result.data?.user || result.user
        const token = result.data?.token || result.token

        if (!userData || !token) {
          console.error('❌ Invalid response structure:', result)
          return { success: false, message: 'Invalid response from server' }
        }

        // Store new user data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))

        // Update state with new user
        setUser(userData)

        console.log('✅ Login successful for:', userData.name, 'Role:', userData.role)
        console.log('✅ User state updated:', userData)

        return { success: true, user: userData }
      } else {
        console.error('❌ Login failed:', result.message)
        return { success: false, message: result.message || 'Login failed' }
      }
    } catch (error) {
      console.error('❌ Login error:', error)
      return { success: false, message: 'Network error' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }



  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
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

// Protected Route Component with Permission Checking
const ProtectedRoute = ({ children, permission, permissions, requireAll = false }) => {
  const { user, loading } = useAuth()
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Check authentication first
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Check permissions if specified
  if (permission || permissions) {
    let hasAccess = false

    if (permission) {
      hasAccess = hasPermission(permission)
    } else if (permissions) {
      hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions)
    }

    if (!hasAccess) {
      // Redirect to dashboard with error message
      return (
        <Navigate
          to="/dashboard"
          replace
          state={{
            error: 'Access denied. You do not have permission to view this page.',
            from: window.location.pathname
          }}
        />
      )
    }
  }

  return children
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
  const { user, loading } = useAuth()

  // Debug: Log user object with detailed info
  console.log('🔍 AppWithAuth - Current user:', user)
  console.log('🔍 AppWithAuth - User name:', user?.name)
  console.log('🔍 AppWithAuth - User role:', user?.role)
  console.log('🔍 AppWithAuth - User email:', user?.email)
  console.log('🔍 AppWithAuth - Loading:', loading)

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <Login />
  }

  return (
    <PermissionsProvider userRole={user?.role || 'manager'}>
      <ToastProvider>
        <DataProvider>
          <Router>
            <NavigationHandler>
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
                <ProtectedRoute permission={PERMISSIONS.VIEW_TEAM}>
                  <Layout>
                    <Team />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute permission={PERMISSIONS.VIEW_ANALYTICS}>
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
                <ProtectedRoute permission={PERMISSIONS.MANAGE_AUTOMATION}>
                  <Layout>
                    <Automation />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/follow-up" element={
                <ProtectedRoute permission={PERMISSIONS.MANAGE_FOLLOW_UP}>
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

                {/* PERFORMANCE: Performance monitor temporarily disabled due to scope issue */}
              </div>
            </NavigationHandler>
          </Router>
      </DataProvider>
    </ToastProvider>
    </PermissionsProvider>
  )
}

export default App

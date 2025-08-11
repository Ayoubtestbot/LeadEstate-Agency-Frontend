import axios from 'axios'

// Create axios instance with correct backend URL
const api = axios.create({
  baseURL: 'https://leadestate-backend-9fih.onrender.com/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    console.log('🔑 API Request interceptor - Token exists:', !!token)
    console.log('🌐 API Request:', config.method?.toUpperCase(), config.url)

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('✅ Added Authorization header to request')
    } else {
      console.warn('❌ No token found in localStorage')
    }
    return config
  },
  (error) => {
    console.error('❌ Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('❌ API Response error:', error.response?.status, error.config?.url)

    if (error.response?.status === 401) {
      console.warn('🚨 401 Unauthorized - Clearing token and redirecting to login')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
}

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
}

// Leads API
export const leadsAPI = {
  getAll: (params) => api.get('/leads', { params }),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  addNote: (id, note) => api.post(`/leads/${id}/notes`, note),
}

// Properties API
export const propertiesAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getById: (id) => api.get(`/properties/${id}`),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
}

// Reports API
export const reportsAPI = {
  getDashboard: () => api.get('/reports/dashboard'),
  getLeads: (params) => api.get('/reports/leads', { params }),
}

// Integrations API
export const integrationsAPI = {
  getStatus: () => api.get('/integrations/status'),
  testTwilio: (data) => api.post('/integrations/twilio/test', data),
  testBrevo: (data) => api.post('/integrations/brevo/test', data),
  testGoogleSheets: (data) => api.post('/integrations/google-sheets/test', data),
}

export default api

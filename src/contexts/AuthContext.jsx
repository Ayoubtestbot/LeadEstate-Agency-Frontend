import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        loading: true,
        error: null
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        loading: false,
        error: null
      }
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')

      console.log('🔍 AuthContext - Checking authentication on app start')
      console.log('🔑 Token exists:', !!token)
      console.log('👤 User data exists:', !!userData)

      if (token && userData) {
        try {
          const user = JSON.parse(userData)
          console.log('✅ AuthContext - Restoring user session:', user.email)

          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user,
              token
            }
          })
        } catch (error) {
          console.error('❌ AuthContext - Error parsing user data:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } else {
        console.log('❌ AuthContext - No valid session found')
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' })

      // TODO: Replace with actual API call
      const response = await authAPI.login(credentials)

      if (response.success) {
        localStorage.setItem('token', response.token)

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.user, token: response.token }
        })

        toast.success(`Welcome back, ${response.user.name}!`)
        return { success: true }
      } else {
        throw new Error(response.message || 'Invalid credentials')
      }
    } catch (error) {
      const message = error.message || 'Login failed'
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: message
      })
      toast.error(message)
      return { success: false, error: message }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem('token')
      dispatch({ type: 'LOGOUT' })
      toast.success('Logged out successfully')
    }
  }

  const updateUser = (userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData
    })
  }

  const value = {
    user: state.user,
    token: state.token,
    loading: state.loading,
    error: state.error,
    login,
    logout,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

import { useState } from 'react'
import { LogIn, Eye, EyeOff, User, Lock } from 'lucide-react'
import { useAuth } from '../App'

const Login = () => {
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Your actual team member accounts for testing
  const demoAccounts = [
    {
      role: 'Manager',
      name: 'Sophie Moreau',
      email: 'sophie.moreau@leadestate.com',
      password: 'manager123',
      description: 'Full access to all features'
    },
    {
      role: 'Super Agent',
      name: 'Antoine Dubois',
      email: 'antoine.dubois@leadestate.com',
      password: 'superagent123',
      description: 'Can manage leads and view analytics'
    },
    {
      role: 'Agent',
      name: 'Émilie Rousseau',
      email: 'emilie.rousseau@leadestate.com',
      password: 'agent123',
      description: 'Can only view assigned leads'
    },
    {
      role: 'Agent',
      name: 'Julien Martin',
      email: 'julien.martin@leadestate.com',
      password: 'agent123',
      description: 'Can only view assigned leads'
    },
    {
      role: 'Agent',
      name: 'Camille Laurent',
      email: 'camille.laurent@leadestate.com',
      password: 'agent123',
      description: 'Can only view assigned leads'
    },
    {
      role: 'Agent',
      name: 'Ayoub Jada',
      email: 'ayoubjada69@gmail.com',
      password: 'agent123',
      description: 'Can only view assigned leads'
    }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await login(formData)
      if (!result.success) {
        setError(result.message || 'Login failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = (demoAccount) => {
    setFormData({
      email: demoAccount.email,
      password: demoAccount.password
    })
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            LeadEstate Agency
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Test Credentials */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Test Credentials</h4>
          <div className="space-y-2 text-xs">
            {demoAccounts.map((account, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                <div>
                  <span className="font-medium text-gray-700">{account.role}</span>
                  <span className="text-gray-500 ml-2">{account.name}</span>
                </div>
                <button
                  onClick={() => handleDemoLogin(account)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

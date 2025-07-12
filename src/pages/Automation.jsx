import { useState } from 'react'
import { usePermissions, PERMISSIONS } from '../contexts/PermissionsContext'
import { useLanguage } from '../contexts/LanguageContext'
import ProtectedComponent from '../components/ProtectedComponent'
import AddWorkflowModal from '../components/AddWorkflowModal'
import { useToast } from '../components/Toast'
import {
  Zap,
  Plus,
  Play,
  Pause,
  Settings,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Users,
  Target,
  Clock,
  BarChart3,
  Edit,
  Trash2,
  Copy
} from 'lucide-react'

const Automation = () => {
  const { hasPermission } = usePermissions()
  const { showToast } = useToast()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('workflows')
  const [showAddWorkflow, setShowAddWorkflow] = useState(false)
  const [workflows, setWorkflows] = useState([])

  // Handler functions
  const handleAddWorkflow = (workflowData) => {
    const newWorkflow = {
      id: Date.now(),
      ...workflowData,
      trigger: 'Manual trigger',
      actions: ['Send email', 'Create task'],
      leads: 0,
      conversionRate: '0%',
      lastRun: 'Never'
    }
    setWorkflows(prev => [...prev, newWorkflow])
    showToast(`Workflow "${workflowData.name}" created successfully`, 'success')
  }

  const handleToggleWorkflow = (workflowId) => {
    setWorkflows(prev => prev.map(workflow =>
      workflow.id === workflowId
        ? {
            ...workflow,
            status: workflow.status === 'active' ? 'paused' : 'active',
            lastRun: workflow.status === 'paused' ? new Date().toLocaleString() : workflow.lastRun
          }
        : workflow
    ))
    const workflow = workflows.find(w => w.id === workflowId)
    const action = workflow?.status === 'active' ? 'paused' : 'activated'
    showToast(`Workflow ${action} successfully`, 'success')
  }

  const handleDuplicateWorkflow = (workflow) => {
    const duplicatedWorkflow = {
      ...workflow,
      id: Date.now(),
      name: `${workflow.name} (Copy)`,
      status: 'paused',
      leads: 0,
      conversionRate: '0%',
      lastRun: 'Never'
    }
    setWorkflows(prev => [...prev, duplicatedWorkflow])
    showToast(`Workflow "${workflow.name}" duplicated successfully`, 'success')
  }

  const handleDeleteWorkflow = (workflowId) => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (confirm(`Are you sure you want to delete "${workflow?.name}"?`)) {
      setWorkflows(prev => prev.filter(w => w.id !== workflowId))
      showToast(`Workflow "${workflow?.name}" deleted successfully`, 'success')
    }
  }

  const templates = []

  const WorkflowCard = ({ workflow }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className={`p-2 rounded-lg ${workflow.status === 'active' ? 'bg-green-100' : 'bg-gray-100'} mr-3`}>
            <Zap className={`h-5 w-5 ${workflow.status === 'active' ? 'text-green-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
            <p className="text-sm text-gray-600">{workflow.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => alert('Edit workflow builder coming soon!')}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Edit Workflow"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDuplicateWorkflow(workflow)}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Duplicate Workflow"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteWorkflow(workflow.id)}
            className="p-1 text-gray-400 hover:text-red-600"
            title="Delete Workflow"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{workflow.leads}</p>
          <p className="text-xs text-gray-600">Leads Processed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">{workflow.conversionRate}</p>
          <p className="text-xs text-gray-600">Conversion Rate</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900">{workflow.lastRun}</p>
          <p className="text-xs text-gray-600">Last Run</p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              workflow.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {workflow.status === 'active' ? 'Active' : 'Paused'}
            </span>
            <span className="ml-3 text-sm text-gray-600">
              Trigger: {workflow.trigger}
            </span>
          </div>
          <button
            onClick={() => handleToggleWorkflow(workflow.id)}
            className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
              workflow.status === 'active'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {workflow.status === 'active' ? (
              <>
                <Pause className="h-3 w-3 mr-1" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-3 w-3 mr-1" />
                Activate
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  const TemplateCard = ({ template }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center mb-4">
        <div className={`p-3 rounded-lg ${template.color} mr-4`}>
          <template.icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
          <p className="text-sm text-gray-600">{template.category}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{template.description}</p>
      <button
        onClick={() => alert(`Using ${template.name} template - feature coming soon!`)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Use Template
      </button>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl" />

        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg">
                  <Zap className="h-5 w-5 drop-shadow-sm" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                  {t('automation.title') || 'Automation Hub'}
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3">
                {t('automation.subtitle') || 'Automate your lead management and follow-up processes with intelligent workflows'}
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span className="text-xs text-purple-600 font-medium">{workflows.length} Active Workflows</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
                  <span className="text-sm text-pink-600 font-medium">Smart Automation</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowAddWorkflow(true)}
                className="group relative inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg hover:shadow-xl hover:scale-105 h-12 px-6 py-3 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700/20 to-pink-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Plus className="h-5 w-5 mr-3 drop-shadow-sm relative z-10" />
                <span className="relative z-10">{t('automation.createWorkflow') || 'Create Workflow'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Tabs */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-2">
        <nav className="flex space-x-2">
          <button
            onClick={() => setActiveTab('workflows')}
            className={`group relative px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              activeTab === 'workflows'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
            }`}
          >
            {activeTab === 'workflows' && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700/20 to-pink-700/20 rounded-xl" />
            )}
            <span className="relative z-10 flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Active Workflows
            </span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`group relative px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              activeTab === 'templates'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
            }`}
          >
            {activeTab === 'templates' && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700/20 to-pink-700/20 rounded-xl" />
            )}
            <span className="relative z-10 flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Templates
            </span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`group relative px-6 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-50 hover:text-purple-600'
            }`}
          >
            {activeTab === 'analytics' && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700/20 to-pink-700/20 rounded-xl" />
            )}
            <span className="relative z-10 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </span>
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'workflows' && (
        <div className="space-y-6">
          {workflows.map(workflow => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map(template => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Automation Analytics</h3>
          <p className="text-gray-600 mb-6">
            Track the performance of your automated workflows and optimize for better results.
          </p>
          <button
            onClick={() => alert('Detailed automation analytics feature coming soon!')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Detailed Analytics
          </button>
        </div>
      )}

      {/* Add Workflow Modal */}
      <AddWorkflowModal
        isOpen={showAddWorkflow}
        onClose={() => setShowAddWorkflow(false)}
        onSubmit={handleAddWorkflow}
      />
    </div>
  )
}

export default Automation

import { useState } from 'react'
import { Phone, Mail, MapPin, Home, Eye, Edit, UserCheck, Trash2, MessageCircle, User, Search, Filter } from 'lucide-react'
import { usePermissions, PERMISSIONS } from '../contexts/PermissionsContext'
import ProtectedComponent from './ProtectedComponent'

const KanbanView = ({
  leads,
  teamMembers = [], // Add teamMembers prop
  onUpdateLead,
  onViewLead,
  onEditLead,
  onAssignLead,
  onLinkProperty,
  onWhatsAppLead,
  onDeleteLead
}) => {
  const [draggedLead, setDraggedLead] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [agentFilter, setAgentFilter] = useState('all')
  const [columnLimits, setColumnLimits] = useState({})
  const [showAllColumns, setShowAllColumns] = useState(false)
  const { hasPermission } = usePermissions()

  // Performance settings
  const INITIAL_COLUMN_LIMIT = 20 // Show 20 leads per column initially
  const LOAD_MORE_INCREMENT = 20  // Load 20 more when "Load More" is clicked
  const MAX_TOTAL_LEADS = 200     // Maximum leads to show across all columns without search

  const columns = [
    { id: 'new', title: 'New Leads', color: 'bg-blue-50 border-blue-200', headerColor: 'bg-blue-100' },
    { id: 'contacted', title: 'Contacted', color: 'bg-yellow-50 border-yellow-200', headerColor: 'bg-yellow-100' },
    { id: 'qualified', title: 'Qualified', color: 'bg-green-50 border-green-200', headerColor: 'bg-green-100' },
    { id: 'proposal', title: 'Proposal', color: 'bg-purple-50 border-purple-200', headerColor: 'bg-purple-100' },
    { id: 'negotiation', title: 'Negotiation', color: 'bg-orange-50 border-orange-200', headerColor: 'bg-orange-100' },
    { id: 'closed-won', title: 'Closed Won', color: 'bg-emerald-50 border-emerald-200', headerColor: 'bg-emerald-100' },
    { id: 'closed-lost', title: 'Closed Lost', color: 'bg-red-50 border-red-200', headerColor: 'bg-red-100' }
  ]

  // Helper function to get agent name (since assignedTo already contains names)
  const getAgentName = (assignedTo) => {
    if (!assignedTo) return null
    // assignedTo already contains the name, so just return it
    return assignedTo
  }

  // Get unique agents for filter dropdown
  // IMPORTANT: assignedTo field contains NAMES, not UUIDs!
  const assignedAgentNames = [...new Set(leads.map(lead => lead.assignedTo).filter(Boolean))]

  // Map agent names to team member objects
  const uniqueAgents = assignedAgentNames
    .map(name => {
      const agent = teamMembers.find(member => member.name === name)
      return agent ? { id: agent.id, name: agent.name, assignedName: name } : null
    })
    .filter(Boolean) // Remove null entries (agents not in current team)
    .sort((a, b) => a.name.localeCompare(b.name))

  // Get leads with orphaned assignments (assigned to non-existent team members)
  const orphanedLeads = leads.filter(lead =>
    lead.assignedTo && !teamMembers.find(member => member.name === lead.assignedTo)
  )

  // Auto-cleanup orphaned leads silently
  React.useEffect(() => {
    if (orphanedLeads.length > 0 && onUpdateLead) {
      console.log('🧹 Auto-cleaning orphaned leads:', orphanedLeads.length)

      // Silently unassign orphaned leads
      orphanedLeads.forEach(async (lead) => {
        try {
          await onUpdateLead(lead.id, { assignedTo: null })
          console.log(`✅ Auto-unassigned: ${lead.name} (was assigned to: ${lead.assignedTo})`)
        } catch (error) {
          console.error(`❌ Failed to auto-unassign lead ${lead.name}:`, error)
        }
      })
    }
  }, [orphanedLeads.length, onUpdateLead])

  // Debug: Check for orphaned assignments and data issues
  const orphanedAssignments = assignedAgentNames.filter(name =>
    !teamMembers.find(member => member.name === name)
  )

  console.log('🔍 Debug Agent Filtering (AUTO-CLEANUP):')
  console.log('📊 Total leads:', leads.length)
  console.log('👥 Team members:', teamMembers.length, teamMembers.map(m => ({ id: m.id, name: m.name })))
  console.log('🎯 Assigned agent NAMES:', assignedAgentNames)
  console.log('❌ Orphaned assignments (auto-cleaning):', orphanedAssignments)
  console.log('🗑️ Orphaned leads (auto-cleaning):', orphanedLeads.length)
  console.log('📋 Unassigned leads count:', leads.filter(lead => !lead.assignedTo).length)
  console.log('✅ Valid agents with leads:', uniqueAgents)

  // Check if there are unassigned leads
  const hasUnassignedLeads = leads.some(lead => !lead.assignedTo)
  const unassignedCount = leads.filter(lead => !lead.assignedTo).length

  console.log('🔢 Unassigned leads check:', { hasUnassignedLeads, unassignedCount })

  // Filter leads based on search term and agent
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city?.toLowerCase().includes(searchTerm.toLowerCase())

    // Since assignedTo contains names, we need to match by name
    const matchesAgent = agentFilter === 'all' ||
      (agentFilter === 'unassigned' && !lead.assignedTo) ||
      lead.assignedTo === agentFilter // agentFilter will be the agent name

    return matchesSearch && matchesAgent
  })

  console.log('🎯 Filtering results:', {
    agentFilter,
    searchTerm,
    totalLeads: leads.length,
    filteredLeads: filteredLeads.length,
    unassignedInFiltered: filteredLeads.filter(lead => !lead.assignedTo).length
  })

  // Performance optimization: limit total leads if no search or agent filter
  const shouldLimitLeads = searchTerm === '' && agentFilter === 'all' && filteredLeads.length > MAX_TOTAL_LEADS
  const performanceFilteredLeads = shouldLimitLeads
    ? filteredLeads.slice(0, MAX_TOTAL_LEADS)
    : filteredLeads

  const getLeadsByStatus = (status) => {
    const statusLeads = performanceFilteredLeads.filter(lead => lead.status === status)
    const limit = columnLimits[status] || INITIAL_COLUMN_LIMIT

    // If searching or filtering by agent, show all matching leads in column
    if (searchTerm !== '' || agentFilter !== 'all') {
      return statusLeads
    }

    // Otherwise, apply column limit for performance
    return statusLeads.slice(0, limit)
  }

  const getColumnStats = (status) => {
    const allStatusLeads = filteredLeads.filter(lead => lead.status === status)
    const visibleLeads = getLeadsByStatus(status)
    return {
      total: allStatusLeads.length,
      visible: visibleLeads.length,
      hasMore: visibleLeads.length < allStatusLeads.length
    }
  }

  const loadMoreInColumn = (status) => {
    const currentLimit = columnLimits[status] || INITIAL_COLUMN_LIMIT
    setColumnLimits(prev => ({
      ...prev,
      [status]: currentLimit + LOAD_MORE_INCREMENT
    }))
  }



  const handleDragStart = (e, lead) => {
    setDraggedLead(lead)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, newStatus) => {
    e.preventDefault()
    if (draggedLead && draggedLead.status !== newStatus) {
      onUpdateLead(draggedLead.id, { status: newStatus })
    }
    setDraggedLead(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800'
      case 'qualified':
        return 'bg-green-100 text-green-800'
      case 'proposal':
        return 'bg-purple-100 text-purple-800'
      case 'negotiation':
        return 'bg-orange-100 text-orange-800'
      case 'closed-won':
        return 'bg-emerald-100 text-emerald-800'
      case 'closed-lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {/* Performance Warning */}
      {shouldLimitLeads && !searchTerm && agentFilter === 'all' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Performance Mode Active
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Showing {MAX_TOTAL_LEADS} of {leads.length} leads for optimal performance.
                  Use search or agent filter to find specific leads, or click "Show all leads" to see everything.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads by name, email, phone, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Agent Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white min-w-[160px]"
              disabled={uniqueAgents.length === 0 && !hasUnassignedLeads}
            >
              <option value="all">
                {uniqueAgents.length === 0 && !hasUnassignedLeads ? 'No agents or unassigned leads' : 'All Agents'}
              </option>
              {hasUnassignedLeads && (
                <option value="unassigned">
                  Unassigned ({unassignedCount})
                </option>
              )}
              {uniqueAgents.map(agent => (
                <option key={agent.id} value={agent.name}>
                  {agent.name} ({leads.filter(lead => lead.assignedTo === agent.name).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <span>
            {searchTerm || agentFilter !== 'all' ? (
              `Found: ${filteredLeads.length} leads`
            ) : shouldLimitLeads ? (
              `Showing: ${MAX_TOTAL_LEADS} of ${leads.length} leads (for performance)`
            ) : (
              `Total: ${filteredLeads.length} leads`
            )}
          </span>
          {(searchTerm || agentFilter !== 'all') && (
            <div className="flex items-center space-x-2">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear search
                </button>
              )}
              {agentFilter !== 'all' && (
                <button
                  onClick={() => setAgentFilter('all')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear agent filter ({agentFilter === 'unassigned' ? 'Unassigned' : getAgentName(agentFilter) || 'Unknown'})
                </button>
              )}
              {(searchTerm || agentFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setAgentFilter('all')
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
          {shouldLimitLeads && !searchTerm && agentFilter === 'all' && (
            <button
              onClick={() => setShowAllColumns(!showAllColumns)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showAllColumns ? 'Optimize view' : 'Show all leads'}
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-3 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnLeads = getLeadsByStatus(column.id)
        const columnStats = getColumnStats(column.id)

        return (
          <div
            key={column.id}
            className={`flex-shrink-0 w-64 ${column.color} border rounded-lg`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className={`${column.headerColor} px-3 py-2 rounded-t-lg border-b`}>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 text-sm">{column.title}</h3>
                <div className="flex items-center space-x-1">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-700">
                    {columnStats.visible}
                    {columnStats.total !== columnStats.visible && (
                      <span className="text-gray-500">/{columnStats.total}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Column Content */}
            <div className="p-1.5 space-y-1.5 min-h-[200px]">
              {columnLeads.map((lead) => (
                <div
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead)}
                  className={`bg-white rounded-md border border-gray-200 p-2 shadow-sm hover:shadow-md transition-shadow cursor-move ${
                    draggedLead?.id === lead.id ? 'opacity-50' : ''
                  }`}
                >
                  {/* Lead Header */}
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex-1">
                      <div className="flex items-center space-x-1 mb-0.5">
                        <h4 className="font-medium text-gray-900 text-xs">{lead.name}</h4>
                        {lead.interestedProperties?.length > 0 && (
                          <span className="inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {lead.interestedProperties.length} 🏠
                          </span>
                        )}
                      </div>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info - Compact */}
                  <div className="space-y-0.5 mb-1.5">
                    <div className="flex items-center text-xs text-gray-600">
                      <Phone className="h-3 w-3 mr-1 text-gray-400" />
                      <span className="truncate">{lead.phone}</span>
                    </div>
                    {lead.assignedTo && (
                      <div className="flex items-center text-xs text-gray-500">
                        <UserCheck className="h-3 w-3 mr-1 text-gray-400" />
                        <span className="truncate">{lead.assignedTo}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-0.5">
                      {/* View - All roles */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onViewLead(lead)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Lead"
                      >
                        <Eye className="h-3 w-3" />
                      </button>

                      {/* Assign - Super Agent and Manager only */}
                      <ProtectedComponent permission={PERMISSIONS.ASSIGN_LEAD}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onAssignLead(lead)
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Assign Lead"
                        >
                          <UserCheck className="h-3 w-3" />
                        </button>
                      </ProtectedComponent>

                      {/* Link Property - All roles */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onLinkProperty(lead)
                        }}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Link Property"
                      >
                        <Home className="h-3 w-3" />
                      </button>

                      {/* WhatsApp - All roles */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onWhatsAppLead(lead)
                        }}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Send Properties via WhatsApp"
                      >
                        <MessageCircle className="h-3 w-3" />
                      </button>

                      {/* Edit - All roles can edit their assigned leads */}
                      <ProtectedComponent permission={PERMISSIONS.EDIT_LEAD}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditLead(lead)
                          }}
                          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          title="Edit Lead"
                        >
                          <Edit className="h-3 w-3" />
                        </button>
                      </ProtectedComponent>

                      {/* Delete - Manager only */}
                      <ProtectedComponent permission={PERMISSIONS.DELETE_LEAD}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteLead(lead)
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </ProtectedComponent>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {columnLeads.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-sm">
                    {searchTerm ? 'No matching leads' : 'No leads in this stage'}
                  </div>
                  <div className="text-xs mt-1">
                    {searchTerm ? 'Try adjusting your search' : 'Drag leads here to update status'}
                  </div>
                </div>
              )}

              {/* Load More Button */}
              {columnStats.hasMore && !searchTerm && agentFilter === 'all' && (
                <div className="text-center py-3">
                  <button
                    onClick={() => loadMoreInColumn(column.id)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Load {Math.min(LOAD_MORE_INCREMENT, columnStats.total - columnStats.visible)} more...
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
      </div>
    </div>
  )
}

export default KanbanView

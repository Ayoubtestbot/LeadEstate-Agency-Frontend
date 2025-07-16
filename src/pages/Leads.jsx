import React, { useState } from 'react'
import {
  Plus,
  Search,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Home,
  Grid,
  List,
  Users,
  Upload,
  MessageCircle
} from 'lucide-react'
import { useData, useAuth } from '../App'
import { usePermissions, PERMISSIONS } from '../contexts/PermissionsContext'
import ProtectedComponent from '../components/ProtectedComponent'
import { useToast } from '../components/Toast'
import AddLeadModal from '../components/AddLeadModal'
import ViewLeadModalSimple from '../components/ViewLeadModalSimple'
import EditLeadModal from '../components/EditLeadModal'
import AssignLeadModal from '../components/AssignLeadModal'
import LinkPropertyModal from '../components/LinkPropertyModal'
import WhatsAppPropertyModal from '../components/WhatsAppPropertyModal'
import ImportLeadsModal from '../components/ImportLeadsModal'
import GoogleSheetsConfig from '../components/GoogleSheetsConfig'
import KanbanView from '../components/KanbanView'
import ConfirmDialog from '../components/ConfirmDialog'

const Leads = () => {
  const { leads, properties, teamMembers, addLead, updateLead, deleteLead, linkPropertyToLead, unlinkPropertyFromLead } = useData()
  const { user } = useAuth()
  const { hasPermission } = usePermissions()
  const { showToast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [agentFilter, setAgentFilter] = useState('all') // New agent filter
  const [selectedLeads, setSelectedLeads] = useState([]) // For bulk actions
  const [viewMode, setViewMode] = useState('table') // 'table' or 'kanban'
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showAddLead, setShowAddLead] = useState(false)
  const [viewLead, setViewLead] = useState(null)
  const [editLead, setEditLead] = useState(null)
  const [assignLead, setAssignLead] = useState(null)
  const [linkProperty, setLinkProperty] = useState(null)
  const [whatsAppLead, setWhatsAppLead] = useState(null)
  const [showImport, setShowImport] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleAddLead = (leadData) => {
    addLead(leadData)
    showToast(`Lead "${leadData.name}" added successfully!`, 'success')
  }

  const handleViewLead = (lead) => {
    setViewLead(lead)
  }

  const handleEditLead = (lead) => {
    console.log('🔍 Leads.jsx - Edit lead clicked:', lead); // Debug log
    console.log('🔍 Lead fields available:', Object.keys(lead)); // Show available fields
    setEditLead(lead)
  }

  const handleEditSubmit = (updatedData) => {
    updateLead(editLead.id, updatedData)
    showToast(`Lead "${updatedData.name}" updated successfully!`, 'success')
    setEditLead(null)
  }

  const handleAssignLead = (lead) => {
    setAssignLead(lead)
  }

  const handleAssignSubmit = (assignedTo) => {
    const oldAssignedTo = assignLead.assignedTo
    updateLead(assignLead.id, {
      assignedTo,
      changedBy: user?.name || 'Current User',
      assignmentReason: assignedTo
        ? (oldAssignedTo ? `Reassigned from ${oldAssignedTo} to ${assignedTo}` : `Initially assigned to ${assignedTo}`)
        : 'Lead unassigned'
    })
    const message = assignedTo
      ? `Lead assigned to ${assignedTo} successfully!`
      : `Lead unassigned successfully!`
    showToast(message, 'success')
    setAssignLead(null)
  }

  const handleLinkProperty = (lead) => {
    setLinkProperty(lead)
  }

  const handlePropertyLink = async (propertyId) => {
    console.log('🔗 handlePropertyLink called with:', { propertyId, type: typeof propertyId })
    console.log('🔗 Available properties:', properties.map(p => ({ id: p.id, title: p.title, type: typeof p.id })))

    try {
      await linkPropertyToLead(linkProperty.id, propertyId)

      // Try both string and number comparison
      const property = properties.find(p => p.id == propertyId || p.id === propertyId || p.id === parseInt(propertyId))
      console.log('🔗 Found property:', property)

      if (property) {
        showToast(`${linkProperty.name} is now interested in "${property.title}"!`, 'success')
      } else {
        showToast(`${linkProperty.name} is now interested in a property!`, 'success')
      }

      // Close the modal and refresh data
      setLinkProperty(null)
    } catch (error) {
      console.error('❌ Error in handlePropertyLink:', error)
      showToast('Failed to link property', 'error')
    }
  }

  const handlePropertyUnlink = (propertyId) => {
    unlinkPropertyFromLead(linkProperty.id, propertyId)

    // Try both string and number comparison
    const property = properties.find(p => p.id == propertyId || p.id === propertyId || p.id === parseInt(propertyId))

    if (property) {
      showToast(`Removed "${property.title}" from ${linkProperty.name}'s interests`, 'success')
    } else {
      showToast(`Removed property from ${linkProperty.name}'s interests`, 'success')
    }
  }

  const handleWhatsAppLead = (lead) => {
    setWhatsAppLead(lead)
  }

  const handleWhatsAppWelcome = async (lead) => {
    if (!lead.assignedTo) {
      showToast('Lead must be assigned to an agent first!', 'error')
      return
    }

    if (!lead.phone) {
      showToast('Lead has no phone number!', 'error')
      return
    }

    try {
      const response = await fetch(`https://leadestate-backend-9fih.onrender.com/api/whatsapp/welcome/${lead.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const result = await response.json()

        // Show confirmation and open WhatsApp
        const shouldOpen = window.confirm(
          `📱 WhatsApp welcome message ready for ${lead.name}!\n\n` +
          `Agent: ${result.data.agent}\n\n` +
          `Click OK to open WhatsApp and send the welcome message.`
        );

        if (shouldOpen) {
          window.open(result.data.whatsappUrl, '_blank');
          showToast(`WhatsApp message opened for ${lead.name}!`, 'success')
        }
      } else {
        throw new Error('Failed to prepare WhatsApp message')
      }
    } catch (error) {
      console.error('Error preparing WhatsApp welcome:', error)
      showToast('Failed to prepare WhatsApp message', 'error')
    }
  }

  const handleImportLeads = (importedLeads) => {
    importedLeads.forEach(leadData => {
      const newLead = {
        id: Date.now() + Math.random(), // Ensure unique IDs
        ...leadData,
        createdAt: new Date().toISOString(),
        assignedTo: null,
        interestedProperties: []
      }
      addLead(newLead)
    })
    showToast(`Successfully imported ${importedLeads.length} leads`, 'success')
  }

  const handleGoogleSheetsLeads = (newLeads) => {
    newLeads.forEach(leadData => {
      const newLead = {
        id: Date.now() + Math.random(), // Ensure unique IDs
        ...leadData,
        createdAt: new Date().toISOString(),
        assignedTo: null,
        interestedProperties: []
      }
      addLead(newLead)
    })
  }

  const handleDeleteLead = (lead) => {
    setDeleteConfirm(lead)
  }

  const confirmDelete = () => {
    deleteLead(deleteConfirm.id)
    showToast(`${deleteConfirm.name} deleted successfully!`, 'success')
    setDeleteConfirm(null)
  }



  // Bulk action handlers
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedLeads(filteredLeads.map(lead => lead.id))
    } else {
      setSelectedLeads([])
    }
  }

  const handleSelectLead = (leadId, checked) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, leadId])
    } else {
      setSelectedLeads(prev => prev.filter(id => id !== leadId))
    }
  }

  const handleBulkAssign = (agentName) => {
    selectedLeads.forEach(leadId => {
      const lead = leads.find(l => l.id === leadId)
      if (lead) {
        updateLead(leadId, {
          assignedTo: agentName,
          changedBy: user?.name || 'Current User',
          assignmentReason: `Bulk assignment to ${agentName}`
        })
      }
    })
    showToast(`${selectedLeads.length} leads assigned to ${agentName}`, 'success')
    setSelectedLeads([])
  }

  const handleBulkStatusChange = (status) => {
    selectedLeads.forEach(leadId => {
      const lead = leads.find(l => l.id === leadId)
      if (lead) {
        updateLead(leadId, { ...lead, status })
      }
    })
    showToast(`${selectedLeads.length} leads updated to ${status}`, 'success')
    setSelectedLeads([])
  }

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedLeads.length} leads?`)) {
      selectedLeads.forEach(leadId => {
        deleteLead(leadId)
      })
      showToast(`${selectedLeads.length} leads deleted`, 'success')
      setSelectedLeads([])
    }
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
        return 'bg-green-100 text-green-800'
      case 'closed-lost':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSourceColor = (source) => {
    switch (source) {
      case 'website':
        return 'bg-blue-100 text-blue-800'
      case 'facebook':
        return 'bg-blue-100 text-blue-800'
      case 'google':
        return 'bg-green-100 text-green-800'
      case 'referral':
        return 'bg-purple-100 text-purple-800'
      case 'walk-in':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Filter and sort leads based on search, status, agent, and user permissions
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    const matchesAgent = agentFilter === 'all' || lead.assignedTo === agentFilter

    // Role-based filtering
    if (hasPermission(PERMISSIONS.VIEW_ALL_LEADS)) {
      // Manager and Super Agent can see all leads
      return matchesSearch && matchesStatus && matchesAgent
    } else if (hasPermission(PERMISSIONS.VIEW_ASSIGNED_LEADS)) {
      // Agent can only see their assigned leads
      return matchesSearch && matchesStatus && lead.assignedTo === user?.name
    }

    // Fallback: if no specific permissions, don't show leads
    return false
  }).sort((a, b) => {
    // Sort by creation date - newest first (descending order)
    const dateA = new Date(a.created_at || a.createdAt || 0)
    const dateB = new Date(b.created_at || b.createdAt || 0)
    return dateB - dateA
  })

  // Pagination logic - only for table view
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedLeads = viewMode === 'table' ? filteredLeads.slice(startIndex, endIndex) : filteredLeads

  // Reset to first page when filters change (only for table view)
  React.useEffect(() => {
    if (viewMode === 'table') {
      setCurrentPage(1)
    }
  }, [searchTerm, statusFilter, agentFilter, itemsPerPage, viewMode])

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Google Sheets Integration - Manager only */}
      <ProtectedComponent permission={PERMISSIONS.MANAGE_AUTOMATION}>
        <GoogleSheetsConfig onNewLeads={handleGoogleSheetsLeads} />
      </ProtectedComponent>

      {/* Enhanced Header */}
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-3xl" />

        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
                  <Users className="h-5 w-5 drop-shadow-sm" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                  Leads Management
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3">
                Manage your real estate leads and track your sales pipeline
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs text-blue-600 font-medium">{filteredLeads.length} Total Leads</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">
                    {filteredLeads.filter(l => l.status === 'qualified').length} Qualified
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Enhanced View Toggle */}
              <div className="flex rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm shadow-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`group relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    viewMode === 'table'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  {viewMode === 'table' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 to-purple-700/20 rounded-xl" />
                  )}
                  <div className="relative flex items-center space-x-2">
                    <List className="h-4 w-4 drop-shadow-sm" />
                    <span>Table</span>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`group relative px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${
                    viewMode === 'kanban'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                  }`}
                >
                  {viewMode === 'kanban' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 to-purple-700/20 rounded-xl" />
                  )}
                  <div className="relative flex items-center space-x-2">
                    <Grid className="h-4 w-4 drop-shadow-sm" />
                    <span>Kanban</span>
                  </div>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Enhanced Import Leads - Super Agent and Manager only */}
                <ProtectedComponent permission={PERMISSIONS.IMPORT_LEADS}>
                  <button
                    onClick={() => setShowImport(true)}
                    className="group relative inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg hover:shadow-xl hover:scale-105 h-12 px-6 py-3 w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-emerald-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Upload className="h-5 w-5 mr-3 drop-shadow-sm relative z-10" />
                    <span className="relative z-10">Import Leads</span>
                  </button>
                </ProtectedComponent>

                {/* Enhanced Add Lead - Super Agent and Manager only */}
                <ProtectedComponent permission={PERMISSIONS.ADD_LEAD}>
                  <button
                    onClick={() => setShowAddLead(true)}
                    className="group relative inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 h-12 px-6 py-3 w-full sm:w-auto"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 to-purple-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Plus className="h-5 w-5 mr-3 drop-shadow-sm relative z-10" />
                    <span className="relative z-10">Add Lead</span>
                  </button>
                </ProtectedComponent>
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* Enhanced Filters - Only show for table view */}
      {viewMode === 'table' && (
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 to-blue-500/5 rounded-3xl" />
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Enhanced Search */}
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                  <input
                    type="text"
                    placeholder="Search leads by name, email, phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex h-12 w-full rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm px-4 py-3 pl-12 text-sm font-medium shadow-lg transition-all duration-300 placeholder:text-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 hover:shadow-xl"
                  />
                </div>
              </div>

              {/* Enhanced Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Enhanced Status Filter */}
                <div className="sm:w-56">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex h-12 w-full rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 hover:shadow-xl cursor-pointer"
                  >
                    <option value="all">🔍 All Status</option>
                    <option value="new">🆕 New</option>
                    <option value="contacted">📞 Contacted</option>
                    <option value="qualified">✅ Qualified</option>
                    <option value="proposal">📋 Proposal</option>
                    <option value="negotiation">🤝 Negotiation</option>
                    <option value="closed-won">🎉 Closed Won</option>
                    <option value="closed-lost">❌ Closed Lost</option>
                  </select>
                </div>

                {/* Enhanced Agent Filter - Manager and Super Agent only */}
                {hasPermission(PERMISSIONS.VIEW_ALL_LEADS) && (
                  <div className="sm:w-56">
                    <select
                      value={agentFilter}
                      onChange={(e) => setAgentFilter(e.target.value)}
                      className="flex h-12 w-full rounded-2xl border border-gray-200/50 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm font-medium shadow-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500/50 hover:shadow-xl cursor-pointer"
                    >
                      <option value="all">👥 All Agents</option>
                      <option value="">🔄 Unassigned</option>
                      {teamMembers.map(member => (
                        <option key={member.id} value={member.name}>
                          👤 {member.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Views */}
      {viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Bulk Actions - Manager and Super Agent only */}
          {hasPermission(PERMISSIONS.VIEW_ALL_LEADS) && selectedLeads.length > 0 && (
            <div className="px-4 py-3 border-b bg-blue-50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">
                  {selectedLeads.length} lead{selectedLeads.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center space-x-2">
                  <select
                    onChange={(e) => e.target.value && handleBulkAssign(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                    defaultValue=""
                  >
                    <option value="">Assign to...</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                  <select
                    onChange={(e) => e.target.value && handleBulkStatusChange(e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                    defaultValue=""
                  >
                    <option value="">Change status...</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="proposal">Proposal</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closed-won">Closed Won</option>
                    <option value="closed-lost">Closed Lost</option>
                  </select>
                  <button
                    onClick={handleBulkDelete}
                    className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedLeads([])}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="border-b">
                <tr>
                  {/* Checkbox column - Manager and Super Agent only */}
                  {hasPermission(PERMISSIONS.VIEW_ALL_LEADS) && (
                    <th className="h-10 px-2 text-left align-middle font-medium text-gray-500 w-10">
                      <input
                        type="checkbox"
                        checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </th>
                  )}
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500">Lead</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500 hidden sm:table-cell">Contact</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500">Status</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500 hidden md:table-cell">Source</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500 hidden lg:table-cell">Assigned To</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500 hidden xl:table-cell">Created</th>
                  <th className="h-10 px-2 text-left align-middle font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
            <tbody>
              {paginatedLeads.map((lead) => (
                <tr key={lead.id} className="border-b transition-colors hover:bg-gray-50">
                  {/* Checkbox column - Manager and Super Agent only */}
                  {hasPermission(PERMISSIONS.VIEW_ALL_LEADS) && (
                    <td className="p-2 align-middle w-10">
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead.id)}
                        onChange={(e) => handleSelectLead(lead.id, e.target.checked)}
                        className="rounded border-gray-300"
                      />
                    </td>
                  )}
                  <td className="p-2 align-middle">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{lead.name}</span>
                        {lead.interestedProperties?.length > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-blue-500 text-white ml-2 shadow-sm">
                            {lead.interestedProperties.length} 🏠
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 sm:hidden">
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-2 align-middle hidden sm:table-cell">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3 w-3 mr-1" />
                        {lead.phone}
                      </div>
                      {lead.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                      )}
                      {lead.city && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="text-xs">📍 {lead.city}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-2 align-middle">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-2 align-middle hidden md:table-cell">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSourceColor(lead.source)}`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="p-2 align-middle hidden lg:table-cell">
                    {lead.assignedTo ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {lead.assignedTo}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">Unassigned</span>
                    )}
                  </td>
                  <td className="p-2 align-middle hidden xl:table-cell">
                    <div className="text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="p-2 align-middle">
                    <div className="flex items-center space-x-1">
                      {/* View - All roles can view */}
                      <button
                        onClick={() => handleViewLead(lead)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="View Lead"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Assign - Super Agent and Manager only */}
                      <ProtectedComponent permission={PERMISSIONS.ASSIGN_LEAD}>
                        <button
                          onClick={() => handleAssignLead(lead)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Assign Lead"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      </ProtectedComponent>

                      {/* Link Property - All roles can link properties */}
                      <button
                        onClick={() => handleLinkProperty(lead)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Link Property"
                      >
                        <Home className="h-4 w-4" />
                      </button>

                      {/* WhatsApp - All roles can send WhatsApp */}
                      <button
                        onClick={() => handleWhatsAppLead(lead)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                        title="Send Properties via WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>

                      {/* WhatsApp Welcome - Send welcome message */}
                      {lead.assignedTo && lead.phone && (
                        <button
                          onClick={() => handleWhatsAppWelcome(lead)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Send WhatsApp Welcome Message"
                        >
                          <Phone className="h-4 w-4" />
                        </button>
                      )}

                      {/* Edit - All roles can edit (filtered by permissions in component) */}
                      <ProtectedComponent permission={PERMISSIONS.EDIT_LEAD}>
                        <button
                          onClick={() => handleEditLead(lead)}
                          className="p-1 text-gray-400 hover:text-gray-600 hidden lg:inline-flex transition-colors"
                          title="Edit Lead"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </ProtectedComponent>

                      {/* Delete - Manager only */}
                      <ProtectedComponent permission={PERMISSIONS.DELETE_LEAD}>
                        <button
                          onClick={() => handleDeleteLead(lead)}
                          className="p-1 text-gray-400 hover:text-red-600 hidden lg:inline-flex transition-colors"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </ProtectedComponent>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredLeads.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Items per page selector */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>

              {/* Pagination info and controls */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredLeads.length)} of {filteredLeads.length} leads
                </span>

                {totalPages > 1 && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-3 py-1 text-sm border rounded-md ${
                            currentPage === pageNum
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-300 hover:bg-gray-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty State for Table */}
        {filteredLeads.length === 0 && (
          <div className="p-8 text-center">
            <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters to find what you\'re looking for.'
                : 'Get started by adding your first lead to the system.'
              }
            </p>
            <button
              onClick={() => setShowAddLead(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </button>
          </div>
        )}
        </div>
      ) : (
        /* Kanban View */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <KanbanView
            leads={filteredLeads}
            teamMembers={teamMembers}
            onUpdateLead={updateLead}
            onViewLead={handleViewLead}
            onEditLead={handleEditLead}
            onAssignLead={handleAssignLead}
            onLinkProperty={handleLinkProperty}
            onWhatsAppLead={handleWhatsAppLead}
            onDeleteLead={handleDeleteLead}
          />

          {/* Empty State for Kanban */}
          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Grid className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads to display</h3>
              <p className="text-gray-500 mb-6">
                Add some leads to see them organized in the Kanban board.
              </p>
              <button
                onClick={() => setShowAddLead(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white shadow hover:bg-blue-700 h-9 px-4 py-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddLeadModal
        isOpen={showAddLead}
        onClose={() => setShowAddLead(false)}
        onSubmit={handleAddLead}
      />

      <ViewLeadModalSimple
        isOpen={!!viewLead}
        onClose={() => setViewLead(null)}
        lead={viewLead}
      />

      <EditLeadModal
        isOpen={!!editLead}
        onClose={() => setEditLead(null)}
        lead={editLead}
        onSubmit={handleEditSubmit}
      />

      <AssignLeadModal
        isOpen={!!assignLead}
        onClose={() => setAssignLead(null)}
        lead={assignLead}
        onSubmit={handleAssignSubmit}
      />

      <LinkPropertyModal
        isOpen={!!linkProperty}
        onClose={() => setLinkProperty(null)}
        lead={linkProperty}
        properties={properties}
        onLink={handlePropertyLink}
        onUnlink={handlePropertyUnlink}
      />

      <WhatsAppPropertyModal
        isOpen={!!whatsAppLead}
        onClose={() => setWhatsAppLead(null)}
        lead={whatsAppLead}
      />

      <ImportLeadsModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImport={handleImportLeads}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete ${deleteConfirm?.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

export default Leads

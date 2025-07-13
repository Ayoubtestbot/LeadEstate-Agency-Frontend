import React from 'react'
import {
  User, Phone, Mail, MapPin, Calendar, Tag, Home, DollarSign,
  MessageSquare, Clock, Edit3, Send, History, UserCheck,
  FileText, Plus, ChevronDown, ChevronUp
} from 'lucide-react'
import Modal from './Modal'

const ViewLeadModal = ({ isOpen, onClose, lead }) => {
  if (!lead) return null

  // Static data - no state management to avoid React hook issues
  const mockNotes = [
    {
      id: 1,
      content: 'Initial contact made via phone. Client interested in 3-bedroom apartments.',
      createdAt: new Date().toISOString(),
      createdBy: 'Sarah Johnson',
      type: 'note'
    },
    {
      id: 2,
      content: 'Follow-up call scheduled for tomorrow at 2 PM.',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      createdBy: 'Sarah Johnson',
      type: 'reminder'
    }
  ]

  const mockHistory = [
    {
      id: 1,
      fromAgent: null,
      toAgent: lead.assignedTo || 'Sarah Johnson',
      changedAt: lead.createdAt || new Date().toISOString(),
      changedBy: 'System',
      reason: 'Initial assignment'
    }
  ]

  // Simple tab management without useState
  const [currentTab, setCurrentTab] = React.useState('details')

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId)
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) return

    try {
      const noteData = {
        leadId: lead.id,
        content: newNote.trim(),
        type: 'note',
        createdBy: user?.name || 'Unknown User'
      }

      const response = await fetch(`${API_URL}/leads/${lead.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData)
      })

      if (response.ok) {
        const result = await response.json()
        setNotes(prev => [result.data, ...prev])
        setNewNote('')
        showToast('Note added successfully!', 'success')
      } else {
        // Fallback: add note locally if API fails
        const newNoteObj = {
          id: Date.now(),
          content: newNote.trim(),
          createdAt: new Date().toISOString(),
          createdBy: user?.name || 'Unknown User',
          type: 'note'
        }
        setNotes(prev => [newNoteObj, ...prev])
        setNewNote('')
        showToast('Note added locally!', 'success')
      }
    } catch (error) {
      console.error('Error adding note:', error)
      // Fallback: add note locally
      const newNoteObj = {
        id: Date.now(),
        content: newNote.trim(),
        createdAt: new Date().toISOString(),
        createdBy: user?.name || 'Unknown User',
        type: 'note'
      }
      setNotes(prev => [newNoteObj, ...prev])
      setNewNote('')
      showToast('Note added locally!', 'success')
    }
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Get linked properties - handle both string and number IDs
  const linkedProperties = properties.filter(property => {
    const interestedIds = lead.interestedProperties || []
    return interestedIds.some(id =>
      id == property.id || id === property.id || parseInt(id) === property.id || id === String(property.id)
    )
  })

  console.log('🔍 ViewLeadModal - Linked properties found:', linkedProperties)

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lead Details" size="xl">
      <div className="space-y-6">
        {/* Enhanced Lead Header */}
        <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <User className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{lead.name}</h2>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                  {lead.status}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSourceColor(lead.source)}`}>
                  {lead.source}
                </span>
                <span className="text-sm text-gray-600">
                  ID: #{lead.id}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(lead.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'details', label: 'Details', icon: User },
              { id: 'notes', label: 'Notes & Comments', icon: MessageSquare },
              { id: 'history', label: 'History', icon: History }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`mr-2 h-5 w-5 ${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {tab.label}
                  {tab.id === 'notes' && notes.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs font-medium">
                      {notes.length}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection('contact')}
                >
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Phone className="h-5 w-5 text-blue-600 mr-2" />
                    Contact Information
                  </h3>
                  {expandedSections.contact ?
                    <ChevronUp className="h-5 w-5 text-gray-400" /> :
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  }
                </div>
                {expandedSections.contact && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{lead.phone}</p>
                        <p className="text-xs text-gray-500">Primary Phone</p>
                      </div>
                    </div>
                    {lead.email && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{lead.email}</p>
                          <p className="text-xs text-gray-500">Email Address</p>
                        </div>
                      </div>
                    )}
                    {lead.city && (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{lead.city}</p>
                          <p className="text-xs text-gray-500">Location</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Property Interest */}
              {lead.propertyType && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleSection('property')}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Home className="h-5 w-5 text-green-600 mr-2" />
                      Property Interest
                    </h3>
                    {expandedSections.property ?
                      <ChevronUp className="h-5 w-5 text-gray-400" /> :
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    }
                  </div>
                  {expandedSections.property && (
                    <div className="px-4 pb-4 space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <Home className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">{lead.propertyType}</p>
                          <p className="text-xs text-gray-500">Property Type</p>
                        </div>
                      </div>
                      {lead.budget && (
                        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{lead.budget}</p>
                            <p className="text-xs text-gray-500">Budget Range</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Assignment Information */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection('assignment')}
                >
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <UserCheck className="h-5 w-5 text-purple-600 mr-2" />
                    Assignment
                  </h3>
                  {expandedSections.assignment ?
                    <ChevronUp className="h-5 w-5 text-gray-400" /> :
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  }
                </div>
                {expandedSections.assignment && (
                  <div className="px-4 pb-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        {lead.assignedTo ? (
                          <>
                            <p className="text-sm font-medium text-gray-900">{lead.assignedTo}</p>
                            <p className="text-xs text-gray-500">Assigned Agent</p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium text-gray-500">Unassigned</p>
                            <p className="text-xs text-gray-400">No agent assigned yet</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Properties of Interest */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection('properties')}
                >
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Home className="h-5 w-5 text-indigo-600 mr-2" />
                    Properties of Interest ({linkedProperties.length})
                  </h3>
                  {expandedSections.properties ?
                    <ChevronUp className="h-5 w-5 text-gray-400" /> :
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  }
                </div>
                {expandedSections.properties && (
                  <div className="px-4 pb-4">
                    {linkedProperties.length > 0 ? (
                      <div className="space-y-3">
                        {linkedProperties.map((property) => (
                          <div key={property.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Home className="h-4 w-4 text-blue-600" />
                                  <h4 className="font-medium text-gray-900">{property.title}</h4>
                                </div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <DollarSign className="h-4 w-4 text-green-600" />
                                  <span className="text-sm font-medium text-green-600">
                                    ${parseInt(property.price).toLocaleString()}
                                  </span>
                                  <span className="text-xs text-gray-500 capitalize">• {property.type}</span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{property.address}, {property.city}</p>
                                {(property.bedrooms || property.bathrooms || property.area) && (
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    {property.bedrooms && <span className="flex items-center"><span className="mr-1">🛏️</span> {property.bedrooms} bed</span>}
                                    {property.bathrooms && <span className="flex items-center"><span className="mr-1">🚿</span> {property.bathrooms} bath</span>}
                                    {property.area && <span className="flex items-center"><span className="mr-1">📐</span> {parseInt(property.area).toLocaleString()} sq ft</span>}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-500">No properties linked yet</p>
                        <p className="text-xs text-gray-400">Use the property link button to add interests</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Add New Note */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Plus className="h-5 w-5 text-blue-600 mr-2" />
                  Add New Note
                </h3>
                <div className="space-y-4">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note or comment about this lead..."
                    className="w-full h-24 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddNote}
                      disabled={!newNote.trim() || loading}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Add Note
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes History */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MessageSquare className="h-5 w-5 text-green-600 mr-2" />
                    Notes History ({notes.length})
                  </h3>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : notes.length > 0 ? (
                    <div className="space-y-4">
                      {notes.map((note, index) => (
                        <div key={note.id} className="relative">
                          {index < notes.length - 1 && (
                            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                          )}
                          <div className="flex space-x-4">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {note.createdBy?.charAt(0)?.toUpperCase() || 'U'}
                                </span>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-medium text-gray-900">{note.createdBy}</p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {new Date(note.createdAt).toLocaleString()}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{note.content}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-500">No notes yet</p>
                      <p className="text-xs text-gray-400">Add the first note to start tracking this lead's progress</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              {/* Assignee History */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <History className="h-5 w-5 text-orange-600 mr-2" />
                    Assignment History
                  </h3>
                </div>
                <div className="p-6">
                  {assigneeHistory.length > 0 ? (
                    <div className="space-y-4">
                      {assigneeHistory.map((history, index) => (
                        <div key={history.id} className="relative">
                          {index < assigneeHistory.length - 1 && (
                            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
                          )}
                          <div className="flex space-x-4">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                <UserCheck className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-medium text-gray-900">
                                    {history.fromAgent ?
                                      `Reassigned from ${history.fromAgent} to ${history.toAgent}` :
                                      `Assigned to ${history.toAgent}`
                                    }
                                  </p>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {new Date(history.changedAt).toLocaleString()}
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600">Changed by: {history.changedBy}</p>
                                {history.reason && (
                                  <p className="text-xs text-gray-500 mt-1">Reason: {history.reason}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <History className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm text-gray-500">No assignment history</p>
                      <p className="text-xs text-gray-400">Assignment changes will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Information - Only show in details tab */}
        {activeTab === 'details' && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Created: {new Date(lead.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Tag className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Lead ID: #{lead.id}
                </span>
              </div>
            </div>
            {lead.notes && (
              <div className="mt-3">
                <span className="text-xs text-gray-500">Original Notes: </span>
                <p className="text-sm text-gray-900 mt-1">{lead.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Last updated: {new Date(lead.updatedAt || lead.createdAt).toLocaleString()}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Add edit functionality here
                onClose()
              }}
              className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            >
              <Edit3 className="h-4 w-4 mr-2 inline" />
              Edit Lead
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ViewLeadModal

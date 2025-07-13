import React from 'react'
import {
  User, Phone, Mail, MapPin, Calendar, Tag, Home, DollarSign,
  MessageSquare, Clock, History, UserCheck, FileText, X, Plus, Send
} from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'https://leadestate-backend-9fih.onrender.com/api'

const ViewLeadModalSimple = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null

  // Real data state management - minimal hooks to avoid React Error #310
  const [activeTab, setActiveTab] = React.useState('details')
  const [notes, setNotes] = React.useState([])
  const [assigneeHistory, setAssigneeHistory] = React.useState([])
  const [newNote, setNewNote] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [dataLoaded, setDataLoaded] = React.useState(false)

  // Fetch real data when modal opens or lead changes
  React.useEffect(() => {
    if (isOpen && lead?.id && !dataLoaded) {
      fetchRealData()
    }
  }, [isOpen, lead?.id, dataLoaded])

  // Refresh data when lead assignment changes
  React.useEffect(() => {
    if (isOpen && lead?.id && dataLoaded) {
      // Refresh assignment history when lead data might have changed
      const refreshTimer = setTimeout(() => {
        fetchRealData()
      }, 1000) // Small delay to allow backend to process

      return () => clearTimeout(refreshTimer)
    }
  }, [lead?.assignedTo, lead?.updatedAt])

  const fetchRealData = async () => {
    setLoading(true)
    try {
      console.log('🔄 Fetching data for lead:', lead.id)

      // Fetch notes
      const notesResponse = await fetch(`${API_URL}/leads/${lead.id}/notes`)
      console.log('📝 Notes response status:', notesResponse.status)
      if (notesResponse.ok) {
        const notesData = await notesResponse.json()
        console.log('📝 Notes data:', notesData)
        setNotes(notesData.data || [])
      } else {
        console.error('❌ Failed to fetch notes:', notesResponse.status)
      }

      // Fetch assignment history
      const historyResponse = await fetch(`${API_URL}/leads/${lead.id}/assignee-history`)
      console.log('📋 History response status:', historyResponse.status)
      if (historyResponse.ok) {
        const historyData = await historyResponse.json()
        console.log('📋 History data:', historyData)
        setAssigneeHistory(historyData.data || [])
      } else {
        console.error('❌ Failed to fetch history:', historyResponse.status)
      }

      setDataLoaded(true)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      console.log('Note is empty, not adding')
      return
    }

    console.log('Adding note:', newNote.trim(), 'to lead:', lead.id)
    setLoading(true)

    try {
      const noteData = {
        content: newNote.trim(),
        type: 'note',
        createdBy: 'Current User' // You can get this from auth context
      }

      console.log('Sending note data:', noteData)

      const response = await fetch(`${API_URL}/leads/${lead.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteData)
      })

      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response data:', result)

      if (response.ok && result.success) {
        setNotes(prev => [result.data, ...prev])
        setNewNote('')
        console.log('Note added successfully')
      } else {
        console.error('Failed to add note:', result.message)
        alert('Failed to add note: ' + (result.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error adding note:', error)
      alert('Error adding note: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Reset data when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setNotes([])
      setAssigneeHistory([])
      setNewNote('')
      setDataLoaded(false)
      setActiveTab('details')
    }
  }, [isOpen])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-yellow-100 text-yellow-800',
      qualified: 'bg-green-100 text-green-800',
      converted: 'bg-purple-100 text-purple-800',
      lost: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold mb-1">{lead.name}</h2>
              <div className="flex items-center space-x-4 text-blue-100 text-sm">
                <span className="flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  {lead.email}
                </span>
                <span className="flex items-center">
                  <Phone className="w-3 h-3 mr-1" />
                  {lead.phone}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-6 px-4">
            {[
              { id: 'details', label: 'Details', icon: User },
              { id: 'notes', label: 'Notes & Comments', icon: MessageSquare },
              { id: 'history', label: 'Assignment History', icon: History }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`py-3 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[55vh]">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-4">
              {/* Contact Information */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-base font-semibold mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{lead.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{lead.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{lead.city}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Requirements */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Home className="w-5 h-5 mr-2 text-blue-600" />
                  Property Requirements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-600">Property Type:</span>
                    <span className="font-medium">{lead.propertyType}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">{lead.budget}</span>
                  </div>
                </div>
              </div>

              {/* Assignment */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                  Assignment
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">Assigned to:</span>
                  <span className="font-medium">{lead.assignedTo}</span>
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Add New Note */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-semibold mb-3 flex items-center">
                  <Plus className="w-4 h-4 mr-2 text-blue-600" />
                  Add New Note
                </h3>
                <div className="space-y-3">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note or comment..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleAddNote}
                      disabled={!newNote.trim() || loading}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Add Note</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                {loading && notes.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">Loading notes...</div>
                ) : notes.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No notes yet. Add the first note above.</div>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900">{note.createdBy}</span>
                        <span className="text-sm text-gray-500">{formatDate(note.createdAt)}</span>
                      </div>
                      <p className="text-gray-700">{note.content}</p>
                      {note.type && note.type !== 'note' && (
                        <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {note.type}
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold flex items-center">
                <History className="w-4 h-4 mr-2 text-blue-600" />
                Assignment History
              </h3>

              <div className="space-y-3">
                {loading && assigneeHistory.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">Loading assignment history...</div>
                ) : assigneeHistory.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
                    <History className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p>No assignment history available.</p>
                    <p className="text-sm mt-1">Assignment changes will appear here.</p>
                  </div>
                ) : (
                  assigneeHistory.map((record) => (
                    <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-gray-900">
                            {record.fromAgent ? `${record.fromAgent} → ${record.toAgent}` : `Assigned to ${record.toAgent}`}
                          </span>
                          {record.reason && (
                            <p className="text-sm text-gray-600 mt-1">{record.reason}</p>
                          )}
                          {record.actionType && (
                            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                              record.actionType === 'initial_assignment'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {record.actionType === 'initial_assignment' ? 'Initial Assignment' : 'Reassignment'}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{formatDate(record.changedAt)}</span>
                      </div>
                      <p className="text-xs text-gray-500">Changed by: {record.changedBy}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-3 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewLeadModalSimple

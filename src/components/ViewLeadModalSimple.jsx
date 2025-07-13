import React from 'react'
import {
  User, Phone, Mail, MapPin, Calendar, Tag, Home, DollarSign,
  MessageSquare, Clock, History, UserCheck, FileText, X
} from 'lucide-react'

const ViewLeadModalSimple = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null

  // Static mock data to avoid any state management issues
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

  const [activeTab, setActiveTab] = React.useState('details')

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
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
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
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Notes & Comments</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Add Note
                </button>
              </div>
              
              <div className="space-y-3">
                {mockNotes.map((note) => (
                  <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{note.createdBy}</span>
                      <span className="text-sm text-gray-500">{formatDate(note.createdAt)}</span>
                    </div>
                    <p className="text-gray-700">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Assignment History</h3>
              
              <div className="space-y-3">
                {mockHistory.map((record) => (
                  <div key={record.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-medium text-gray-900">
                          {record.fromAgent ? `${record.fromAgent} → ${record.toAgent}` : `Assigned to ${record.toAgent}`}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">{record.reason}</p>
                      </div>
                      <span className="text-sm text-gray-500">{formatDate(record.changedAt)}</span>
                    </div>
                    <p className="text-xs text-gray-500">Changed by: {record.changedBy}</p>
                  </div>
                ))}
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

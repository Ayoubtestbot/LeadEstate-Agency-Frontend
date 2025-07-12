import { useState } from 'react'
import { useData, useAuth } from '../App'
import { usePermissions, PERMISSIONS, USER_ROLES, ROLE_DISPLAY_NAMES } from '../contexts/PermissionsContext'
import { useLanguage } from '../contexts/LanguageContext'
import ProtectedComponent from '../components/ProtectedComponent'
import AddTeamMemberModal from '../components/AddTeamMemberModal'
import EditTeamMemberModal from '../components/EditTeamMemberModal'
import { useToast } from '../components/Toast'
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Calendar,
  BarChart3,
  Settings,
  UserCheck,
  Crown,
  Star,
  User,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react'

const Team = () => {
  const { leads, teamMembers, addTeamMember, updateTeamMember, deleteTeamMember } = useData()
  const { user } = useAuth()
  const { hasPermission } = usePermissions()
  const { showToast } = useToast()
  const { t } = useLanguage()

  // Calculate dynamic stats for each team member based on assigned leads
  const calculateMemberStats = (memberName) => {
    const memberLeads = leads.filter(lead => lead.assignedTo === memberName)
    const activeLeads = memberLeads.filter(lead => ['new', 'contacted', 'qualified'].includes(lead.status))
    const closedDeals = memberLeads.filter(lead => lead.status === 'closed_won')
    const conversionRate = memberLeads.length > 0 ? ((closedDeals.length / memberLeads.length) * 100).toFixed(1) : 0

    return {
      totalLeads: memberLeads.length,
      activeLeads: activeLeads.length,
      closedDeals: closedDeals.length,
      conversionRate: parseFloat(conversionRate)
    }
  }
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showAddMember, setShowAddMember] = useState(false)
  const [editMember, setEditMember] = useState(null)

  // Handler functions
  const handleAddMember = async (memberData) => {
    try {
      console.log('🎯 Team component: Adding member:', memberData)
      await addTeamMember(memberData)
      console.log('✅ Team component: Member added successfully')
      showToast(`${memberData.name} has been added to the team`, 'success')
    } catch (error) {
      console.error('❌ Team component: Error adding member:', error)
      showToast(`Failed to add ${memberData.name}: ${error.message}`, 'error')
    }
  }

  const handleEditMember = (memberId, memberData) => {
    updateTeamMember(memberId, memberData)
    showToast(`${memberData.name}'s information has been updated`, 'success')
  }

  const handleDeleteMember = (member) => {
    if (confirm(`Are you sure you want to remove ${member.name} from the team?`)) {
      deleteTeamMember(member.id)
      showToast(`${member.name} has been removed from the team`, 'success')
    }
  }

  // Filter team members
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    return matchesSearch && matchesRole
  })

  const getRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.MANAGER: return Crown
      case USER_ROLES.SUPER_AGENT: return Star
      case USER_ROLES.AGENT: return User
      default: return User
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.MANAGER: return 'bg-purple-100 text-purple-800'
      case USER_ROLES.SUPER_AGENT: return 'bg-blue-100 text-blue-800'
      case USER_ROLES.AGENT: return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const TeamMemberCard = ({ member }) => {
    const RoleIcon = getRoleIcon(member.role)
    const memberStats = calculateMemberStats(member.name)

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                  <RoleIcon className="h-3 w-3 mr-1" />
                  {ROLE_DISPLAY_NAMES[member.role]}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {member.status}
                </span>
              </div>
            </div>
          </div>
          
          <ProtectedComponent permission={PERMISSIONS.MANAGE_USERS}>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setEditMember(member)}
                className="p-1 text-gray-400 hover:text-gray-600"
                title="Edit Member"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteMember(member)}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Remove Member"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </ProtectedComponent>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            {member.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            {member.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Joined {new Date(member.joinDate).toLocaleDateString()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{memberStats.totalLeads}</p>
            <p className="text-xs text-gray-600">Total Leads</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{memberStats.activeLeads}</p>
            <p className="text-xs text-gray-600">Active Leads</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-green-600">{memberStats.closedDeals}</p>
            <p className="text-xs text-gray-600">Closed Deals</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">{memberStats.conversionRate}%</p>
            <p className="text-xs text-gray-600">Conversion</p>
          </div>
        </div>
      </div>
    )
  }

  const totalMembers = teamMembers.length
  const activeMembers = teamMembers.filter(m => m.status === 'active').length
  const totalLeads = teamMembers.reduce((sum, m) => sum + calculateMemberStats(m.name).totalLeads, 0)
  const totalDeals = teamMembers.reduce((sum, m) => sum + calculateMemberStats(m.name).closedDeals, 0)

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl" />

        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg">
                  <Users className="h-5 w-5 drop-shadow-sm" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                  {t('team.title') || 'Team Management'}
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3">
                Manage your real estate team and track performance metrics
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs text-blue-600 font-medium">{totalMembers} Team Members</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                  <span className="text-xs text-cyan-600 font-medium">{activeMembers} Active</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <ProtectedComponent permission={PERMISSIONS.MANAGE_USERS}>
                <button
                  onClick={() => {
                    console.log('Add Team Member button clicked')
                    setShowAddMember(true)
                  }}
                  className="group relative inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl hover:scale-105 h-12 px-6 py-3 w-full sm:w-auto"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700/20 to-cyan-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Plus className="h-5 w-5 mr-3 drop-shadow-sm relative z-10" />
                  <span className="relative z-10">{t('team.addMember') || 'Add Team Member'}</span>
                </button>
              </ProtectedComponent>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalMembers}</p>
              <p className="text-sm text-gray-600">{t('team.totalMembers') || 'Total Members'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{activeMembers}</p>
              <p className="text-sm text-gray-600">Active Members</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
              <p className="text-sm text-gray-600">Total Leads</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 mr-4">
              <Star className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalDeals}</p>
              <p className="text-sm text-gray-600">Closed Deals</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value={USER_ROLES.MANAGER}>Manager</option>
            <option value={USER_ROLES.SUPER_AGENT}>Super Agent</option>
            <option value={USER_ROLES.AGENT}>Agent</option>
          </select>
        </div>
      </div>

      {/* Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMembers.map(member => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No team members found</h3>
          <p className="text-gray-600">
            {searchTerm || roleFilter !== 'all'
              ? 'Try adjusting your search or filters.'
              : 'Add your first team member to get started.'
            }
          </p>
        </div>
      )}

      {/* Modals */}
      <AddTeamMemberModal
        isOpen={showAddMember}
        onClose={() => {
          console.log('Closing AddTeamMemberModal')
          setShowAddMember(false)
        }}
        onSubmit={handleAddMember}
      />

      <EditTeamMemberModal
        isOpen={!!editMember}
        onClose={() => setEditMember(null)}
        onSubmit={handleEditMember}
        member={editMember}
      />
    </div>
  )
}

export default Team

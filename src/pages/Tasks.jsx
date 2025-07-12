import { Plus, CheckSquare, Clock, Calendar, Bell, Target, Zap, Users } from 'lucide-react'

const Tasks = () => {
  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-3xl" />

        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg">
                  <CheckSquare className="h-6 w-6 drop-shadow-sm" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                  Task Management
                </h1>
              </div>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4">
                Stay organized and never miss a follow-up with powerful task management
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-sm text-orange-600 font-medium">Productivity Tools</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm text-red-600 font-medium">Coming Soon</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="group relative inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105 h-12 px-6 py-3 w-full sm:w-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-700/20 to-red-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Plus className="h-5 w-5 mr-3 drop-shadow-sm relative z-10" />
                <span className="relative z-10">Create Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Coming Soon Section */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-3xl" />
        <div className="relative p-12">
          <div className="text-center">
            <div className="relative mx-auto mb-8">
              <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center mx-auto shadow-lg">
                <CheckSquare className="h-16 w-16 text-orange-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Advanced Task Management
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Comprehensive task and follow-up management system is being developed to help you stay organized,
              track deadlines, and ensure no important client interaction is missed.
            </p>

            {/* Feature Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="group p-6 rounded-2xl bg-gradient-to-br from-orange-50/50 to-orange-100/50 border border-orange-200/50 hover:shadow-lg transition-all duration-300">
                <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg w-fit mx-auto mb-4">
                  <Clock className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Smart Reminders</h4>
                <p className="text-sm text-gray-600">Automated notifications for important deadlines</p>
              </div>

              <div className="group p-6 rounded-2xl bg-gradient-to-br from-red-50/50 to-red-100/50 border border-red-200/50 hover:shadow-lg transition-all duration-300">
                <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg w-fit mx-auto mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Priority Management</h4>
                <p className="text-sm text-gray-600">Organize tasks by priority and urgency</p>
              </div>

              <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50/50 to-purple-100/50 border border-purple-200/50 hover:shadow-lg transition-all duration-300">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg w-fit mx-auto mb-4">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Team Collaboration</h4>
                <p className="text-sm text-gray-600">Assign and track tasks across your team</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-500/20 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg hover:shadow-xl hover:scale-105 h-12 px-8 py-3">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-700/20 to-red-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Plus className="h-5 w-5 mr-3 drop-shadow-sm relative z-10" />
                <span className="relative z-10">Join Beta Program</span>
              </button>

              <button className="group relative inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20 disabled:pointer-events-none disabled:opacity-50 border border-gray-200/50 bg-white/80 text-gray-700 shadow-lg hover:shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-gray-50 hover:to-orange-50 h-12 px-8 py-3 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/0 to-orange-500/0 group-hover:from-gray-500/5 group-hover:to-orange-500/5 rounded-2xl transition-all duration-300" />
                <Bell className="h-5 w-5 mr-3 text-gray-500 group-hover:text-orange-600 transition-colors duration-300 drop-shadow-sm relative z-10" />
                <span className="relative z-10">Get Notified</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tasks

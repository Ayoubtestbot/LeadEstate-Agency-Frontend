import { BarChart3, TrendingUp, PieChart, LineChart, Download, Filter, Calendar, Eye } from 'lucide-react'

const Reports = () => {
  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl" />

        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
                  <BarChart3 className="h-6 w-6 drop-shadow-sm" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                  Analytics & Reports
                </h1>
              </div>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed mb-4">
                Gain powerful insights into your real estate business performance
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                  <span className="text-sm text-indigo-600 font-medium">Business Intelligence</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span className="text-sm text-purple-600 font-medium">Coming Soon</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="group relative inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 h-12 px-6 py-3 w-full sm:w-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/20 to-purple-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Eye className="h-5 w-5 mr-3 drop-shadow-sm relative z-10" />
                <span className="relative z-10">Preview Reports</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Coming Soon Section */}
      <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl" />
        <div className="relative p-12">
          <div className="text-center">
            <div className="relative mx-auto mb-8">
              <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mx-auto shadow-lg">
                <BarChart3 className="h-16 w-16 text-indigo-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Advanced Analytics Dashboard
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
              Comprehensive reporting and analytics platform is being developed to provide deep insights into your
              sales performance, lead conversion rates, and business growth metrics.
            </p>

            {/* Feature Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="group p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-indigo-100/50 border border-indigo-200/50 hover:shadow-lg transition-all duration-300">
                <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg w-fit mx-auto mb-4">
                  <PieChart className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Sales Analytics</h4>
                <p className="text-sm text-gray-600">Track conversion rates and revenue metrics</p>
              </div>

              <div className="group p-6 rounded-2xl bg-gradient-to-br from-purple-50/50 to-purple-100/50 border border-purple-200/50 hover:shadow-lg transition-all duration-300">
                <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg w-fit mx-auto mb-4">
                  <LineChart className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Performance Trends</h4>
                <p className="text-sm text-gray-600">Monitor growth patterns and forecasts</p>
              </div>

              <div className="group p-6 rounded-2xl bg-gradient-to-br from-blue-50/50 to-blue-100/50 border border-blue-200/50 hover:shadow-lg transition-all duration-300">
                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg w-fit mx-auto mb-4">
                  <Download className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Export & Share</h4>
                <p className="text-sm text-gray-600">Generate and share professional reports</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-105 h-12 px-8 py-3">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700/20 to-purple-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Eye className="h-5 w-5 mr-3 drop-shadow-sm relative z-10" />
                <span className="relative z-10">Request Demo</span>
              </button>

              <button className="group relative inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/20 disabled:pointer-events-none disabled:opacity-50 border border-gray-200/50 bg-white/80 text-gray-700 shadow-lg hover:shadow-xl hover:scale-105 hover:bg-gradient-to-r hover:from-gray-50 hover:to-indigo-50 h-12 px-8 py-3 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/0 to-indigo-500/0 group-hover:from-gray-500/5 group-hover:to-indigo-500/5 rounded-2xl transition-all duration-300" />
                <Calendar className="h-5 w-5 mr-3 text-gray-500 group-hover:text-indigo-600 transition-colors duration-300 drop-shadow-sm relative z-10" />
                <span className="relative z-10">Schedule Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports

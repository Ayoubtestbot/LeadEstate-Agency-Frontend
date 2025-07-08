import React, { useState, useEffect } from 'react'
import { Clock, Zap, Database, Wifi } from 'lucide-react'

const PerformanceMonitor = ({ loading, dataCount = {} }) => {
  const [loadTime, setLoadTime] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [showMonitor, setShowMonitor] = useState(false)

  // Track loading start time
  useEffect(() => {
    if (loading && !startTime) {
      setStartTime(Date.now())
      setLoadTime(null)
    } else if (!loading && startTime) {
      const endTime = Date.now()
      const duration = endTime - startTime
      setLoadTime(duration)
      setStartTime(null)
      
      // Show monitor for a few seconds after loading
      setShowMonitor(true)
      setTimeout(() => setShowMonitor(false), 5000)
    }
  }, [loading, startTime])

  // Don't show if no performance data
  if (!loading && !loadTime && !showMonitor) return null

  const getPerformanceColor = (time) => {
    if (time < 1000) return 'text-green-600 bg-green-50'
    if (time < 3000) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getPerformanceIcon = (time) => {
    if (time < 1000) return <Zap className="w-4 h-4" />
    if (time < 3000) return <Clock className="w-4 h-4" />
    return <Wifi className="w-4 h-4" />
  }

  const totalItems = Object.values(dataCount).reduce((sum, count) => sum + (count || 0), 0)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`
        px-4 py-2 rounded-lg shadow-lg border transition-all duration-300
        ${loading ? 'bg-blue-50 border-blue-200' : 
          loadTime ? `${getPerformanceColor(loadTime)} border-current` : 
          'bg-gray-50 border-gray-200'}
      `}>
        <div className="flex items-center space-x-2 text-sm">
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-blue-700 font-medium">Loading dashboard...</span>
            </>
          ) : loadTime ? (
            <>
              {getPerformanceIcon(loadTime)}
              <span className="font-medium">
                Loaded in {loadTime}ms
              </span>
              {totalItems > 0 && (
                <span className="text-xs opacity-75">
                  ({totalItems} items)
                </span>
              )}
            </>
          ) : null}
        </div>
        
        {loadTime && (
          <div className="mt-1 text-xs opacity-75">
            {loadTime < 1000 && '⚡ Excellent performance'}
            {loadTime >= 1000 && loadTime < 3000 && '⏱️ Good performance'}
            {loadTime >= 3000 && '🐌 Consider optimization'}
          </div>
        )}
      </div>
    </div>
  )
}

export default PerformanceMonitor

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Home, Eye, Edit, Trash2, Download, RefreshCw } from 'lucide-react'
import { useData } from '../App'
import { useToast } from '../components/Toast'
import AddPropertyModal from '../components/AddPropertyModal'
import ViewPropertyModal from '../components/ViewPropertyModal'
import EditPropertyModal from '../components/EditPropertyModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { downloadPropertyPDF } from '../services/pdfGenerator'

const Properties = () => {
  const { properties, addProperty, updateProperty, deleteProperty, refreshData } = useData()
  const { showToast } = useToast()
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [viewProperty, setViewProperty] = useState(null)
  const [editProperty, setEditProperty] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // AGGRESSIVE: Force complete data refresh when component mounts
  useEffect(() => {
    const aggressiveRefresh = async () => {
      try {
        console.log('🔄 Properties page: AGGRESSIVE refresh starting...')

        // STEP 1: Clear ALL possible caches
        localStorage.clear()
        sessionStorage.clear()

        // STEP 2: Force browser cache clear for API calls
        const timestamp = Date.now()
        const apiUrl = `https://leadestate-backend-9fih.onrender.com/api/properties?_t=${timestamp}`

        console.log('🔄 Direct API call with cache busting...')
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`)
        }

        const freshData = await response.json()
        console.log('📋 Fresh API response:', freshData)

        // STEP 3: Also try the context refresh
        await refreshData(false)

        console.log('✅ Properties page: AGGRESSIVE refresh completed')
      } catch (error) {
        console.error('❌ Properties page: AGGRESSIVE refresh failed:', error)
      }
    }

    aggressiveRefresh()
  }, [refreshData])

  // Debug: Log properties data when it changes
  useEffect(() => {
    console.log('🏠 Properties data updated:', properties)
    if (properties.length > 0) {
      console.log('🔍 First property sample:', properties[0])
      console.log('🔍 Image URL:', properties[0].image_url)
      console.log('🔍 City:', properties[0].city)
    }
  }, [properties])

  const handleAddProperty = (propertyData) => {
    addProperty(propertyData)
    showToast(`Property "${propertyData.title}" added successfully!`, 'success')
  }

  const handleViewProperty = (property) => {
    setViewProperty(property)
  }

  const handleEditProperty = (property) => {
    setEditProperty(property)
  }

  const handleEditSubmit = (updatedData) => {
    updateProperty(editProperty.id, updatedData)
    showToast(`Property "${updatedData.title}" updated successfully!`, 'success')
    setEditProperty(null)
  }

  const handleDeleteProperty = (property) => {
    setDeleteConfirm(property)
  }

  const confirmDelete = () => {
    deleteProperty(deleteConfirm.id)
    showToast(`${deleteConfirm.title} deleted successfully!`, 'success')
    setDeleteConfirm(null)
  }

  const handleDownloadPDF = async (property, event) => {
    // Prevent any default behavior or navigation
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    try {
      console.log('📄 PDF Download - Property Data:', property)
      console.log('📄 PDF Download - Available fields:', Object.keys(property))
      console.log('📄 PDF Download - City:', property.city)
      console.log('📄 PDF Download - Address:', property.address)
      console.log('📄 PDF Download - Location:', property.location)
      console.log('📄 PDF Download - Image URL:', property.image_url)
      console.log('📄 PDF Download - Images:', property.images)

      showToast('Generating PDF...', 'info')
      const success = await downloadPropertyPDF(property)
      if (success) {
        showToast(`PDF for "${property.title}" downloaded successfully!`, 'success')
      } else {
        showToast('Failed to generate PDF. Please try again.', 'error')
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      showToast('Failed to generate PDF. Please try again.', 'error')
    }
  }

  const handleRefreshData = async () => {
    try {
      console.log('🔄 Manual refresh triggered...')
      await refreshData(true) // Force refresh without loading spinner
      console.log('✅ Manual refresh completed')
    } catch (error) {
      console.error('❌ Error refreshing data:', error)
    }
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="relative">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl" />

        <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-1.5 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg">
                  <Home className="h-5 w-5 drop-shadow-sm" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">
                  Properties Management
                </h1>
              </div>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-3">
                Manage your property listings and showcase your real estate portfolio
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-xs text-green-600 font-medium">{properties.length} Total Properties</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full" />
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-xs text-blue-600 font-medium">Active Listings</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleRefreshData}
                className="group relative inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-md hover:shadow-lg h-10 px-4 py-2 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-700/20 to-red-700/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">🔄 Force Refresh</span>
              </button>
              <button
                onClick={() => setShowAddProperty(true)}
                className="group relative inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500/20 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-md hover:shadow-lg h-10 px-4 py-2 w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-blue-700/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Plus className="h-4 w-4 mr-2 drop-shadow-sm relative z-10" />
                <span className="relative z-10">Add Property</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Properties List */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <div key={property.id} className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Enhanced Property Image with Fallback */}
              <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {/* Always show an image - use fallbacks if needed */}
                <img
                  src={property.image_url ||
                       (property.images && property.images.length > 0 ? property.images[0] : null) ||
                       `https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format`}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    console.log('❌ Image failed to load, using fallback')
                    // Try a different fallback image
                    e.target.src = 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&h=600&fit=crop&auto=format'
                  }}
                />
                <div
                  className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
                  style={{ display: property.image_url ? 'none' : 'flex' }}
                >
                  <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg">
                    <Home className="h-16 w-16 text-gray-400" />
                  </div>
                </div>

                {/* Property type badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm text-gray-800 shadow-lg border border-white/20">
                    🏠 {property.type}
                  </span>
                </div>

                {/* Price badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg">
                    ${parseInt(property.price).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="relative p-6">
                {/* Enhanced Property Header */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {property.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-600 font-medium capitalize">{property.type} Property</span>
                  </div>
                </div>

                {/* Enhanced Property Details */}
                <div className="space-y-4 mb-6">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50/50 to-blue-50/50 border border-gray-200/50">
                    <div className="flex items-center text-sm text-gray-700 mb-2">
                      <div className="p-1 rounded-lg bg-blue-100 mr-3">
                        <span className="text-blue-600">📍</span>
                      </div>
                      <span className="font-medium">
                        {(() => {
                          const city = property.city || property.location || 'Location not specified'
                          console.log(`🏠 ${property.title} - City: "${property.city}", Location: "${property.location}", Final: "${city}"`)
                          return city
                        })()}
                      </span>
                    </div>
                    {property.address && (
                      <div className="flex items-center text-sm text-gray-600">
                        <div className="p-1 rounded-lg bg-green-100 mr-3">
                          <Home className="h-3 w-3 text-green-600" />
                        </div>
                        <span>{property.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Property Specs */}
                  {(property.bedrooms || property.bathrooms || property.area) && (
                    <div className="grid grid-cols-3 gap-3">
                      {property.bedrooms && (
                        <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200/50">
                          <div className="text-lg mb-1">🛏️</div>
                          <div className="text-sm font-bold text-blue-800">{property.bedrooms}</div>
                          <div className="text-xs text-blue-600">Bedroom{property.bedrooms !== '1' ? 's' : ''}</div>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200/50">
                          <div className="text-lg mb-1">🚿</div>
                          <div className="text-sm font-bold text-green-800">{property.bathrooms}</div>
                          <div className="text-xs text-green-600">Bathroom{property.bathrooms !== '1' ? 's' : ''}</div>
                        </div>
                      )}
                      {property.area && (
                        <div className="text-center p-3 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200/50">
                          <div className="text-lg mb-1">📐</div>
                          <div className="text-sm font-bold text-purple-800">{parseInt(property.area).toLocaleString()}</div>
                          <div className="text-xs text-purple-600">Sq Ft</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Enhanced Description */}
                  {property.description && (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-gray-50/50 to-gray-100/50 border border-gray-200/50">
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {property.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Enhanced Footer */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    <span className="text-xs text-gray-500 font-medium">
                      Added {new Date(property.created_at || property.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewProperty(property)}
                      className="group p-2 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border border-blue-200/50 transition-all duration-300 hover:scale-110"
                      title="View Property"
                    >
                      <Eye className="h-4 w-4 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
                    </button>
                    <button
                      onClick={() => handleEditProperty(property)}
                      className="group p-2 rounded-xl bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border border-green-200/50 transition-all duration-300 hover:scale-110"
                      title="Edit Property"
                    >
                      <Edit className="h-4 w-4 text-green-600 group-hover:text-green-700 transition-colors duration-300" />
                    </button>
                    <button
                      onClick={(e) => handleDownloadPDF(property, e)}
                      className="group p-2 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border border-purple-200/50 transition-all duration-300 hover:scale-110"
                      title="Download PDF Brochure"
                    >
                      <Download className="h-4 w-4 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property)}
                      className="group p-2 rounded-xl bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 border border-red-200/50 transition-all duration-300 hover:scale-110"
                      title="Delete Property"
                    >
                      <Trash2 className="h-4 w-4 text-red-600 group-hover:text-red-700 transition-colors duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Enhanced Empty State */
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-3xl" />
          <div className="relative p-12 text-center">
            <div className="relative mx-auto mb-8">
              <div className="h-32 w-32 rounded-3xl bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center mx-auto shadow-lg">
                <Home className="h-16 w-16 text-green-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              No Properties Yet
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-md mx-auto">
              Start building your property portfolio by adding your first property listing and showcase your real estate offerings.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setShowAddProperty(true)}
                className="group relative inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/20 disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105 h-12 px-8 py-3"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-blue-700/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Plus className="h-5 w-5 mr-3 drop-shadow-sm relative z-10" />
                <span className="relative z-10">Add Your First Property</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddPropertyModal
        isOpen={showAddProperty}
        onClose={() => setShowAddProperty(false)}
        onSubmit={handleAddProperty}
      />

      <ViewPropertyModal
        isOpen={!!viewProperty}
        onClose={() => setViewProperty(null)}
        property={viewProperty}
      />

      <EditPropertyModal
        isOpen={!!editProperty}
        onClose={() => setEditProperty(null)}
        property={editProperty}
        onSubmit={handleEditSubmit}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmDelete}
        title="Delete Property"
        message={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

export default Properties

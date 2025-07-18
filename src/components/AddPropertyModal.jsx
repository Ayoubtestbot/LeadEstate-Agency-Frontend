import { useState } from 'react'
import { X, Home, DollarSign, MapPin, Upload, Image, Building } from 'lucide-react'
import PremiumDropdown from './PremiumDropdown'

const AddPropertyModal = ({ isOpen, onClose, onSubmit }) => {
  // Premium dropdown options
  const propertyTypeOptions = [
    { value: 'apartment', label: 'Apartment', icon: Building },
    { value: 'house', label: 'House', icon: Home },
    { value: 'studio', label: 'Studio', icon: Building },
    { value: 'loft', label: 'Loft', icon: Building },
    { value: 'duplex', label: 'Duplex', icon: Home },
    { value: 'penthouse', label: 'Penthouse', icon: Building },
    { value: 'villa', label: 'Villa', icon: Home }
  ]

  const [formData, setFormData] = useState({
    title: '',
    type: 'apartment',
    price: '',
    address: '',
    city: '',
    surface: '',
    description: '',
    image_url: '',
    bedrooms: '',
    bathrooms: ''
  })

  const [selectedImages, setSelectedImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [uploading, setUploading] = useState(false)

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)

    if (files.length > 0) {
      // Validate number of images (max 10)
      if (files.length > 10) {
        alert('❌ Maximum 10 images allowed. Please select fewer images.')
        e.target.value = '' // Clear the input
        return
      }

      // Validate file sizes (max 10MB each)
      const maxSize = 10 * 1024 * 1024 // 10MB in bytes
      const oversizedFiles = files.filter(file => file.size > maxSize)

      if (oversizedFiles.length > 0) {
        alert(`❌ Some images are larger than 10MB:\n${oversizedFiles.map(f => `• ${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB)`).join('\n')}\n\nPlease compress or choose smaller images.`)
        e.target.value = '' // Clear the input
        return
      }

      // Validate file types
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      const invalidFiles = files.filter(file => !allowedTypes.includes(file.type))

      if (invalidFiles.length > 0) {
        alert(`❌ Invalid file types:\n${invalidFiles.map(f => `• ${f.name}`).join('\n')}\n\nPlease select only JPG, PNG, GIF, or WebP images.`)
        e.target.value = '' // Clear the input
        return
      }

      setSelectedImages(files)

      // Create previews for all selected images
      const previews = []
      let loadedCount = 0

      files.forEach((file, index) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          previews[index] = e.target.result
          loadedCount++
          if (loadedCount === files.length) {
            setImagePreviews([...previews])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index)
    const newPreviews = imagePreviews.filter((_, i) => i !== index)
    setSelectedImages(newImages)
    setImagePreviews(newPreviews)
  }

  const uploadImages = async () => {
    if (selectedImages.length === 0) return []

    setUploading(true)
    try {
      const uploadPromises = selectedImages.map(async (image) => {
        const formData = new FormData()
        formData.append('image', image)

        const response = await fetch('https://leadestate-backend-9fih.onrender.com/api/properties/upload', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const result = await response.json()
          return `https://leadestate-backend-9fih.onrender.com${result.data.imageUrl}`
        } else {
          throw new Error('Failed to upload image')
        }
      })

      const uploadedUrls = await Promise.all(uploadPromises)
      return uploadedUrls.filter(url => url !== null)
    } catch (error) {
      console.error('Error uploading images:', error)
      return []
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Upload images first if selected
    let imageUrls = []
    if (selectedImages.length > 0) {
      imageUrls = await uploadImages()
    }

    // Format data for backend compatibility
    const propertyData = {
      title: formData.title,
      type: formData.type,
      price: parseFloat(formData.price) || 0,
      address: formData.address,
      city: formData.city,
      surface: parseFloat(formData.surface) || 0,
      description: formData.description,
      bedrooms: parseInt(formData.bedrooms) || 0,
      bathrooms: parseInt(formData.bathrooms) || 0,
      image_url: imageUrls[0] || '', // Main image (first one)
      images: imageUrls // All images
    }

    console.log('🏠 Submitting property data:', propertyData)
    onSubmit(propertyData)

    // Reset form
    setFormData({
      title: '',
      type: 'apartment',
      price: '',
      address: '',
      city: '',
      surface: '',
      description: '',
      image_url: '',
      bedrooms: '',
      bathrooms: ''
    })
    setSelectedImages([])
    setImagePreviews([])
    onClose()
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">Add New Property</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Beautiful 3BR Family Home"
              />
            </div>

            {/* Type and Price */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type *
                </label>
                <PremiumDropdown
                  options={propertyTypeOptions}
                  value={formData.type}
                  onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  placeholder="Select Property Type"
                  icon={Building}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="450000"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 123 Rue de la Paix"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Paris, Neuilly-sur-Seine"
              />
            </div>

            {/* Surface */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Surface (m²) *
              </label>
              <input
                type="number"
                name="surface"
                value={formData.surface}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 75"
              />
            </div>

            {/* Bedrooms and Bathrooms */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2"
                />
              </div>
            </div>

            {/* Multiple Images Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Images (Multiple)
              </label>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mb-4 grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Area */}
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload images</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, WebP up to 10MB each (Max 10 images)
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the property features, amenities, and highlights..."
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <div className="flex items-center">
                    <Upload className="animate-spin h-4 w-4 mr-2" />
                    Uploading...
                  </div>
                ) : (
                  'Add Property'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddPropertyModal

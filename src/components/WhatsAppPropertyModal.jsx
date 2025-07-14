import { useState } from 'react'
import { X, MessageCircle, Send, Image, MapPin, DollarSign, Home, FileText, Download } from 'lucide-react'
import { useData } from '../App'
import { generatePropertyPDFBlob, DEFAULT_AGENCY_INFO } from '../services/pdfGenerator'

const WhatsAppPropertyModal = ({ isOpen, onClose, lead }) => {
  const { properties } = useData()
  const [selectedProperties, setSelectedProperties] = useState([])
  const [customMessage, setCustomMessage] = useState('')
  const [isGeneratingPDFs, setIsGeneratingPDFs] = useState(false)

  if (!isOpen || !lead) return null

  // Show all properties (remove status filtering to show all available properties)
  const availableProperties = properties || []

  const togglePropertySelection = (propertyId) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    )
  }

  const generateWhatsAppMessage = () => {
    const selectedProps = properties.filter(p => selectedProperties.includes(p.id))

    let message = `Hi ${lead.name}! 👋\n\n`
    message += `I've prepared professional property brochures for you! 📄✨\n\n`
    message += `Here are ${selectedProps.length} amazing propert${selectedProps.length === 1 ? 'y' : 'ies'} that might interest you:\n\n`

    selectedProps.forEach((property, index) => {
      message += `📋 *${property.title}*\n`
      message += `📍 ${property.location || property.city || 'Prime Location'}\n`
      message += `💰 ${property.price ? `$${parseInt(property.price).toLocaleString()}` : 'Price on Request'}\n`
      message += `🏠 ${property.bedrooms || 'N/A'} bed • ${property.bathrooms || 'N/A'} bath\n`
      message += `📐 ${property.surface || property.area || 'N/A'} m²\n\n`
    })

    message += `📎 I'm attaching detailed PDF brochures with:\n`
    message += `• High-quality property photos\n`
    message += `• Complete specifications & floor plans\n`
    message += `• Professional layout & design\n`
    message += `• Our agency contact information\n`
    message += `• Pricing and availability details\n\n`

    if (customMessage.trim()) {
      message += `${customMessage}\n\n`
    }

    message += `Would you like to schedule a viewing? Let me know! 😊\n\n`
    message += `Best regards,\n${DEFAULT_AGENCY_INFO.name}\n📞 ${DEFAULT_AGENCY_INFO.phone}`

    return encodeURIComponent(message)
  }

  const sendWhatsAppMessage = async () => {
    if (selectedProperties.length === 0) {
      alert('Please select at least one property to share.')
      return
    }

    setIsGeneratingPDFs(true)

    try {
      // Generate PDFs for selected properties
      const selectedProps = properties.filter(p => selectedProperties.includes(p.id))

      // Open PDF windows for each property
      const printPromises = selectedProps.map(async (property) => {
        const result = await generatePropertyPDFBlob(property, DEFAULT_AGENCY_INFO)
        return { property: property.title, success: result.success }
      })

      const results = await Promise.all(printPromises)
      const successCount = results.filter(r => r.success).length

      if (successCount > 0) {
        // Generate WhatsApp message
        const message = generateWhatsAppMessage()
        const phoneNumber = lead.phone.replace(/\D/g, '') // Remove non-digits
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`

        // Show detailed instructions
        const instructionModal = document.createElement('div')
        instructionModal.innerHTML = `
          <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.3);">
              <h2 style="color: #2c3e50; margin-bottom: 20px;">📄 PDF Brochures Ready!</h2>
              <p style="color: #34495e; margin-bottom: 20px; line-height: 1.6;">
                <strong>${successCount} property brochure${successCount === 1 ? '' : 's'} opened in new window${successCount === 1 ? '' : 's'}!</strong>
              </p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: left;">
                <h3 style="color: #2c3e50; margin-bottom: 15px;">📋 How to send via WhatsApp:</h3>
                <ol style="color: #34495e; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li><strong>Save PDFs:</strong> Click "📄 Save as PDF" button in each window</li>
                  <li><strong>Choose location:</strong> Save to Downloads or Desktop</li>
                  <li><strong>Open WhatsApp:</strong> Click "Open WhatsApp" below</li>
                  <li><strong>Attach files:</strong> Use 📎 attachment button in WhatsApp</li>
                  <li><strong>Select PDFs:</strong> Choose the saved PDF files</li>
                  <li><strong>Send message:</strong> Your message is already prepared!</li>
                </ol>
              </div>
              <div style="display: flex; gap: 15px; justify-content: center;">
                <button onclick="window.open('${whatsappUrl}', '_blank')" style="background: #25d366; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                  📱 Open WhatsApp
                </button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #95a5a6; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                  ✖ Close
                </button>
              </div>
            </div>
          </div>
        `
        document.body.appendChild(instructionModal)
        onClose()
      } else {
        alert('❌ Failed to generate PDF brochures. Please try again.')
      }
    } catch (error) {
      console.error('Error generating PDFs:', error)
      alert('❌ Error generating PDF brochures. Please try again.')
    } finally {
      setIsGeneratingPDFs(false)
    }
  }

  const PropertyCard = ({ property }) => {
    const isSelected = selectedProperties.includes(property.id)
    
    return (
      <div 
        onClick={() => togglePropertySelection(property.id)}
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
          isSelected 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {property.image_url ? (
              <img
                src={property.image_url}
                alt={property.title}
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div
              className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center"
              style={{ display: property.image_url ? 'none' : 'flex' }}
            >
              <Home className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {property.title}
            </h4>
            <div className="mt-1 space-y-1">
              <div className="flex items-center text-xs text-gray-600">
                <MapPin className="h-3 w-3 mr-1" />
                {property.location}
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <DollarSign className="h-3 w-3 mr-1" />
                ${property.price?.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">
                {property.bedrooms} bed • {property.bathrooms} bath • {property.area} sq ft
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              isSelected 
                ? 'border-green-500 bg-green-500' 
                : 'border-gray-300'
            }`}>
              {isSelected && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <MessageCircle className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Send Property Brochures via WhatsApp
              </h2>
              <p className="text-sm text-gray-600">
                Generate professional PDF brochures for {lead.name} ({lead.phone})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Property Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              Select Properties to Share
            </h3>
            
            {availableProperties.length > 0 ? (
              <div className="space-y-3">
                {availableProperties.map(property => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Home className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No properties available to share</p>
              </div>
            )}
          </div>

          {/* Custom Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Message (Optional)
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add a personal message..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Preview */}
          {selectedProperties.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Message Preview:</h4>
              <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600 max-h-32 overflow-y-auto">
                <pre className="whitespace-pre-wrap font-sans">
                  {decodeURIComponent(generateWhatsAppMessage())}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedProperties.length} propert{selectedProperties.length === 1 ? 'y' : 'ies'} selected
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={sendWhatsAppMessage}
              disabled={selectedProperties.length === 0 || isGeneratingPDFs}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isGeneratingPDFs ? (
                <>
                  <FileText className="h-4 w-4 mr-2 animate-pulse" />
                  Generating PDFs...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Generate PDFs & Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhatsAppPropertyModal

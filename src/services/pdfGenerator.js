import jsPDF from 'jspdf'

// Professional PDF Generator for Property Brochures
export class PropertyPDFGenerator {
  constructor() {
    this.doc = null
    this.pageWidth = 210 // A4 width in mm
    this.pageHeight = 297 // A4 height in mm
    this.margin = 20
    this.contentWidth = this.pageWidth - (this.margin * 2)
  }

  // Generate professional property PDF
  async generatePropertyPDF(property, agencyInfo = {}) {
    this.doc = new jsPDF()
    
    try {
      // Set up document
      this.setupDocument()
      
      // Add header with agency branding
      this.addHeader(agencyInfo)
      
      // Add property title and hero section
      this.addPropertyHero(property)
      
      // Add property details
      this.addPropertyDetails(property)
      
      // Add property description
      this.addPropertyDescription(property)
      
      // Add contact information
      this.addContactInfo(agencyInfo)
      
      // Add footer
      this.addFooter(agencyInfo)
      
      return this.doc
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    }
  }

  setupDocument() {
    // Set document properties
    this.doc.setProperties({
      title: 'Property Brochure',
      subject: 'Real Estate Property Information',
      author: 'LeadEstate Agency',
      creator: 'LeadEstate CRM'
    })
  }

  addHeader(agencyInfo) {
    const y = 20
    
    // Agency name/logo area
    this.doc.setFillColor(41, 128, 185) // Professional blue
    this.doc.rect(0, 0, this.pageWidth, 25, 'F')
    
    // Agency name
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(agencyInfo.name || 'LeadEstate Agency', this.margin, 15)
    
    // Tagline
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('Your Trusted Real Estate Partner', this.margin, 20)
    
    // Contact info in header
    this.doc.setFontSize(9)
    const headerContact = `${agencyInfo.phone || '+212 600 000 000'} | ${agencyInfo.email || 'contact@leadestate.com'}`
    this.doc.text(headerContact, this.pageWidth - this.margin - this.doc.getTextWidth(headerContact), 15)
  }

  addPropertyHero(property) {
    let y = 40
    
    // Property title
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(property.title || 'Beautiful Property', this.margin, y)
    y += 10
    
    // Property type and location
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(100, 100, 100)
    const subtitle = `${property.type || 'Property'} • ${property.city || property.location || 'Prime Location'}`
    this.doc.text(subtitle, this.margin, y)
    y += 15
    
    // Price - prominent display
    this.doc.setFillColor(46, 204, 113) // Green background
    this.doc.roundedRect(this.margin, y, 60, 12, 2, 2, 'F')
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    const price = property.price ? `$${parseInt(property.price).toLocaleString()}` : 'Price on Request'
    this.doc.text(price, this.margin + 5, y + 8)
    
    return y + 20
  }

  addPropertyDetails(property) {
    let y = 90
    
    // Details section header
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Property Details', this.margin, y)
    y += 10
    
    // Details grid
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'normal')
    
    const details = [
      { label: 'Property Type:', value: property.type || 'N/A' },
      { label: 'Location:', value: property.address || property.city || property.location || 'N/A' },
      { label: 'Surface Area:', value: property.surface ? `${property.surface} m²` : property.area ? `${property.area} m²` : 'N/A' },
      { label: 'Bedrooms:', value: property.bedrooms || 'N/A' },
      { label: 'Bathrooms:', value: property.bathrooms || 'N/A' },
      { label: 'Status:', value: property.status || 'Available' }
    ]
    
    details.forEach((detail, index) => {
      const row = Math.floor(index / 2)
      const col = index % 2
      const x = this.margin + (col * (this.contentWidth / 2))
      const rowY = y + (row * 8)
      
      // Label
      this.doc.setFont('helvetica', 'bold')
      this.doc.setTextColor(80, 80, 80)
      this.doc.text(detail.label, x, rowY)
      
      // Value
      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(0, 0, 0)
      this.doc.text(detail.value, x + 35, rowY)
    })
    
    return y + (Math.ceil(details.length / 2) * 8) + 10
  }

  addPropertyDescription(property) {
    let y = 150
    
    if (property.description) {
      // Description header
      this.doc.setTextColor(0, 0, 0)
      this.doc.setFontSize(16)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text('Description', this.margin, y)
      y += 10
      
      // Description text
      this.doc.setFontSize(11)
      this.doc.setFont('helvetica', 'normal')
      this.doc.setTextColor(60, 60, 60)
      
      // Split text into lines that fit the page width
      const lines = this.doc.splitTextToSize(property.description, this.contentWidth)
      lines.forEach(line => {
        this.doc.text(line, this.margin, y)
        y += 6
      })
      
      y += 10
    }
    
    return y
  }

  addContactInfo(agencyInfo) {
    let y = 220
    
    // Contact section with background
    this.doc.setFillColor(248, 249, 250)
    this.doc.rect(this.margin, y - 5, this.contentWidth, 35, 'F')
    
    // Contact header
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Contact Information', this.margin + 5, y + 5)
    
    // Contact details
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(60, 60, 60)
    
    const contacts = [
      `📞 Phone: ${agencyInfo.phone || '+212 600 000 000'}`,
      `📧 Email: ${agencyInfo.email || 'contact@leadestate.com'}`,
      `🌐 Website: ${agencyInfo.website || 'www.leadestate.com'}`,
      `📍 Address: ${agencyInfo.address || 'Casablanca, Morocco'}`
    ]
    
    contacts.forEach((contact, index) => {
      this.doc.text(contact, this.margin + 5, y + 15 + (index * 5))
    })
  }

  addFooter(agencyInfo) {
    const y = this.pageHeight - 15
    
    // Footer background
    this.doc.setFillColor(41, 128, 185)
    this.doc.rect(0, y - 5, this.pageWidth, 20, 'F')
    
    // Footer text
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(9)
    this.doc.setFont('helvetica', 'normal')
    
    const footerText = `Generated by LeadEstate CRM • ${new Date().toLocaleDateString()}`
    const textWidth = this.doc.getTextWidth(footerText)
    this.doc.text(footerText, (this.pageWidth - textWidth) / 2, y)
  }

  // Download PDF
  downloadPDF(filename) {
    if (this.doc) {
      this.doc.save(filename)
    }
  }

  // Get PDF as blob for WhatsApp sharing
  getPDFBlob() {
    if (this.doc) {
      return this.doc.output('blob')
    }
    return null
  }
}

// Default agency information
export const DEFAULT_AGENCY_INFO = {
  name: 'LeadEstate Agency',
  phone: '+212 600 000 000',
  email: 'contact@leadestate.com',
  website: 'www.leadestate.com',
  address: 'Casablanca, Morocco'
}

// Utility function to generate and download property PDF
export const downloadPropertyPDF = async (property, agencyInfo = DEFAULT_AGENCY_INFO) => {
  try {
    const generator = new PropertyPDFGenerator()
    await generator.generatePropertyPDF(property, agencyInfo)
    
    const filename = `${property.title || 'Property'}_Brochure.pdf`.replace(/[^a-zA-Z0-9]/g, '_')
    generator.downloadPDF(filename)
    
    return true
  } catch (error) {
    console.error('Error downloading property PDF:', error)
    return false
  }
}

// Utility function to generate PDF blob for WhatsApp
export const generatePropertyPDFBlob = async (property, agencyInfo = DEFAULT_AGENCY_INFO) => {
  try {
    const generator = new PropertyPDFGenerator()
    await generator.generatePropertyPDF(property, agencyInfo)
    
    return generator.getPDFBlob()
  } catch (error) {
    console.error('Error generating property PDF blob:', error)
    return null
  }
}

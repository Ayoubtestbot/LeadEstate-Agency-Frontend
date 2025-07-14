// Simple HTML-based PDF Generator using browser print functionality
// This approach is more reliable and doesn't have build issues

// Professional PDF Generator for Property Brochures
export class PropertyPDFGenerator {
  constructor() {
    this.printWindow = null
  }

  // Generate professional property PDF using HTML and browser print
  async generatePropertyPDF(property, agencyInfo = {}) {
    try {
      const htmlContent = this.generateHTMLContent(property, agencyInfo)
      return htmlContent
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    }
  }

  generateHTMLContent(property, agencyInfo) {
    const price = property.price ? `$${parseInt(property.price).toLocaleString()}` : 'Price on Request'
    const location = property.address || property.city || property.location || 'Prime Location'

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Property Brochure - ${property.title || 'Property'}</title>
    <style>
        @page {
            size: A4;
            margin: 0;
        }
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        .container {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            background: white;
        }
        .header {
            background: linear-gradient(135deg, #2980b9, #3498db);
            color: white;
            padding: 20px;
            margin: -20mm -20mm 20px -20mm;
            text-align: center;
        }
        .header h1 {
            font-size: 24px;
            margin-bottom: 5px;
        }
        .header p {
            font-size: 14px;
            opacity: 0.9;
        }
        .property-title {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
        }
        .property-subtitle {
            font-size: 16px;
            color: #7f8c8d;
            margin-bottom: 20px;
        }
        .price-badge {
            display: inline-block;
            background: linear-gradient(135deg, #27ae60, #2ecc71);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 30px;
        }
        .details-section {
            margin-bottom: 30px;
        }
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
            border-bottom: 2px solid #3498db;
            padding-bottom: 5px;
        }
        .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }
        .detail-item {
            display: flex;
            align-items: center;
        }
        .detail-label {
            font-weight: bold;
            color: #34495e;
            min-width: 120px;
        }
        .detail-value {
            color: #2c3e50;
        }
        .description {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
            border-left: 4px solid #3498db;
        }
        .contact-section {
            background: linear-gradient(135deg, #ecf0f1, #bdc3c7);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        .contact-item {
            display: flex;
            align-items: center;
            font-size: 14px;
        }
        .contact-icon {
            margin-right: 10px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            color: #7f8c8d;
            font-size: 12px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
        }
        @media print {
            body { -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>${agencyInfo.name || 'LeadEstate Agency'}</h1>
            <p>Your Trusted Real Estate Partner</p>
        </div>

        <!-- Property Title -->
        <div class="property-title">${property.title || 'Beautiful Property'}</div>
        <div class="property-subtitle">${property.type || 'Property'} • ${location}</div>

        <!-- Price -->
        <div class="price-badge">${price}</div>

        <!-- Property Details -->
        <div class="details-section">
            <div class="section-title">Property Details</div>
            <div class="details-grid">
                <div class="detail-item">
                    <span class="detail-label">Property Type:</span>
                    <span class="detail-value">${property.type || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Location:</span>
                    <span class="detail-value">${location}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Surface Area:</span>
                    <span class="detail-value">${property.surface ? `${property.surface} m²` : property.area ? `${property.area} m²` : 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Bedrooms:</span>
                    <span class="detail-value">${property.bedrooms || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Bathrooms:</span>
                    <span class="detail-value">${property.bathrooms || 'N/A'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${property.status || 'Available'}</span>
                </div>
            </div>
        </div>

        ${property.description ? `
        <!-- Description -->
        <div class="details-section">
            <div class="section-title">Description</div>
            <div class="description">
                ${property.description}
            </div>
        </div>
        ` : ''}

        <!-- Contact Information -->
        <div class="details-section">
            <div class="section-title">Contact Information</div>
            <div class="contact-section">
                <div class="contact-grid">
                    <div class="contact-item">
                        <span class="contact-icon">📞</span>
                        <span>Phone: ${agencyInfo.phone || '+212 600 000 000'}</span>
                    </div>
                    <div class="contact-item">
                        <span class="contact-icon">📧</span>
                        <span>Email: ${agencyInfo.email || 'contact@leadestate.com'}</span>
                    </div>
                    <div class="contact-item">
                        <span class="contact-icon">🌐</span>
                        <span>Website: ${agencyInfo.website || 'www.leadestate.com'}</span>
                    </div>
                    <div class="contact-item">
                        <span class="contact-icon">📍</span>
                        <span>Address: ${agencyInfo.address || 'Casablanca, Morocco'}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            Generated by LeadEstate CRM • ${new Date().toLocaleDateString()}
        </div>
    </div>
</body>
</html>
    `
  }

  // Open print dialog for PDF generation
  openPrintDialog(htmlContent, filename) {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Wait for content to load, then trigger print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }

    return printWindow
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
    const htmlContent = await generator.generatePropertyPDF(property, agencyInfo)

    const filename = `${property.title || 'Property'}_Brochure.pdf`.replace(/[^a-zA-Z0-9]/g, '_')
    generator.openPrintDialog(htmlContent, filename)

    return true
  } catch (error) {
    console.error('Error downloading property PDF:', error)
    return false
  }
}

// Utility function to generate PDF for WhatsApp (opens print dialog)
export const generatePropertyPDFBlob = async (property, agencyInfo = DEFAULT_AGENCY_INFO) => {
  try {
    const generator = new PropertyPDFGenerator()
    const htmlContent = await generator.generatePropertyPDF(property, agencyInfo)

    const filename = `${property.title || 'Property'}_Brochure.pdf`.replace(/[^a-zA-Z0-9]/g, '_')
    const printWindow = generator.openPrintDialog(htmlContent, filename)

    return { success: true, printWindow }
  } catch (error) {
    console.error('Error generating property PDF:', error)
    return { success: false, error }
  }
}

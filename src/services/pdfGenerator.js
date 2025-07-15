// Professional PDF Generator using pdfmake
// Direct PDF downloads without build issues

// Professional PDF Generator for Property Brochures
export class PropertyPDFGenerator {
  constructor() {
    this.pdfMake = null
  }

  // Lazy load pdfmake with better error handling
  async loadPdfMake() {
    if (!this.pdfMake) {
      try {
        const pdfMake = await import('pdfmake/build/pdfmake')
        const pdfFonts = await import('pdfmake/build/vfs_fonts')

        // Handle different import structures
        const pdfMakeInstance = pdfMake.default || pdfMake
        const fontsInstance = pdfFonts.default || pdfFonts

        // Set fonts with fallback
        if (fontsInstance.pdfMake && fontsInstance.pdfMake.vfs) {
          pdfMakeInstance.vfs = fontsInstance.pdfMake.vfs
        } else if (fontsInstance.vfs) {
          pdfMakeInstance.vfs = fontsInstance.vfs
        } else {
          console.warn('⚠️ PDF fonts not found, using basic fonts')
        }

        this.pdfMake = pdfMakeInstance
      } catch (error) {
        console.error('❌ Error loading pdfMake:', error)
        throw new Error('Failed to load PDF generator')
      }
    }
    return this.pdfMake
  }

  // Generate professional property PDF using simple HTML approach
  async generatePropertyPDF(property, agencyInfo = {}) {
    try {
      console.log('🔄 Starting PDF generation for:', property.title)

      // Use simple HTML-to-PDF approach (more reliable than pdfmake)
      return await this.generateSimplePDF(property, agencyInfo)

    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    }
  }

  // Direct PDF download using HTML content
  async generateSimplePDF(property, agencyInfo) {
    try {
      // Create HTML content for PDF
      const htmlContent = this.generateHTMLContent(property, agencyInfo)

      // Return download interface
      return {
        download: (filename) => {
          try {
            console.log('🔄 Starting download process for:', filename)

            // Create blob and download link
            const blob = new Blob([htmlContent], { type: 'text/html' })
            const url = URL.createObjectURL(blob)
            console.log('📄 Created blob URL:', url)

            // Try multiple download methods for better compatibility

            // Method 1: Standard download link
            const downloadLink = document.createElement('a')
            downloadLink.href = url
            downloadLink.download = filename + '.html'
            downloadLink.style.display = 'none'
            downloadLink.target = '_blank'

            // Add to DOM
            document.body.appendChild(downloadLink)
            console.log('📎 Added download link to DOM')

            // Try to trigger download
            try {
              downloadLink.click()
              console.log('✅ Download link clicked')
            } catch (clickError) {
              console.error('❌ Click failed:', clickError)

              // Method 2: Fallback - try programmatic click
              const event = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
              })
              downloadLink.dispatchEvent(event)
              console.log('🔄 Tried programmatic click')
            }

            // Method 3: Alternative approach - open in new window if download fails
            setTimeout(() => {
              try {
                // Check if download worked by seeing if the blob is still accessible
                fetch(url).then(() => {
                  console.log('⚠️ Download may have failed, opening in new window')
                  window.open(url, '_blank')
                }).catch(() => {
                  console.log('✅ Download likely succeeded')
                })
              } catch (e) {
                console.log('✅ Download completed')
              }
            }, 500)

            // Clean up after a delay
            setTimeout(() => {
              if (document.body.contains(downloadLink)) {
                document.body.removeChild(downloadLink)
              }
              URL.revokeObjectURL(url)
              console.log('🧹 Cleaned up download resources')
            }, 2000)

            return true
          } catch (error) {
            console.error('❌ Download error:', error)

            // Last resort: show user instructions
            alert(`Download failed. Please try again or contact support.\nError: ${error.message}`)
            return false
          }
        }
      }
    } catch (error) {
      console.error('PDF generation error:', error)
      throw error
    }
  }



  // Generate HTML content for PDF
  generateHTMLContent(property, agencyInfo) {
    const price = property.price ? `$${parseInt(property.price).toLocaleString()}` : 'Price on Request'

    // DEBUG: Enhanced location detection
    console.log('🔍 PDF Location Debug:')
    console.log('  - property.city:', property.city)
    console.log('  - property.address:', property.address)
    console.log('  - property.location:', property.location)

    const city = property.city || 'City not specified'
    const address = property.address || 'Address not specified'
    const location = `${city}${address && address !== city ? `, ${address}` : ''}`

    console.log('  - Final location for PDF:', location)

    // Get property images
    const mainImage = property.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop&auto=format'
    const galleryImages = property.images && Array.isArray(property.images) ? property.images.slice(0, 3) : [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&auto=format'
    ]

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Property Brochure - ${property.title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #2980b9 0%, #3498db 100%);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
          }
          .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 14px;
          }
          .content {
            padding: 40px;
          }
          .property-title {
            font-size: 32px;
            font-weight: 600;
            color: #2c3e50;
            margin-bottom: 10px;
          }
          .property-subtitle {
            font-size: 18px;
            color: #7f8c8d;
            margin-bottom: 20px;
          }
          .price-badge {
            display: inline-block;
            background: #27ae60;
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 30px;
          }
          .details-section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 20px;
            font-weight: 600;
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
            justify-content: space-between;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
          }
          .detail-label {
            font-weight: 600;
            color: #2c3e50;
          }
          .detail-value {
            color: #34495e;
          }
          .description {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            line-height: 1.6;
            color: #34495e;
            margin-bottom: 30px;
          }
          .contact-section {
            background: linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%);
            padding: 30px;
            border-radius: 10px;
            text-align: center;
          }
          .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 20px;
          }
          .contact-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .footer {
            text-align: center;
            padding: 20px;
            background: #34495e;
            color: white;
            font-size: 12px;
          }
          @media print {
            body { background: white; }
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Enhanced Professional Header -->
          <div class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
            <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: bold;">${agencyInfo.name || 'LeadEstate Agency'}</h1>
            <p style="margin: 0; font-size: 18px; opacity: 0.9;">Your Trusted Real Estate Partner</p>
            <div style="margin-top: 15px; font-size: 14px; opacity: 0.8;">
              📞 ${agencyInfo.phone || '+212 600 000 000'} | 📧 ${agencyInfo.email || 'contact@leadestate.com'} | 🌐 ${agencyInfo.website || 'www.leadestate.com'}
            </div>
          </div>

          <div class="content">
            <div class="property-title">${property.title || 'Beautiful Property'}</div>
            <div class="property-subtitle">${property.type || 'Property'} • ${location}</div>
            <div class="price-badge">${price}</div>

            <!-- Main Property Image -->
            <div style="margin: 30px 0; text-align: center;">
              <img src="${mainImage}" alt="${property.title}" style="width: 100%; max-width: 600px; height: 400px; object-fit: cover; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" />
            </div>

            <div class="details-section">
              <div class="section-title">Property Details</div>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Property Type:</span>
                  <span class="detail-value">${property.type || 'N/A'}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">City:</span>
                  <span class="detail-value">${city}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Address:</span>
                  <span class="detail-value">${address}</span>
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
                <div class="detail-item">
                  <span class="detail-label">Property ID:</span>
                  <span class="detail-value">#${property.id ? property.id.substring(0, 8) : 'N/A'}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Listed Date:</span>
                  <span class="detail-value">${property.created_at ? new Date(property.created_at).toLocaleDateString() : 'Recently Listed'}</span>
                </div>
              </div>
            </div>

            ${property.description ? `
              <div class="details-section">
                <div class="section-title">Description</div>
                <div class="description">${property.description}</div>
              </div>
            ` : ''}

            <!-- Property Gallery -->
            <div class="details-section">
              <div class="section-title">Property Gallery</div>
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 20px;">
                ${galleryImages.map(img => `
                  <img src="${img}" alt="Property view" style="width: 100%; height: 200px; object-fit: cover; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);" />
                `).join('')}
              </div>
            </div>

            <!-- Contact info is now in the header -->
          </div>

          <!-- Professional Footer -->
          <div class="footer">
            <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 15px; margin-top: 30px;">
              <h3 style="margin: 0 0 10px 0;">Ready to Schedule a Viewing?</h3>
              <p style="margin: 0 0 15px 0;">Contact our expert team today for personalized assistance</p>
              <div style="font-size: 18px; font-weight: bold;">📞 ${agencyInfo.phone || '+212 600 000 000'} | 📧 ${agencyInfo.email || 'contact@leadestate.com'}</div>
            </div>
            <div style="text-align: center; margin-top: 15px; color: #666; font-size: 12px;">
              Generated by LeadEstate CRM • ${new Date().toLocaleDateString()} • Property ID: #${property.id ? property.id.substring(0, 8) : 'N/A'}
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }

  createDocumentDefinition(property, agencyInfo) {
    const price = property.price ? `$${parseInt(property.price).toLocaleString()}` : 'Price on Request'
    const location = property.address || property.city || property.location || 'Prime Location'

    return {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],

      header: {
        columns: [
          {
            text: agencyInfo.name || 'LeadEstate Agency',
            style: 'header',
            margin: [40, 20, 0, 0]
          },
          {
            text: 'Your Trusted Real Estate Partner',
            style: 'subheader',
            alignment: 'right',
            margin: [0, 25, 40, 0]
          }
        ],
        background: '#2980b9'
      },

      content: [
        // Property Title
        {
          text: property.title || 'Beautiful Property',
          style: 'title',
          margin: [0, 20, 0, 10]
        },

        // Property Subtitle
        {
          text: `${property.type || 'Property'} • ${location}`,
          style: 'subtitle',
          margin: [0, 0, 0, 15]
        },

        // Price Badge
        {
          text: price,
          style: 'price',
          background: '#27ae60',
          color: 'white',
          margin: [0, 0, 0, 20]
        },

        // Property Details Table
        {
          text: 'Property Details',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        {
          table: {
            widths: ['30%', '70%'],
            body: [
              ['Property Type:', property.type || 'N/A'],
              ['Location:', location],
              ['Surface Area:', property.surface ? `${property.surface} m²` : property.area ? `${property.area} m²` : 'N/A'],
              ['Bedrooms:', property.bedrooms || 'N/A'],
              ['Bathrooms:', property.bathrooms || 'N/A'],
              ['Status:', property.status || 'Available']
            ]
          },
          layout: {
            fillColor: function (rowIndex) {
              return (rowIndex % 2 === 0) ? '#f8f9fa' : null
            }
          },
          margin: [0, 0, 0, 20]
        },

        // Description (if available)
        ...(property.description ? [
          {
            text: 'Description',
            style: 'sectionHeader',
            margin: [0, 10, 0, 10]
          },
          {
            text: property.description,
            style: 'description',
            margin: [0, 0, 0, 20]
          }
        ] : []),

        // Contact Information
        {
          text: 'Contact Information',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10]
        },
        {
          table: {
            widths: ['30%', '70%'],
            body: [
              ['📞 Phone:', agencyInfo.phone || '+212 600 000 000'],
              ['📧 Email:', agencyInfo.email || 'contact@leadestate.com'],
              ['🌐 Website:', agencyInfo.website || 'www.leadestate.com'],
              ['📍 Address:', agencyInfo.address || 'Casablanca, Morocco']
            ]
          },
          layout: {
            fillColor: '#ecf0f1'
          },
          margin: [0, 0, 0, 20]
        }
      ],

      footer: {
        text: `Generated by LeadEstate CRM • ${new Date().toLocaleDateString()}`,
        alignment: 'center',
        style: 'footer',
        margin: [0, 10, 0, 0]
      },

      styles: {
        header: {
          fontSize: 20,
          bold: true,
          color: 'white'
        },
        subheader: {
          fontSize: 10,
          color: 'white'
        },
        title: {
          fontSize: 24,
          bold: true,
          color: '#2c3e50'
        },
        subtitle: {
          fontSize: 14,
          color: '#7f8c8d'
        },
        price: {
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 8, 0, 8]
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          color: '#2c3e50'
        },
        description: {
          fontSize: 11,
          lineHeight: 1.4,
          color: '#34495e'
        },
        footer: {
          fontSize: 9,
          color: '#7f8c8d'
        }
      }
    }
  }

  setupDocument(doc, property, agencyInfo) {
    // Set document properties
    doc.setProperties({
      title: `${property.title || 'Property'} - Brochure`,
      subject: 'Real Estate Property Information',
      author: agencyInfo.name || 'LeadEstate Agency',
      creator: 'LeadEstate CRM'
    })

    let y = 20

    // Header with agency branding
    doc.setFillColor(41, 128, 185) // Professional blue
    doc.rect(0, 0, 210, 25, 'F')

    // Agency name
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(agencyInfo.name || 'LeadEstate Agency', 20, 15)

    // Tagline
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Your Trusted Real Estate Partner', 20, 20)

    y = 40

    // Property title
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text(property.title || 'Beautiful Property', 20, y)
    y += 10

    // Property subtitle
    doc.setFontSize(14)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 100, 100)
    const location = property.address || property.city || property.location || 'Prime Location'
    doc.text(`${property.type || 'Property'} • ${location}`, 20, y)
    y += 15

    // Price badge
    doc.setFillColor(46, 204, 113) // Green background
    doc.roundedRect(20, y, 60, 12, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    const price = property.price ? `$${parseInt(property.price).toLocaleString()}` : 'Price on Request'
    doc.text(price, 25, y + 8)
    y += 25

    // Property details table
    const details = [
      ['Property Type:', property.type || 'N/A'],
      ['Location:', location],
      ['Surface Area:', property.surface ? `${property.surface} m²` : property.area ? `${property.area} m²` : 'N/A'],
      ['Bedrooms:', property.bedrooms || 'N/A'],
      ['Bathrooms:', property.bathrooms || 'N/A'],
      ['Status:', property.status || 'Available']
    ]

    doc.autoTable({
      startY: y,
      head: [['Property Details', '']],
      body: details,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 14, fontStyle: 'bold' },
      bodyStyles: { fontSize: 11 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 }, 1: { cellWidth: 100 } },
      margin: { left: 20, right: 20 }
    })

    y = doc.lastAutoTable.finalY + 20

    // Description
    if (property.description) {
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(0, 0, 0)
      doc.text('Description', 20, y)
      y += 10

      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(60, 60, 60)

      const lines = doc.splitTextToSize(property.description, 170)
      lines.forEach(line => {
        doc.text(line, 20, y)
        y += 6
      })
      y += 10
    }

    // Contact information
    const contactData = [
      ['📞 Phone:', agencyInfo.phone || '+212 600 000 000'],
      ['📧 Email:', agencyInfo.email || 'contact@leadestate.com'],
      ['🌐 Website:', agencyInfo.website || 'www.leadestate.com'],
      ['📍 Address:', agencyInfo.address || 'Casablanca, Morocco']
    ]

    doc.autoTable({
      startY: y,
      head: [['Contact Information', '']],
      body: contactData,
      theme: 'grid',
      headStyles: { fillColor: [52, 73, 94], textColor: 255, fontSize: 14, fontStyle: 'bold' },
      bodyStyles: { fontSize: 11 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 }, 1: { cellWidth: 100 } },
      margin: { left: 20, right: 20 }
    })

    // Footer
    const pageHeight = doc.internal.pageSize.height
    doc.setFillColor(41, 128, 185)
    doc.rect(0, pageHeight - 15, 210, 15, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    const footerText = `Generated by LeadEstate CRM • ${new Date().toLocaleDateString()}`
    const textWidth = doc.getTextWidth(footerText)
    doc.text(footerText, (210 - textWidth) / 2, pageHeight - 5)
  }

  // Generate and download PDF file directly
  async downloadPDFFile(pdfDoc, filename) {
    try {
      // Direct PDF download using pdfmake
      pdfDoc.download(filename + '.pdf')
      return true
    } catch (error) {
      console.error('Error downloading PDF:', error)
      return false
    }
  }

  // Open print dialog for WhatsApp (legacy method)
  openPrintDialog(pdfDoc, filename) {
    // For WhatsApp, we'll just download the PDF
    return this.downloadPDFFile(pdfDoc, filename)
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
    console.log('🔄 Starting PDF generation for:', property.title)

    const generator = new PropertyPDFGenerator()
    const pdfDoc = await generator.generatePropertyPDF(property, agencyInfo)

    const filename = `${property.title || 'Property'}_Brochure`.replace(/[^a-zA-Z0-9]/g, '_')
    console.log('📄 Generated PDF, downloading as:', filename)

    const success = await generator.downloadPDFFile(pdfDoc, filename)

    if (success) {
      console.log('✅ PDF downloaded successfully')
    } else {
      console.log('❌ PDF download failed')
    }

    return success
  } catch (error) {
    console.error('❌ Error downloading property PDF:', error)
    return false
  }
}

// Utility function to generate PDF for WhatsApp
export const generatePropertyPDFBlob = async (property, agencyInfo = DEFAULT_AGENCY_INFO) => {
  try {
    const generator = new PropertyPDFGenerator()
    const pdfDoc = await generator.generatePropertyPDF(property, agencyInfo)

    const filename = `${property.title || 'Property'}_Brochure`.replace(/[^a-zA-Z0-9]/g, '_')

    // For WhatsApp, we'll download the PDF and show instructions
    const success = await generator.downloadPDFFile(pdfDoc, filename)

    return { success, filename: filename + '.pdf' }
  } catch (error) {
    console.error('Error generating property PDF:', error)
    return { success: false, error }
  }
}

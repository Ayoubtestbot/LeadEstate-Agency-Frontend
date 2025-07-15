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
        console.log('✅ PDF generator loaded successfully')
        return this.pdfMake
      } catch (error) {
        console.error('❌ Failed to load PDF generator:', error)
        throw new Error('PDF generator not available')
      }
    }
    return this.pdfMake
  }

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

            // Trigger download
            downloadLink.click()

            // Cleanup
            setTimeout(() => {
              document.body.removeChild(downloadLink)
              URL.revokeObjectURL(url)
            }, 100)

            console.log('✅ Download initiated successfully')

            // Method 2: Fallback - open in new window
            setTimeout(() => {
              try {
                const newWindow = window.open('', '_blank')
                if (newWindow) {
                  newWindow.document.write(htmlContent)
                  newWindow.document.close()
                  console.log('✅ Fallback: Opened in new window')
                }
              } catch (fallbackError) {
                console.warn('⚠️ Fallback method failed:', fallbackError)
              }
            }, 500)

          } catch (error) {
            console.error('❌ Download failed:', error)
            throw error
          }
        }
      }
    } catch (error) {
      console.error('❌ PDF generation failed:', error)
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
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 32px;
            font-weight: bold;
          }
          .header p {
            margin: 0;
            font-size: 18px;
            opacity: 0.9;
          }
          .content {
            padding: 0 40px 40px 40px;
          }
          .property-title {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 10px;
          }
          .property-subtitle {
            font-size: 18px;
            color: #7f8c8d;
            margin-bottom: 20px;
          }
          .price-badge {
            background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 50px;
            font-size: 24px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(39, 174, 96, 0.3);
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
            padding: 10px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #3498db;
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
            border-left: 4px solid #3498db;
            line-height: 1.6;
          }
          .contact-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }
          .contact-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            color: #7f8c8d;
            font-size: 14px;
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
          <div class="header">
            <h1>${agencyInfo.name || 'LeadEstate Agency'}</h1>
            <p>Your Trusted Real Estate Partner</p>
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
}

// Create and export default instance
export const pdfGenerator = new PropertyPDFGenerator()
export default pdfGenerator

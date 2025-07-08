import { useState, useEffect } from 'react'
import { Phone, ChevronDown } from 'lucide-react'

// Country codes with flags and common countries for real estate
const COUNTRY_CODES = [
  { code: '+212', country: 'Morocco', flag: '🇲🇦', name: 'MA' },
  { code: '+33', country: 'France', flag: '🇫🇷', name: 'FR' },
  { code: '+1', country: 'United States', flag: '🇺🇸', name: 'US' },
  { code: '+1', country: 'Canada', flag: '🇨🇦', name: 'CA' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', name: 'GB' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', name: 'DE' },
  { code: '+34', country: 'Spain', flag: '🇪🇸', name: 'ES' },
  { code: '+39', country: 'Italy', flag: '🇮🇹', name: 'IT' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱', name: 'NL' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪', name: 'BE' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭', name: 'CH' },
  { code: '+43', country: 'Austria', flag: '🇦🇹', name: 'AT' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹', name: 'PT' },
  { code: '+971', country: 'UAE', flag: '🇦🇪', name: 'AE' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', name: 'SA' },
]

// Default country based on common real estate markets
const getDefaultCountryCode = () => {
  // Try to detect user's location or use Morocco as default for this platform
  const userLanguage = navigator.language || navigator.userLanguage
  
  if (userLanguage.includes('fr')) return '+33' // France
  if (userLanguage.includes('en-US')) return '+1' // US
  if (userLanguage.includes('en-GB')) return '+44' // UK
  if (userLanguage.includes('de')) return '+49' // Germany
  if (userLanguage.includes('es')) return '+34' // Spain
  if (userLanguage.includes('it')) return '+39' // Italy
  
  // Default to Morocco for LeadEstate platform
  return '+212'
}

const PhoneInput = ({ 
  value = '', 
  onChange, 
  placeholder = 'Enter phone number',
  required = false,
  className = '',
  name = 'phone'
}) => {
  const [selectedCountry, setSelectedCountry] = useState(() => {
    // If value already has a country code, extract it
    if (value && value.startsWith('+')) {
      const matchingCountry = COUNTRY_CODES.find(country => 
        value.startsWith(country.code)
      )
      return matchingCountry || COUNTRY_CODES.find(c => c.code === getDefaultCountryCode())
    }
    return COUNTRY_CODES.find(c => c.code === getDefaultCountryCode())
  })
  
  const [phoneNumber, setPhoneNumber] = useState(() => {
    // Extract phone number without country code
    if (value && value.startsWith('+')) {
      const matchingCountry = COUNTRY_CODES.find(country => 
        value.startsWith(country.code)
      )
      if (matchingCountry) {
        return value.substring(matchingCountry.code.length)
      }
    }
    return value.replace(/^\+\d+/, '') // Remove any existing country code
  })
  
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Update parent component when values change
  useEffect(() => {
    const fullNumber = selectedCountry.code + phoneNumber
    if (onChange) {
      onChange({
        target: {
          name,
          value: fullNumber
        }
      })
    }
  }, [selectedCountry, phoneNumber, onChange, name])

  const handleCountrySelect = (country) => {
    setSelectedCountry(country)
    setDropdownOpen(false)
  }

  const handlePhoneChange = (e) => {
    // Only allow digits, spaces, hyphens, and parentheses
    const cleaned = e.target.value.replace(/[^\d\s\-\(\)]/g, '')
    setPhoneNumber(cleaned)
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        {/* Country Code Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <span className="text-lg mr-1">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-gray-700 mr-1">
              {selectedCountry.code}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
              {COUNTRY_CODES.map((country, index) => (
                <button
                  key={`${country.code}-${country.name}-${index}`}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full flex items-center px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  <span className="text-lg mr-2">{country.flag}</span>
                  <span className="text-sm font-medium text-gray-700 mr-2">
                    {country.code}
                  </span>
                  <span className="text-sm text-gray-600 truncate">
                    {country.country}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <div className="relative flex-1">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            required={required}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </div>
  )
}

export default PhoneInput

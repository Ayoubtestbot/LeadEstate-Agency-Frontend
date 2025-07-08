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
  { code: '+213', country: 'Algeria', flag: '🇩🇿', name: 'DZ' },
  { code: '+216', country: 'Tunisia', flag: '🇹🇳', name: 'TN' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬', name: 'EG' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷', name: 'TR' },
  { code: '+7', country: 'Russia', flag: '🇷🇺', name: 'RU' },
  { code: '+86', country: 'China', flag: '🇨🇳', name: 'CN' },
  { code: '+91', country: 'India', flag: '🇮🇳', name: 'IN' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', name: 'JP' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷', name: 'KR' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷', name: 'BR' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽', name: 'MX' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', name: 'AU' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿', name: 'NZ' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦', name: 'ZA' },
]

// Default country based on LeadEstate platform (Morocco-focused)
const getDefaultCountryCode = () => {
  // Always default to Morocco for LeadEstate platform
  // Users can manually change if needed
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
            className="flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10 min-w-[100px]"
          >
            <span className="text-lg mr-2" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>
              {selectedCountry.flag}
            </span>
            <span className="text-sm font-medium text-gray-700 mr-1">
              {selectedCountry.code}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-md shadow-xl z-50 max-h-80 overflow-y-auto">
              {COUNTRY_CODES.map((country, index) => (
                <button
                  key={`${country.code}-${country.name}-${index}`}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <span
                    className="text-lg mr-3"
                    style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif', minWidth: '24px' }}
                  >
                    {country.flag}
                  </span>
                  <span className="text-sm font-medium text-gray-700 mr-3 min-w-[4rem]">
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
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10"
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

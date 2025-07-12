import { useState, useEffect } from 'react'
import { Phone, ChevronDown } from 'lucide-react'
import { useAuth } from '../App'

// Comprehensive country codes with flags, timezone info, and phone examples for smart detection
const COUNTRY_CODES = [
  { code: '+212', country: 'Morocco', flag: '🇲🇦', name: 'MA', timezone: 'Africa/Casablanca', example: '600000000' },
  { code: '+33', country: 'France', flag: '🇫🇷', name: 'FR', timezone: 'Europe/Paris', example: '612345678' },
  { code: '+1', country: 'United States', flag: '🇺🇸', name: 'US', timezone: 'America/New_York', example: '2025551234' },
  { code: '+1', country: 'Canada', flag: '🇨🇦', name: 'CA', timezone: 'America/Toronto', example: '4165551234' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧', name: 'GB', timezone: 'Europe/London', example: '7400123456' },
  { code: '+49', country: 'Germany', flag: '🇩🇪', name: 'DE', timezone: 'Europe/Berlin', example: '1512345678' },
  { code: '+34', country: 'Spain', flag: '🇪🇸', name: 'ES', timezone: 'Europe/Madrid', example: '612345678' },
  { code: '+39', country: 'Italy', flag: '🇮🇹', name: 'IT', timezone: 'Europe/Rome', example: '3123456789' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱', name: 'NL', timezone: 'Europe/Amsterdam', example: '612345678' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪', name: 'BE', timezone: 'Europe/Brussels', example: '470123456' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭', name: 'CH', timezone: 'Europe/Zurich', example: '781234567' },
  { code: '+43', country: 'Austria', flag: '🇦🇹', name: 'AT', timezone: 'Europe/Vienna', example: '6641234567' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹', name: 'PT', timezone: 'Europe/Lisbon', example: '912345678' },
  { code: '+971', country: 'UAE', flag: '🇦🇪', name: 'AE', timezone: 'Asia/Dubai', example: '501234567' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦', name: 'SA', timezone: 'Asia/Riyadh', example: '501234567' },
  { code: '+213', country: 'Algeria', flag: '🇩🇿', name: 'DZ', timezone: 'Africa/Algiers', example: '551234567' },
  { code: '+216', country: 'Tunisia', flag: '🇹🇳', name: 'TN', timezone: 'Africa/Tunis', example: '20123456' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬', name: 'EG', timezone: 'Africa/Cairo', example: '1001234567' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷', name: 'TR', timezone: 'Europe/Istanbul', example: '5321234567' },
  { code: '+7', country: 'Russia', flag: '🇷🇺', name: 'RU', timezone: 'Europe/Moscow', example: '9123456789' },
  { code: '+86', country: 'China', flag: '🇨🇳', name: 'CN', timezone: 'Asia/Shanghai', example: '13812345678' },
  { code: '+91', country: 'India', flag: '🇮🇳', name: 'IN', timezone: 'Asia/Kolkata', example: '9876543210' },
  { code: '+81', country: 'Japan', flag: '🇯🇵', name: 'JP', timezone: 'Asia/Tokyo', example: '9012345678' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷', name: 'KR', timezone: 'Asia/Seoul', example: '1012345678' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷', name: 'BR', timezone: 'America/Sao_Paulo', example: '11987654321' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽', name: 'MX', timezone: 'America/Mexico_City', example: '5512345678' },
  { code: '+61', country: 'Australia', flag: '🇦🇺', name: 'AU', timezone: 'Australia/Sydney', example: '412345678' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿', name: 'NZ', timezone: 'Pacific/Auckland', example: '212345678' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦', name: 'ZA', timezone: 'Africa/Johannesburg', example: '821234567' },
  // Additional countries for comprehensive coverage
  { code: '+46', country: 'Sweden', flag: '🇸🇪', name: 'SE', timezone: 'Europe/Stockholm' },
  { code: '+47', country: 'Norway', flag: '🇳🇴', name: 'NO', timezone: 'Europe/Oslo' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰', name: 'DK', timezone: 'Europe/Copenhagen' },
  { code: '+358', country: 'Finland', flag: '🇫🇮', name: 'FI', timezone: 'Europe/Helsinki' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪', name: 'IE', timezone: 'Europe/Dublin' },
  { code: '+48', country: 'Poland', flag: '🇵🇱', name: 'PL', timezone: 'Europe/Warsaw' },
  { code: '+420', country: 'Czech Republic', flag: '🇨🇿', name: 'CZ', timezone: 'Europe/Prague' },
  { code: '+36', country: 'Hungary', flag: '🇭🇺', name: 'HU', timezone: 'Europe/Budapest' },
  { code: '+30', country: 'Greece', flag: '🇬🇷', name: 'GR', timezone: 'Europe/Athens' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬', name: 'SG', timezone: 'Asia/Singapore' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾', name: 'MY', timezone: 'Asia/Kuala_Lumpur' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭', name: 'TH', timezone: 'Asia/Bangkok' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳', name: 'VN', timezone: 'Asia/Ho_Chi_Minh' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩', name: 'ID', timezone: 'Asia/Jakarta' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭', name: 'PH', timezone: 'Asia/Manila' },
  // Additional countries for comprehensive international coverage
  { code: '+54', country: 'Argentina', flag: '🇦🇷', name: 'AR', timezone: 'America/Argentina/Buenos_Aires' },
  { code: '+56', country: 'Chile', flag: '🇨🇱', name: 'CL', timezone: 'America/Santiago' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴', name: 'CO', timezone: 'America/Bogota' },
  { code: '+51', country: 'Peru', flag: '🇵🇪', name: 'PE', timezone: 'America/Lima' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪', name: 'VE', timezone: 'America/Caracas' },
  { code: '+593', country: 'Ecuador', flag: '🇪🇨', name: 'EC', timezone: 'America/Guayaquil' },
  { code: '+595', country: 'Paraguay', flag: '🇵🇾', name: 'PY', timezone: 'America/Asuncion' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾', name: 'UY', timezone: 'America/Montevideo' },
  { code: '+591', country: 'Bolivia', flag: '🇧🇴', name: 'BO', timezone: 'America/La_Paz' },
  { code: '+502', country: 'Guatemala', flag: '🇬🇹', name: 'GT', timezone: 'America/Guatemala' },
  { code: '+503', country: 'El Salvador', flag: '🇸🇻', name: 'SV', timezone: 'America/El_Salvador' },
  { code: '+504', country: 'Honduras', flag: '🇭🇳', name: 'HN', timezone: 'America/Tegucigalpa' },
  { code: '+505', country: 'Nicaragua', flag: '🇳🇮', name: 'NI', timezone: 'America/Managua' },
  { code: '+506', country: 'Costa Rica', flag: '🇨🇷', name: 'CR', timezone: 'America/Costa_Rica' },
  { code: '+507', country: 'Panama', flag: '🇵🇦', name: 'PA', timezone: 'America/Panama' },
  { code: '+509', country: 'Haiti', flag: '🇭🇹', name: 'HT', timezone: 'America/Port-au-Prince' },
  { code: '+1', country: 'Dominican Republic', flag: '🇩🇴', name: 'DO', timezone: 'America/Santo_Domingo' },
  { code: '+1', country: 'Jamaica', flag: '🇯🇲', name: 'JM', timezone: 'America/Jamaica' },
  { code: '+1', country: 'Puerto Rico', flag: '🇵🇷', name: 'PR', timezone: 'America/Puerto_Rico' },
  { code: '+1', country: 'Trinidad and Tobago', flag: '🇹🇹', name: 'TT', timezone: 'America/Port_of_Spain' },
  { code: '+1', country: 'Barbados', flag: '🇧🇧', name: 'BB', timezone: 'America/Barbados' },
  { code: '+972', country: 'Israel', flag: '🇮🇱', name: 'IL', timezone: 'Asia/Jerusalem' },
  { code: '+962', country: 'Jordan', flag: '🇯🇴', name: 'JO', timezone: 'Asia/Amman' },
  { code: '+961', country: 'Lebanon', flag: '🇱🇧', name: 'LB', timezone: 'Asia/Beirut' },
  { code: '+963', country: 'Syria', flag: '🇸🇾', name: 'SY', timezone: 'Asia/Damascus' },
  { code: '+964', country: 'Iraq', flag: '🇮🇶', name: 'IQ', timezone: 'Asia/Baghdad' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼', name: 'KW', timezone: 'Asia/Kuwait' },
  { code: '+968', country: 'Oman', flag: '🇴🇲', name: 'OM', timezone: 'Asia/Muscat' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦', name: 'QA', timezone: 'Asia/Qatar' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭', name: 'BH', timezone: 'Asia/Bahrain' },
  { code: '+98', country: 'Iran', flag: '🇮🇷', name: 'IR', timezone: 'Asia/Tehran' },
  { code: '+93', country: 'Afghanistan', flag: '🇦🇫', name: 'AF', timezone: 'Asia/Kabul' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰', name: 'PK', timezone: 'Asia/Karachi' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩', name: 'BD', timezone: 'Asia/Dhaka' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰', name: 'LK', timezone: 'Asia/Colombo' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵', name: 'NP', timezone: 'Asia/Kathmandu' },
  { code: '+975', country: 'Bhutan', flag: '🇧🇹', name: 'BT', timezone: 'Asia/Thimphu' },
  { code: '+960', country: 'Maldives', flag: '🇲🇻', name: 'MV', timezone: 'Indian/Maldives' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰', name: 'LK', timezone: 'Asia/Colombo' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰', name: 'HK', timezone: 'Asia/Hong_Kong' },
  { code: '+853', country: 'Macau', flag: '🇲🇴', name: 'MO', timezone: 'Asia/Macau' },
  { code: '+886', country: 'Taiwan', flag: '🇹🇼', name: 'TW', timezone: 'Asia/Taipei' },
  { code: '+850', country: 'North Korea', flag: '🇰🇵', name: 'KP', timezone: 'Asia/Pyongyang' },
  { code: '+976', country: 'Mongolia', flag: '🇲🇳', name: 'MN', timezone: 'Asia/Ulaanbaatar' },
  { code: '+996', country: 'Kyrgyzstan', flag: '🇰🇬', name: 'KG', timezone: 'Asia/Bishkek' },
  { code: '+992', country: 'Tajikistan', flag: '🇹🇯', name: 'TJ', timezone: 'Asia/Dushanbe' },
  { code: '+993', country: 'Turkmenistan', flag: '🇹🇲', name: 'TM', timezone: 'Asia/Ashgabat' },
  { code: '+998', country: 'Uzbekistan', flag: '🇺🇿', name: 'UZ', timezone: 'Asia/Tashkent' },
  { code: '+7', country: 'Kazakhstan', flag: '🇰🇿', name: 'KZ', timezone: 'Asia/Almaty' },
  { code: '+374', country: 'Armenia', flag: '🇦🇲', name: 'AM', timezone: 'Asia/Yerevan' },
  { code: '+994', country: 'Azerbaijan', flag: '🇦🇿', name: 'AZ', timezone: 'Asia/Baku' },
  { code: '+995', country: 'Georgia', flag: '🇬🇪', name: 'GE', timezone: 'Asia/Tbilisi' },
  { code: '+380', country: 'Ukraine', flag: '🇺🇦', name: 'UA', timezone: 'Europe/Kiev' },
  { code: '+375', country: 'Belarus', flag: '🇧🇾', name: 'BY', timezone: 'Europe/Minsk' },
  { code: '+373', country: 'Moldova', flag: '🇲🇩', name: 'MD', timezone: 'Europe/Chisinau' },
  { code: '+372', country: 'Estonia', flag: '🇪🇪', name: 'EE', timezone: 'Europe/Tallinn' },
  { code: '+371', country: 'Latvia', flag: '🇱🇻', name: 'LV', timezone: 'Europe/Riga' },
  { code: '+370', country: 'Lithuania', flag: '🇱🇹', name: 'LT', timezone: 'Europe/Vilnius' },
]

// Smart country detection based on user context and location
const getDefaultCountryCode = (user = null) => {
  try {
    console.log('🌍 Detecting country code for user:', user?.name || 'anonymous')

    // 1. Check user preferences if available
    if (user?.preferences?.defaultCountryCode) {
      console.log('📱 Using user preference:', user.preferences.defaultCountryCode)
      return user.preferences.defaultCountryCode
    }

    // 2. Check user timezone if available
    if (user?.timezone) {
      const countryByTimezone = COUNTRY_CODES.find(country =>
        country.timezone === user.timezone
      )
      if (countryByTimezone) {
        console.log('🕐 Detected from user timezone:', countryByTimezone.code, countryByTimezone.country)
        return countryByTimezone.code
      }
    }

    // 3. Try to detect from browser timezone
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const countryByBrowserTimezone = COUNTRY_CODES.find(country =>
      country.timezone === browserTimezone
    )
    if (countryByBrowserTimezone) {
      console.log('🌐 Detected from browser timezone:', countryByBrowserTimezone.code, countryByBrowserTimezone.country)
      return countryByBrowserTimezone.code
    }

    // 4. Try to detect from browser language
    const browserLanguage = navigator.language || navigator.userLanguage
    if (browserLanguage) {
      const languageCode = browserLanguage.split('-')[1]?.toUpperCase()
      const countryByLanguage = COUNTRY_CODES.find(country =>
        country.name === languageCode
      )
      if (countryByLanguage) {
        console.log('🗣️ Detected from browser language:', countryByLanguage.code, countryByLanguage.country)
        return countryByLanguage.code
      }
    }

    // 5. Default to Morocco for LeadEstate platform
    console.log('🏠 Using default Morocco (+212)')
    return '+212'
  } catch (error) {
    console.warn('❌ Error detecting country code:', error)
    return '+212'
  }
}

const PhoneInput = ({
  value = '',
  onChange,
  placeholder = 'Enter phone number',
  required = false,
  className = '',
  name = 'phone'
}) => {
  // Get user context for smart country detection
  const { user } = useAuth()

  const [selectedCountry, setSelectedCountry] = useState(() => {
    // If value already has a country code, extract it
    if (value && value.startsWith('+')) {
      const matchingCountry = COUNTRY_CODES.find(country =>
        value.startsWith(country.code)
      )
      return matchingCountry || COUNTRY_CODES.find(c => c.code === getDefaultCountryCode(user))
    }
    return COUNTRY_CODES.find(c => c.code === getDefaultCountryCode(user))
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

  // Update country when user context changes (for smart detection)
  useEffect(() => {
    if (user && !value) {
      // Only auto-detect if no value is set (new input)
      const detectedCode = getDefaultCountryCode(user)
      const detectedCountry = COUNTRY_CODES.find(c => c.code === detectedCode)
      if (detectedCountry && detectedCountry.code !== selectedCountry.code) {
        console.log('🔄 Updating country based on user context:', detectedCountry.country)
        setSelectedCountry(detectedCountry)
      }
    }
  }, [user, value, selectedCountry.code])

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

  // Get dynamic placeholder based on selected country
  const getDynamicPlaceholder = () => {
    if (selectedCountry.example) {
      return selectedCountry.example
    }
    // Fallback placeholders based on country code
    switch (selectedCountry.code) {
      case '+212': return '600000000'
      case '+33': return '612345678'
      case '+1': return '2025551234'
      case '+44': return '7400123456'
      case '+49': return '1512345678'
      default: return 'Enter phone number'
    }
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex">
        {/* Country Code Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center justify-center px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10 min-w-[120px]"
          >
            <span className="text-lg mr-2 flex-shrink-0" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>
              {selectedCountry.flag}
            </span>
            <span className="text-sm font-medium text-gray-700 mr-1 flex-shrink-0">
              {selectedCountry.code}
            </span>
            <span className="text-xs text-gray-500 mr-1 flex-shrink-0">
              {selectedCountry.name}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
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
            placeholder={getDynamicPlaceholder()}
            required={required}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-10 placeholder-gray-400"
          />
          {/* Helper text */}
          <div className="absolute -bottom-5 left-0 text-xs text-gray-500">
            Format: {selectedCountry.code} {getDynamicPlaceholder()}
          </div>
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

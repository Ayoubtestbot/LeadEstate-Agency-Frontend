import React from 'react'

// Flag component using flag-icons CSS library or fallback to country codes
const FlagIcon = ({ countryCode, className = '', size = 'sm' }) => {
  // Convert country code to lowercase for flag-icons
  const flagCode = countryCode?.toLowerCase()
  
  // Size classes
  const sizeClasses = {
    xs: 'w-4 h-3',
    sm: 'w-5 h-4', 
    md: 'w-6 h-5',
    lg: 'w-8 h-6'
  }
  
  // Fallback country code mapping
  const countryMapping = {
    'ma': 'MA',
    'fr': 'FR', 
    'us': 'US',
    'gb': 'GB',
    'de': 'DE',
    'es': 'ES',
    'it': 'IT',
    'nl': 'NL',
    'be': 'BE',
    'ch': 'CH',
    'at': 'AT',
    'pt': 'PT',
    'ae': 'AE',
    'sa': 'SA',
    'dz': 'DZ',
    'tn': 'TN',
    'eg': 'EG',
    'tr': 'TR',
    'ru': 'RU',
    'cn': 'CN',
    'in': 'IN',
    'jp': 'JP',
    'kr': 'KR',
    'br': 'BR',
    'mx': 'MX',
    'au': 'AU',
    'nz': 'NZ',
    'za': 'ZA',
    'ca': 'CA'
  }

  // Use flag-icons CSS library for real flag images
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div
        className={`fi fi-${flagCode} ${sizeClasses[size]} rounded-sm border border-gray-200 shadow-sm`}
        style={{
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'block'
        }}
        title={countryMapping[flagCode] || countryCode?.toUpperCase()}
      />
    </div>
  )
}

export default FlagIcon

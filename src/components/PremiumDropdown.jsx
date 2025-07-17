import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

const PremiumDropdown = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Select option",
  icon: Icon,
  className = "",
  disabled = false,
  showSearch = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    onChange(option.value)
    setIsOpen(false)
    setSearchTerm('')
  }

  const selectedOption = options.find(opt => opt.value === value)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Premium Dropdown Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-left
          bg-white/10 backdrop-blur-md
          border border-white/20
          rounded-xl
          shadow-lg shadow-black/5
          hover:bg-white/15 hover:border-white/30
          focus:outline-none focus:ring-2 focus:ring-blue-500/50
          transition-all duration-300
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'ring-2 ring-blue-500/50 bg-white/15' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {Icon && (
              <Icon className="h-5 w-5 text-gray-600" />
            )}
            <span className={`
              ${selectedOption ? 'text-gray-900 font-medium' : 'text-gray-500'}
            `}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown
            className={`
              h-5 w-5 text-gray-400 transition-transform duration-200
              ${isOpen ? 'rotate-180' : ''}
            `}
          />
        </div>
      </button>

      {/* Premium Dropdown Menu */}
      {isOpen && (
        <div className="
          absolute z-50 w-full mt-2
          bg-white/95 backdrop-blur-xl
          border border-white/30
          rounded-xl
          shadow-2xl shadow-black/10
          overflow-hidden
          animate-in slide-in-from-top-2 duration-200
        ">
          {/* Search Input */}
          {showSearch && (
            <div className="p-3 border-b border-gray-200/50">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full px-3 py-2
                  bg-white/50 backdrop-blur-sm
                  border border-white/30
                  rounded-lg
                  text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  placeholder-gray-400
                "
              />
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-gray-500 text-sm text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full px-4 py-3 text-left
                    flex items-center justify-between
                    hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80
                    transition-all duration-200
                    ${value === option.value ? 'bg-gradient-to-r from-blue-100/80 to-purple-100/80' : ''}
                  `}
                >
                  <div className="flex items-center space-x-3">
                    {option.icon && (
                      <option.icon className="h-4 w-4 text-gray-600" />
                    )}
                    <span className={`
                      ${value === option.value ? 'text-blue-700 font-medium' : 'text-gray-700'}
                    `}>
                      {option.label}
                    </span>
                  </div>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PremiumDropdown

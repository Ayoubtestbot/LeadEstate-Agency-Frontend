import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
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
      // Check if click is outside both the dropdown button and the portal menu
      const isOutsideButton = dropdownRef.current && !dropdownRef.current.contains(event.target)
      const isOutsidePortal = !event.target.closest('[data-dropdown-portal]')

      if (isOutsideButton && isOutsidePortal) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Calculate dropdown position to avoid clipping
  const [dropdownPosition, setDropdownPosition] = useState('bottom')
  const [dropdownRect, setDropdownRect] = useState(null)

  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect()
      setDropdownRect(rect)

      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top

      // If not enough space below and more space above, show dropdown above
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setDropdownPosition('top')
      } else {
        setDropdownPosition('bottom')
      }
    }
  }, [isOpen])

  const handleSelect = (option) => {
    console.log('🔄 PremiumDropdown handleSelect:', {
      selectedValue: option.value,
      selectedLabel: option.label,
      currentValue: value
    })
    onChange(option.value)
    setIsOpen(false)
    setSearchTerm('')
  }

  const selectedOption = options.find(opt => opt.value === value)

  // Debug logging
  useEffect(() => {
    console.log('🔍 PremiumDropdown state:', {
      value,
      selectedOption: selectedOption?.label,
      optionsCount: options.length,
      firstOption: options[0]?.label
    })
  }, [value, selectedOption, options])

  return (
    <div className={`relative ${className}`} ref={dropdownRef} style={{ zIndex: isOpen ? 9999 : 'auto' }}>
      {/* Premium Dropdown Button - Match Input Fields */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-3 py-2 text-left
          bg-white
          border border-gray-300
          rounded-md
          hover:border-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {Icon && (
              <Icon className="h-4 w-4 text-gray-400" />
            )}
            <span className={`
              ${selectedOption ? 'text-gray-900' : 'text-gray-500'}
            `}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <ChevronDown
            className={`
              h-4 w-4 text-gray-400 transition-transform duration-200
              ${isOpen ? 'rotate-180' : ''}
            `}
          />
        </div>
      </button>

      {/* Premium Dropdown Menu - Portal for Modal Compatibility */}
      {isOpen && dropdownRect && createPortal(
        <div
          data-dropdown-portal="true"
          className={`
            fixed z-[9999]
            bg-white
            border border-gray-300
            rounded-md
            shadow-lg
            max-h-48 overflow-hidden
            animate-in duration-200
            ${dropdownPosition === 'top' ? 'slide-in-from-bottom-2' : 'slide-in-from-top-2'}
          `}
          style={{
            position: 'fixed',
            top: dropdownPosition === 'top' ? dropdownRect.top - 200 : dropdownRect.bottom + 4,
            left: dropdownRect.left,
            width: dropdownRect.width,
            zIndex: 9999,
            maxHeight: '192px'
          }}
        >
          {/* Search Input */}
          {showSearch && (
            <div className="p-2 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full px-2 py-1
                  bg-gray-50
                  border border-gray-200
                  rounded
                  text-sm
                  focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                  placeholder-gray-400
                "
              />
            </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto" style={{ maxHeight: dropdownPosition === 'top' ? '150px' : '150px' }}>
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 text-sm text-center">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleSelect(option)
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  className={`
                    w-full px-3 py-2 text-left text-sm
                    flex items-center justify-between
                    hover:bg-blue-50
                    transition-colors duration-150
                    ${value === option.value ? 'bg-blue-100 text-blue-700' : 'text-gray-700'}
                  `}
                >
                  <div className="flex items-center space-x-2">
                    {option.icon && (
                      <option.icon className="h-4 w-4 text-gray-500" />
                    )}
                    <span className={`
                      ${value === option.value ? 'font-medium' : ''}
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
        </div>,
        document.body
      )}
    </div>
  )
}

export default PremiumDropdown

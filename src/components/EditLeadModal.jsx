import { useState, useEffect } from 'react'
import { User, Mail, MapPin, Globe, Home, Users, Building, Filter } from 'lucide-react'
import { useData } from '../App'
import Modal from './Modal'
import PhoneInput from './PhoneInput'
import PremiumDropdown from './PremiumDropdown'

const EditLeadModal = ({ isOpen, onClose, lead, onSubmit }) => {
  const { teamMembers } = useData()

  // Premium dropdown options
  const statusOptions = [
    { value: 'new', label: 'New', icon: Filter },
    { value: 'contacted', label: 'Contacted', icon: Mail },
    { value: 'qualified', label: 'Qualified', icon: User },
    { value: 'proposal', label: 'Proposal', icon: Mail },
    { value: 'negotiation', label: 'Negotiation', icon: Users },
    { value: 'closed-won', label: 'Closed Won', icon: User },
    { value: 'closed-lost', label: 'Closed Lost', icon: Filter }
  ]

  const sourceOptions = [
    { value: 'website', label: 'Website', icon: Globe },
    { value: 'facebook', label: 'Facebook', icon: Globe },
    { value: 'google', label: 'Google', icon: Globe },
    { value: 'referral', label: 'Referral', icon: Users },
    { value: 'walk-in', label: 'Walk-in', icon: User },
    { value: 'other', label: 'Other', icon: Globe }
  ]

  const propertyTypeOptions = [
    { value: 'house', label: 'House', icon: Home },
    { value: 'apartment', label: 'Apartment', icon: Building },
    { value: 'condo', label: 'Condo', icon: Building },
    { value: 'townhouse', label: 'Townhouse', icon: Home },
    { value: 'land', label: 'Land', icon: MapPin },
    { value: 'commercial', label: 'Commercial', icon: Building }
  ]

  const agentOptions = [
    { value: '', label: 'Unassigned', icon: User },
    ...teamMembers.map(member => ({
      value: member.name,
      label: `${member.name} (${member.role})`,
      icon: User
    }))
  ]

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    address: '',
    email: '',
    status: 'new',
    source: 'website',
    propertyType: 'house',
    budget: '',
    notes: '',
    assignedTo: ''
  })

  // Update form data when lead changes
  useEffect(() => {
    if (lead) {
      console.log('🔍 EditLeadModal - Full lead data:', lead); // Debug log
      console.log('🔍 Available fields:', Object.keys(lead)); // Show all available fields

      // Use the actual data structure from the logs
      const fullName = lead.name || '';
      const phoneValue = lead.phone || '';
      const cityValue = lead.city || '';
      const addressValue = lead.address || '';
      const assignedValue = lead.assignedTo || '';

      console.log('🔍 RAW LEAD DATA:', lead);
      console.log('🔍 PHONE VALUE EXTRACTED:', phoneValue);
      console.log('🔍 CITY VALUE EXTRACTED:', cityValue);
      console.log('🔍 ADDRESS VALUE EXTRACTED:', addressValue);
      console.log('🔍 Checking location fields:', {
        city: lead.city,
        address: lead.address
      });
      console.log('🔍 Mapped values:', {
        name: fullName,
        phone: phoneValue,
        city: cityValue,
        email: lead.email,
        status: lead.status,
        assigned: assignedValue
      });

      console.log('🔍 Team members available:', teamMembers?.length || 0);
      console.log('🔍 First team member:', teamMembers?.[0]);

      setFormData({
        name: fullName,
        phone: phoneValue,
        city: cityValue,
        address: addressValue,
        email: lead.email || '',
        status: lead.status || 'new',
        source: lead.source || 'website',
        propertyType: lead.propertyType || 'house',
        budget: lead.budget || '',
        notes: lead.notes || '',
        assignedTo: assignedValue
      })
    }
  }, [lead])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Prepare data to match the existing lead structure
    const submitData = {
      name: formData.name,
      phone: formData.phone,
      city: formData.city,
      address: formData.address,
      email: formData.email,
      status: formData.status,
      source: formData.source,
      propertyType: formData.propertyType,
      budget: formData.budget,
      notes: formData.notes,
      assignedTo: formData.assignedTo
    }

    console.log('📤 EditLeadModal - Submitting data:', submitData); // Debug log
    onSubmit(submitData)
    onClose()
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!lead) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Lead" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <PhoneInput
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter city"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full address (optional)"
            />
          </div>
        </div>

        {/* Email (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email address (optional)"
            />
          </div>
        </div>

        {/* Status and Source */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <PremiumDropdown
              options={statusOptions}
              value={formData.status}
              onChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              placeholder="Select Status"
              icon={Filter}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source
            </label>
            <PremiumDropdown
              options={sourceOptions}
              value={formData.source}
              onChange={(value) => setFormData(prev => ({ ...prev, source: value }))}
              placeholder="Select Source"
              icon={Globe}
            />
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <PremiumDropdown
            options={propertyTypeOptions}
            value={formData.propertyType}
            onChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
            placeholder="Select Property Type"
            icon={Home}
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Budget Range
          </label>
          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., $300,000 - $500,000"
          />
        </div>

        {/* Assign to Agent */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assign to Agent
          </label>
          <PremiumDropdown
            options={agentOptions}
            value={formData.assignedTo}
            onChange={(value) => {
              console.log('🔄 EditLeadModal agent onChange:', {
                newValue: value,
                currentAssignedTo: formData.assignedTo,
                formData: formData
              })
              setFormData(prev => ({ ...prev, assignedTo: value }))
            }}
            placeholder="Select Agent"
            icon={Users}
            showSearch={true}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Additional notes about the lead..."
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default EditLeadModal

import { useLanguage } from '../contexts/LanguageContext'

const LanguageToggle = ({ className = '' }) => {
  const { language, changeLanguage } = useLanguage()

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fr' : 'en'
    changeLanguage(newLanguage)
  }

  return (
    <button
      onClick={toggleLanguage}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      title={`Switch to ${language === 'en' ? 'Français' : 'English'}`}
    >
      <div
        className="mr-2 flex items-center justify-center bg-blue-100 text-blue-800 rounded"
        style={{
          width: '20px',
          height: '16px',
          fontSize: '10px',
          fontWeight: 'bold'
        }}
      >
        {language === 'en' ? 'US' : 'FR'}
      </div>
      <span>{language === 'en' ? 'EN' : 'FR'}</span>
    </button>
  )
}

export default LanguageToggle

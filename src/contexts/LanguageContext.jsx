import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Load saved language or default to English
    return localStorage.getItem('crm_language') || 'en'
  })

  const [translations, setTranslations] = useState({})

  useEffect(() => {
    // Load translations for the current language
    loadTranslations(language)
  }, [language])

  const loadTranslations = async (lang) => {
    try {
      const translationModule = await import(`../translations/${lang}.js`)
      setTranslations(translationModule.default)
    } catch (error) {
      console.error(`Failed to load translations for ${lang}:`, error)
      // Fallback to English if translation fails
      if (lang !== 'en') {
        const englishModule = await import('../translations/en.js')
        setTranslations(englishModule.default)
      }
    }
  }

  const changeLanguage = async (newLanguage) => {
    console.log('🌐 Changing language to:', newLanguage)

    // Save language first
    localStorage.setItem('crm_language', newLanguage)

    // Load translations for new language
    await loadTranslations(newLanguage)

    // Update state
    setLanguage(newLanguage)

    // Force page refresh to ensure all components re-render with new language
    setTimeout(() => {
      console.log('🔄 Refreshing page for language change')
      window.location.reload()
    }, 200)
  }

  const t = (key, params = {}) => {
    // Return key if no translations loaded
    if (!translations || Object.keys(translations).length === 0) {
      console.warn(`No translations loaded for key: ${key}`)
      return key
    }

    // Get translation by key (supports nested keys like 'common.save')
    const keys = key.split('.')
    let translation = translations

    for (const k of keys) {
      if (translation && typeof translation === 'object') {
        translation = translation[k]
      } else {
        translation = undefined
        break
      }
    }

    // If translation not found, return the key
    if (translation === undefined) {
      console.warn(`Translation missing for key: ${key} in language: ${language}`)
      return key
    }

    // Replace parameters in translation
    let result = translation
    Object.keys(params).forEach(param => {
      result = result.replace(`{{${param}}}`, params[param])
    })

    console.log(`✅ Translation found: ${key} → ${result}`)
    return result
  }

  const value = {
    language,
    changeLanguage,
    t,
    translations,
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'fr', name: 'Français', flag: '🇫🇷' }
    ]
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export default LanguageContext

import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from './AuthContext'
import { userService } from '@/api/services'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/i18n/types'
import type { SupportedLanguage } from '@/types'

interface LanguageContextType {
  currentLanguage: SupportedLanguage
  changeLanguage: (language: SupportedLanguage) => Promise<void>
  supportedLanguages: SupportedLanguage[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Detect browser language and return matching supported language
function detectBrowserLanguage(): SupportedLanguage {
  const browserLang = navigator.language.split('-')[0]
  if (SUPPORTED_LANGUAGES.includes(browserLang as SupportedLanguage)) {
    return browserLang as SupportedLanguage
  }
  return DEFAULT_LANGUAGE
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation()
  const { user, updateUser } = useAuth()
  const hasSetBrowserLanguage = useRef(false)

  // For public pages (no user), use browser locale
  // This runs once on mount when there's no user
  useEffect(() => {
    if (!user && !hasSetBrowserLanguage.current) {
      const browserLang = detectBrowserLanguage()
      if (browserLang !== i18n.language) {
        i18n.changeLanguage(browserLang)
      }
      hasSetBrowserLanguage.current = true
    }
  }, [user, i18n])

  // Sync i18n language with user's language preference when logged in
  useEffect(() => {
    if (user?.language && user.language !== i18n.language) {
      i18n.changeLanguage(user.language)
    }
  }, [user?.language, i18n])

  const changeLanguage = async (language: SupportedLanguage) => {
    // Update i18n immediately for instant UI feedback
    await i18n.changeLanguage(language)

    // Persist to backend if user is authenticated
    if (user) {
      try {
        await userService.updateLanguage(language)
        updateUser({ ...user, language })
      } catch (error) {
        console.error('Failed to save language preference:', error)
        // Language is already changed in i18n, so UI remains updated
      }
    }
  }

  const currentLanguage = (
    SUPPORTED_LANGUAGES.includes(i18n.language as SupportedLanguage)
      ? i18n.language
      : DEFAULT_LANGUAGE
  ) as SupportedLanguage

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        changeLanguage,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

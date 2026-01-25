import type { SupportedLanguage } from '@/types'

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['en', 'pt', 'sv']

export const LANGUAGE_LABELS: Record<SupportedLanguage, string> = {
  en: 'English',
  pt: 'Português',
  sv: 'Svenska',
}

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en'

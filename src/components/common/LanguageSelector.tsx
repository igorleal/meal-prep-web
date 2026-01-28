import { useState, useRef, useEffect } from 'react'
import { Icon } from './Icon'
import { useLanguage } from '@/context/LanguageContext'
import { LANGUAGE_LABELS } from '@/i18n/types'

interface LanguageSelectorProps {
  variant?: 'dark' | 'light'
}

export function LanguageSelector({ variant = 'light' }: LanguageSelectorProps) {
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const isDark = variant === 'dark'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
          isDark
            ? 'text-white/80 hover:text-white hover:bg-white/10'
            : 'text-text-main-light dark:text-white border border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-white/5'
        }`}
      >
        <Icon name="language" className="text-lg" />
        <span>{LANGUAGE_LABELS[currentLanguage]}</span>
        <Icon name="expand_more" className={`text-lg transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full right-0 mt-1 rounded-lg shadow-lg z-10 min-w-[140px] ${
            isDark
              ? 'bg-surface-dark border border-white/10'
              : 'bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark'
          }`}
        >
          {supportedLanguages.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                changeLanguage(lang)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg ${
                isDark
                  ? `hover:bg-white/10 ${
                      lang === currentLanguage ? 'text-primary font-medium' : 'text-white'
                    }`
                  : `hover:bg-gray-50 dark:hover:bg-white/5 ${
                      lang === currentLanguage
                        ? 'text-primary font-medium'
                        : 'text-text-main-light dark:text-white'
                    }`
              }`}
            >
              {LANGUAGE_LABELS[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

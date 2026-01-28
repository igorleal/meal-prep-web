import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon } from '@/components/common'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { authService } from '@/api/services'
import { getApiMode, getBaseUrl } from '@/api/config'
import { LANGUAGE_LABELS } from '@/i18n/types'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { t } = useTranslation('auth')
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false)

  const from = location.state?.from?.pathname || '/home'

  const handleGoogleLogin = async () => {
    setError('')
    setIsLoading(true)

    const apiMode = getApiMode()

    if (apiMode === 'local' || apiMode === 'production') {
      // Redirect to backend OAuth endpoint with language parameter
      const baseUrl = getBaseUrl()
      window.location.href = `${baseUrl}/oauth2/authorization/google?lang=${currentLanguage}`
    } else {
      // Mock mode only: simulate login
      try {
        const { token, user } = await authService.login('demo@example.com', 'password')
        login(token, user)
        navigate(from, { replace: true })
      } catch {
        setError(t('login.error'))
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="flex w-full min-h-screen">
      {/* Left Panel - Hero Image */}
      <div className="hidden lg:block flex-1 relative overflow-hidden">
        <img
          src="/hero-login.png"
          alt="Delicious meal preparation"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Icon name="restaurant_menu" className="text-white" />
            </div>
            <span className="text-xl font-bold">ReceitAI</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl font-extrabold mb-4 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-white/90 text-lg">
              {t('hero.subtitle')}
            </p>
          </div>

          <p className="text-white/60 text-sm">
            &copy; {t('hero.copyright')}
          </p>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 bg-white dark:bg-surface-dark">
        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Icon name="restaurant_menu" className="text-primary" />
            </div>
            <span className="text-xl font-bold text-text-main-light dark:text-white">ReceitAI</span>
          </div>

          <h2 className="text-3xl font-extrabold text-text-main-light dark:text-white mb-2">
            {t('login.title')}
          </h2>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
            {t('login.subtitle')}
          </p>

          {/* Language Selector */}
          <div className="relative mb-6">
            <button
              type="button"
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-text-main-light dark:text-white border border-border-light dark:border-border-dark rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <Icon name="language" className="text-lg" />
              <span>{LANGUAGE_LABELS[currentLanguage]}</span>
              <Icon name="expand_more" className="text-lg" />
            </button>

            {isLanguageDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg shadow-lg z-10">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => {
                      changeLanguage(lang)
                      setIsLanguageDropdownOpen(false)
                    }}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5 first:rounded-t-lg last:rounded-b-lg ${
                      lang === currentLanguage
                        ? 'text-primary font-medium'
                        : 'text-text-main-light dark:text-white'
                    }`}
                  >
                    {LANGUAGE_LABELS[lang]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="size-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            <span className="font-semibold text-text-main-light dark:text-white">
              {isLoading ? t('login.signingIn') : t('login.continueWithGoogle')}
            </span>
          </button>

          <p className="text-center text-text-muted-light dark:text-text-muted-dark text-xs mt-8">
            {t('login.terms')}{' '}
            <Link to="/terms" className="underline hover:text-primary">{t('login.termsOfService')}</Link>{' '}
            {t('login.and')}{' '}
            <Link to="/privacy" className="underline hover:text-primary">{t('login.privacyPolicy')}</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Card, ChipInput, LoadingOverlay } from '@/components/common'
import { userService } from '@/api/services'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'
import { useTheme } from '@/context/ThemeContext'
import { LANGUAGE_LABELS } from '@/i18n/types'
import type { SupportedLanguage } from '@/types'

const suggestedRestrictions = ['Vegan', 'Gluten-Free', 'Paleo', 'Low-Sodium']

export default function SettingsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { logout, updateUser } = useAuth()
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation('settings')
  const { t: tLegal } = useTranslation('legal')
  const [restrictions, setRestrictions] = useState<string[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: userService.getMe,
  })

  useEffect(() => {
    if (user?.restrictions) {
      setRestrictions(user.restrictions)
    }
  }, [user])

  const updateMutation = useMutation({
    mutationFn: (newRestrictions: string[]) => userService.updateRestrictions(newRestrictions),
    onSuccess: () => {
      if (user) {
        const updatedUser = { ...user, restrictions }
        updateUser(updatedUser)
        queryClient.setQueryData(['user'], updatedUser)
      }
      setHasChanges(false)
    },
  })

  const handleSave = () => {
    updateMutation.mutate(restrictions)
  }

  const handleRestrictionChange = (newRestrictions: string[]) => {
    setRestrictions(newRestrictions)
    setHasChanges(true)
  }

  const addSuggestedRestriction = (restriction: string) => {
    if (!restrictions.includes(restriction)) {
      handleRestrictionChange([...restrictions, restriction])
    }
  }

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value as SupportedLanguage
    await changeLanguage(newLanguage)
  }

  if (isLoading) {
    return <LoadingOverlay message={t('loading')} />
  }

  return (
    <div className="relative min-h-full pb-24">
      <div className="max-w-4xl w-full mx-auto p-8 md:p-12">
          {/* Page heading */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-main-light dark:text-white mb-3">
              {t('page.title')}
            </h1>
            <p className="text-text-muted-light dark:text-gray-400 text-base md:text-lg max-w-2xl">
              {t('page.subtitle')}
            </p>
          </div>

          {/* Profile card */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-text-main-light dark:text-white mb-1">
              {user?.name || 'User'}
            </h2>
            <p className="text-text-muted-light dark:text-gray-400 mb-4">
              {user?.email}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-green/10 text-accent-green rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-accent-green" />
              {t('profile.proPlan')}
            </div>
          </Card>

          {/* Preferences */}
          <Card className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Icon name="tune" />
              </div>
              <h3 className="text-xl font-bold text-text-main-light dark:text-white">
                {t('preferences.title')}
              </h3>
            </div>

            <div className="space-y-6">
              {/* Theme selector */}
              <div className="max-w-md">
                <label className="block text-sm font-semibold text-text-main-light dark:text-gray-200 mb-2">
                  {t('preferences.theme.label')}
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 h-12 px-4 rounded-xl border font-medium transition-colors ${
                      theme === 'light'
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-gray-50 dark:bg-gray-800 border-border-light dark:border-border-dark text-text-main-light dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon name="light_mode" size="sm" />
                    {t('preferences.theme.light')}
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 h-12 px-4 rounded-xl border font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-gray-50 dark:bg-gray-800 border-border-light dark:border-border-dark text-text-main-light dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon name="dark_mode" size="sm" />
                    {t('preferences.theme.dark')}
                  </button>
                </div>
              </div>

              <hr className="border-border-light dark:border-border-dark" />

              {/* Language selector */}
              <div className="max-w-md">
                <label className="block text-sm font-semibold text-text-main-light dark:text-gray-200 mb-2">
                  {t('preferences.language.label')}
                </label>
                <div className="relative">
                  <select
                    value={currentLanguage}
                    onChange={handleLanguageChange}
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-border-light dark:border-border-dark text-text-main-light dark:text-white font-medium cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {supportedLanguages.map((lang) => (
                      <option key={lang} value={lang}>
                        {LANGUAGE_LABELS[lang]}
                      </option>
                    ))}
                  </select>
                  <Icon
                    name="expand_more"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                    size="sm"
                  />
                </div>
              </div>

              <hr className="border-border-light dark:border-border-dark" />

              {/* Dietary restrictions */}
              <div>
                <label className="block text-sm font-semibold text-text-main-light dark:text-gray-200 mb-3">
                  {t('preferences.restrictions.label')}
                </label>
                <p className="text-sm text-text-muted-light dark:text-gray-400 mb-4">
                  {t('preferences.restrictions.description')}
                </p>
                <ChipInput
                  values={restrictions}
                  onChange={handleRestrictionChange}
                  placeholder={t('preferences.restrictions.placeholder')}
                  variant="default"
                />
                {/* Suggestions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs text-text-muted-light dark:text-gray-500 py-1">
                    {t('preferences.restrictions.suggestions')}
                  </span>
                  {suggestedRestrictions
                    .filter((r) => !restrictions.includes(r))
                    .map((restriction) => (
                      <button
                        key={restriction}
                        onClick={() => addSuggestedRestriction(restriction)}
                        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {restriction}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Legal */}
          <Card className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Icon name="gavel" />
              </div>
              <h3 className="text-xl font-bold text-text-main-light dark:text-white">
                {tLegal('settings.legal.title')}
              </h3>
            </div>

            <div className="space-y-3">
              <Link
                to="/terms"
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Icon name="description" className="text-text-muted-light dark:text-text-muted-dark" />
                  <span className="font-medium text-text-main-light dark:text-white">
                    {tLegal('settings.legal.termsOfService')}
                  </span>
                </div>
                <Icon name="chevron_right" className="text-text-muted-light dark:text-text-muted-dark group-hover:text-primary transition-colors" />
              </Link>

              <Link
                to="/privacy"
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Icon name="shield" className="text-text-muted-light dark:text-text-muted-dark" />
                  <span className="font-medium text-text-main-light dark:text-white">
                    {tLegal('settings.legal.privacyPolicy')}
                  </span>
                </div>
                <Icon name="chevron_right" className="text-text-muted-light dark:text-text-muted-dark group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </Card>

      </div>

      {/* Sticky Footer Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 border-t border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-6 z-10 h-[92px]">
        <div className="flex items-center justify-between h-full">
          <Button
            variant="ghost"
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            icon="logout"
            iconPosition="left"
            onClick={() => {
              logout()
              navigate('/login')
            }}
          >
            {t('actions.logOut')}
          </Button>
          <div className="flex items-center gap-4">
            {!hasChanges && (
              <span className="text-sm text-accent-green font-medium hidden sm:inline-block">
                {t('actions.allSaved')}
              </span>
            )}
            <Button
              icon="save"
              iconPosition="left"
              onClick={handleSave}
              loading={updateMutation.isPending}
              disabled={!hasChanges}
            >
              {t('actions.saveChanges')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

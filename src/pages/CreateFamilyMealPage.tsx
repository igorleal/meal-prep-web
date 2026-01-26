import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button, Icon, WeeklyLimitBanner, ChipInput } from '@/components/common'
import { userService } from '@/api/services'
import { useAuth } from '@/context/AuthContext'
import { useLanguage } from '@/context/LanguageContext'

const restrictionKeys = ['glutenFree', 'vegetarian', 'vegan', 'keto', 'dairyFree', 'paleo'] as const

export default function CreateFamilyMealPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { t } = useTranslation('familyCalendar')
  const { t: tCommon } = useTranslation('common')
  const { currentLanguage } = useLanguage()

  // Fetch current user to check weekly limit
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getMe,
  })

  // Parse date from URL params
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const mealType = searchParams.get('meal') || 'Dinner'

  const [restrictions, setRestrictions] = useState<string[]>([])
  const [mustHaves, setMustHaves] = useState<string[]>([])
  const [mustHaveInput, setMustHaveInput] = useState('')
  const [exclusions, setExclusions] = useState<string[]>([])
  const [exclusionInput, setExclusionInput] = useState('')

  const hasReachedLimit = currentUser?.hasReachedWeeklyLimit ?? false

  // Get locale for date formatting
  const getDateLocale = () => {
    switch (currentLanguage) {
      case 'pt': return 'pt-BR'
      case 'sv': return 'sv-SE'
      default: return 'en-US'
    }
  }

  // Pre-fill dietary restrictions from user profile
  useEffect(() => {
    if (user?.restrictions) {
      setRestrictions(user.restrictions)
    }
  }, [user?.restrictions])

  // Get translated restriction options
  const getSuggestedRestrictions = () => {
    return restrictionKeys.map((key) => ({
      key,
      label: t(`create.sections.restrictions.options.${key}`),
    }))
  }

  const addSuggestedRestriction = (label: string) => {
    if (!restrictions.includes(label)) {
      setRestrictions([...restrictions, label])
    }
  }

  // Parse date for display with locale
  const date = new Date(dateParam)
  const dayName = date.toLocaleDateString(getDateLocale(), { weekday: 'long' })
  const month = date.toLocaleDateString(getDateLocale(), { month: 'short' })
  const dayNum = date.getDate()

  // Get translated meal type
  const getMealTypeLabel = () => {
    const mealTypeLower = mealType.toLowerCase()
    if (['breakfast', 'lunch', 'dinner', 'snack'].includes(mealTypeLower)) {
      return t(`create.sections.mealDetails.types.${mealTypeLower}`)
    }
    return mealType
  }

  const handleAddMustHave = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && mustHaveInput.trim()) {
      e.preventDefault()
      if (!mustHaves.includes(mustHaveInput.trim())) {
        setMustHaves([...mustHaves, mustHaveInput.trim()])
      }
      setMustHaveInput('')
    }
  }

  const removeMustHave = (item: string) => {
    setMustHaves(mustHaves.filter((h) => h !== item))
  }

  const handleAddExclusion = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && exclusionInput.trim()) {
      e.preventDefault()
      if (!exclusions.includes(exclusionInput.trim())) {
        setExclusions([...exclusions, exclusionInput.trim()])
      }
      setExclusionInput('')
    }
  }

  const removeExclusion = (item: string) => {
    setExclusions(exclusions.filter((e) => e !== item))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const request = {
      date: dateParam,
      restrictions,
      mustHaves,
      exclusions,
    }
    // Store request and navigate immediately - the selection page will make the API call
    sessionStorage.setItem(
      'pendingFamilyMealRequest',
      JSON.stringify({
        date: dateParam,
        mealType,
        restrictions,
        mustHaves,
        exclusions,
        request,
      })
    )
    // Clear any previous recipes
    sessionStorage.removeItem('pendingFamilyMeal')
    navigate('/calendar/recipes')
  }

  const suggestedRestrictions = getSuggestedRestrictions()

  return (
    <div className="relative min-h-full pb-24">
      <div className="w-full max-w-3xl mx-auto p-6 lg:p-10">
        {/* Back link */}
        <button
          onClick={() => navigate('/calendar')}
          className="inline-flex items-center text-text-muted-light dark:text-text-muted-dark hover:text-primary mb-8 transition-colors font-bold text-sm gap-2 group"
        >
          <Icon name="arrow_back" size="sm" className="group-hover:-translate-x-1 transition-transform" />
          {t('create.backButton')}
        </button>

        {/* Weekly Limit Banner */}
        {hasReachedLimit && <WeeklyLimitBanner />}

        {/* Header */}
        <div className="space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-main-light dark:text-white tracking-tight">
            {t('create.title')}
          </h1>
          <p className="text-lg text-text-muted-light dark:text-text-muted-dark">
            {t('create.subtitle')}
          </p>
        </div>

        {/* Date Card */}
        <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-6 shadow-sm mb-10 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="bg-primary/10 text-primary p-3 rounded-xl min-w-[70px] text-center border border-primary/10">
              <span className="block text-xs font-bold uppercase tracking-wider mb-0.5">{month}</span>
              <span className="block text-3xl font-extrabold leading-none">{dayNum.toString().padStart(2, '0')}</span>
            </div>
            <h3 className="text-xl font-bold text-text-main-light dark:text-white">
              {dayName} {getMealTypeLabel()}
            </h3>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Dietary Restrictions */}
          <div className="space-y-4">
            <label className="text-text-main-light dark:text-white font-bold text-lg flex items-center gap-2">
              <Icon name="spa" className="text-primary" />
              {t('create.sections.restrictions.title')}
            </label>
            <ChipInput
              values={restrictions}
              onChange={setRestrictions}
              placeholder={t('create.sections.restrictions.placeholder')}
            />
            {/* Suggested restrictions */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-text-muted-light dark:text-text-muted-dark py-1">
                {t('create.sections.restrictions.suggestionsLabel')}
              </span>
              {suggestedRestrictions
                .filter((r) => !restrictions.includes(r.label))
                .map((restriction) => (
                  <button
                    key={restriction.key}
                    type="button"
                    onClick={() => addSuggestedRestriction(restriction.label)}
                    className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {restriction.label}
                  </button>
                ))}
            </div>
          </div>

          {/* Must Have Ingredients */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <label className="text-text-main-light dark:text-white font-bold text-lg flex items-center gap-2">
                <Icon name="grocery" className="text-primary" />
                {t('create.sections.preferences.mustHaves')}
              </label>
              <span className="text-xs font-bold text-primary uppercase tracking-wide">{tCommon('labels.optional')}</span>
            </div>
            <div className="bg-surface-light dark:bg-white/5 p-4 rounded-xl border border-border-light dark:border-border-dark focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
              <div className="flex flex-wrap gap-2 mb-2">
                {mustHaves.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-bold"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeMustHave(item)}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <Icon name="close" size="sm" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={mustHaveInput}
                onChange={(e) => setMustHaveInput(e.target.value)}
                onKeyDown={handleAddMustHave}
                placeholder={t('create.sections.preferences.placeholder')}
                className="w-full bg-transparent border-none p-0 text-text-main-light dark:text-white placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:ring-0 text-base"
              />
            </div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark pl-1">
              {t('create.sections.preferences.mustHavesDescription')}
            </p>
          </div>

          {/* Exclude Ingredients */}
          <div className="space-y-4">
            <div className="flex justify-between items-baseline">
              <label className="text-text-main-light dark:text-white font-bold text-lg flex items-center gap-2">
                <Icon name="block" className="text-primary" />
                {t('create.sections.preferences.excludes')}
              </label>
              <span className="text-xs font-bold text-primary uppercase tracking-wide">{tCommon('labels.optional')}</span>
            </div>
            <div className="bg-surface-light dark:bg-white/5 p-4 rounded-xl border border-border-light dark:border-border-dark focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
              <div className="flex flex-wrap gap-2 mb-2">
                {exclusions.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-sm font-bold"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeExclusion(item)}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <Icon name="close" size="sm" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={exclusionInput}
                onChange={(e) => setExclusionInput(e.target.value)}
                onKeyDown={handleAddExclusion}
                placeholder={t('create.sections.preferences.placeholder')}
                className="w-full bg-transparent border-none p-0 text-text-main-light dark:text-white placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark focus:ring-0 text-base"
              />
            </div>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark pl-1">
              {t('create.sections.preferences.excludesDescription')}
            </p>
          </div>

        </form>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 border-t border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-6 z-10 h-[92px]">
        <div className="flex justify-end items-center gap-4 h-full">
          <Button
            variant="secondary"
            onClick={() => navigate('/calendar')}
          >
            {t('create.cancelButton')}
          </Button>
          <Button
            icon="arrow_forward"
            iconPosition="right"
            onClick={handleSubmit}
            disabled={hasReachedLimit}
            className="shadow-lg shadow-primary/20"
          >
            {t('create.nextButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}

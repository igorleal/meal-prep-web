import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button, Icon, WeeklyLimitBanner } from '@/components/common'
import { userService } from '@/api/services'
import { useLanguage } from '@/context/LanguageContext'

export default function CreateFamilyMealPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t } = useTranslation('familyCalendar')
  const { currentLanguage } = useLanguage()

  // Fetch current user to check weekly limit
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getMe,
  })

  // Parse date from URL params
  const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0]
  const mealType = searchParams.get('meal') || 'Dinner'

  const hasReachedLimit = currentUser?.hasReachedWeeklyLimit ?? false

  // Get locale for date formatting
  const getDateLocale = () => {
    switch (currentLanguage) {
      case 'pt': return 'pt-BR'
      case 'sv': return 'sv-SE'
      default: return 'en-US'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Store only required fields - AI options will be collected on the source page
    sessionStorage.setItem(
      'pendingFamilyMealRequest',
      JSON.stringify({
        date: dateParam,
        mealType,
      })
    )
    // Clear any previous recipes and source selection
    sessionStorage.removeItem('pendingFamilyMeal')
    sessionStorage.removeItem('selectedRecipe')
    sessionStorage.removeItem('recipeSource')
    navigate('/calendar/source')
  }

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

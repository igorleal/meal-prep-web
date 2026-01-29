import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Card, DatePicker, WeeklyLimitBanner } from '@/components/common'
import { userService } from '@/api/services'

export default function CreateSpecialMealPage() {
  const navigate = useNavigate()
  const { t } = useTranslation('specialMeals')
  const { t: tCommon } = useTranslation('common')

  // Fetch current user to check weekly limit
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getMe,
  })

  const [name, setName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [dateError, setDateError] = useState('')

  const hasReachedLimit = currentUser?.hasReachedWeeklyLimit ?? false

  const isValidDate = (dateString: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return false
    }
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    )
  }

  const handleDateChange = (value: string) => {
    setEventDate(value)
    // Validate when complete
    if (value.length === 10) {
      if (!isValidDate(value)) {
        setDateError(tCommon('errors.invalidDate'))
      } else {
        setDateError('')
      }
    } else {
      setDateError('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate date before submitting
    if (!isValidDate(eventDate)) {
      setDateError(tCommon('errors.invalidDate'))
      return
    }

    // Store only required fields - AI options will be collected on the source page
    sessionStorage.setItem(
      'pendingSpecialMealRequest',
      JSON.stringify({
        name,
        eventDate,
      })
    )
    // Clear any previous recipes and source selection
    sessionStorage.removeItem('pendingSpecialMeal')
    sessionStorage.removeItem('selectedRecipe')
    sessionStorage.removeItem('recipeSource')
    navigate('/special-meals/source')
  }

  return (
    <div className="relative min-h-full pb-24">
      <div className="max-w-[1000px] mx-auto px-6 py-8 lg:px-10 lg:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-8 text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
        <button
          onClick={() => navigate('/special-meals')}
          className="hover:text-primary flex items-center gap-1 transition-colors"
        >
          <Icon name="arrow_back" size="sm" />
          {t('create.backButton')}
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-text-main-light dark:text-white">{t('create.breadcrumb')}</span>
      </div>

      {/* Weekly Limit Banner */}
      {hasReachedLimit && <WeeklyLimitBanner />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main form */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {t('create.badge')}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-text-main-light dark:text-white mb-3">
              {t('create.title')}
            </h1>
            <p className="text-text-muted-light dark:text-text-muted-dark text-lg">
              {t('create.subtitle')}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-border-light dark:border-border-dark shadow-sm p-6 lg:p-8 space-y-8"
          >
            {/* Event Name */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-text-main-light dark:text-white flex justify-between">
                {t('create.sections.eventDetails.eventName')}
                <span className="text-text-muted-light dark:text-text-muted-dark font-normal text-xs">{tCommon('labels.required')}</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icon name="celebration" className="text-primary text-xl" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('create.sections.eventDetails.placeholder')}
                  required
                  className="block w-full pl-12 pr-4 py-4 border-2 border-border-light dark:border-border-dark rounded-xl text-lg font-semibold text-text-main-light dark:text-white bg-background-light dark:bg-white/5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors placeholder:text-text-muted-light/60 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Event Date */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-text-main-light dark:text-white flex justify-between">
                {t('create.sections.eventDetails.date')}
                <span className="text-text-muted-light dark:text-text-muted-dark font-normal text-xs">{tCommon('labels.required')}</span>
              </label>
              <DatePicker
                value={eventDate}
                onChange={handleDateChange}
                error={dateError}
                required
              />
            </div>
          </form>

        </div>

        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-4 space-y-6">
          {/* AI Assistant Card */}
          <Card className="bg-gradient-to-br from-accent-green/20 to-white dark:from-accent-green/10 dark:to-surface-dark border-accent-green/20 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent-green/20 rounded-full blur-2xl" />
            <div className="flex items-center gap-2 mb-4 text-accent-green">
              <Icon name="auto_awesome" />
              <span className="text-xs font-bold uppercase tracking-wide">{t('create.aiAssistant.badge')}</span>
            </div>
            <h3 className="font-bold text-lg mb-2 text-text-main-light dark:text-white">
              {t('create.aiAssistant.title')}
            </h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-4">
              {t('create.aiAssistant.description')}
            </p>
            <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 backdrop-blur-sm border border-white/50 dark:border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="size-8 rounded-full bg-accent-green/10 flex items-center justify-center text-accent-green">
                  <Icon name="lightbulb" size="sm" />
                </div>
                <span className="text-xs font-bold text-text-main-light dark:text-white">{t('create.aiAssistant.tipTitle')}</span>
              </div>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                {t('create.aiAssistant.tipDescription')}
              </p>
            </div>
          </Card>
        </div>
      </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 border-t border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-6 z-10 h-[92px]">
        <div className="flex justify-end items-center gap-4 h-full">
          <Button
            variant="secondary"
            onClick={() => navigate('/special-meals')}
          >
            {t('create.cancelButton')}
          </Button>
          <Button
            icon="arrow_forward"
            iconPosition="right"
            onClick={handleSubmit}
            disabled={!name.trim() || hasReachedLimit}
            className="shadow-lg shadow-primary/20"
          >
            {t('create.nextButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}

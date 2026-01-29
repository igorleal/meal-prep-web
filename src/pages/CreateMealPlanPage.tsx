import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  Button,
  Input,
  Accordion,
  WeeklyLimitBanner,
} from '@/components/common'
import { userService } from '@/api/services'

export default function CreateMealPlanPage() {
  const navigate = useNavigate()
  const { t } = useTranslation('mealPlans')

  // Fetch current user to check weekly limit
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getMe,
  })

  // Form state - only plan name now
  const [planName, setPlanName] = useState('')

  const hasReachedLimit = currentUser?.hasReachedWeeklyLimit ?? false

  const handleSubmit = () => {
    // Store only the plan name - AI options will be collected on the source page
    sessionStorage.setItem(
      'pendingMealPlanRequest',
      JSON.stringify({
        planName,
      })
    )
    // Clear any previous recipes and source selection
    sessionStorage.removeItem('pendingMealPlan')
    sessionStorage.removeItem('selectedRecipe')
    sessionStorage.removeItem('recipeSource')
    navigate('/meal-plans/source')
  }

  return (
    <div className="relative min-h-full pb-24">
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
          {/* Weekly Limit Banner */}
          {hasReachedLimit && <WeeklyLimitBanner />}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-text-main-light dark:text-white mb-2">
          {t('create.title')}
        </h1>
        <p className="text-text-muted-light dark:text-text-muted-dark">
          {t('create.subtitle')}
        </p>
      </div>

      {/* Form Sections */}
      <div className="flex flex-col gap-4">
        {/* Basic Info */}
        <Accordion number={1} title={t('create.sections.basicInfo.title')} subtitle={planName} defaultOpen>
          <Input
            label={t('create.sections.basicInfo.planName')}
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder={t('create.sections.basicInfo.placeholder')}
          />
        </Accordion>
      </div>

      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 border-t border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-6 z-10 h-[92px]">
        <div className="flex justify-end items-center gap-4 h-full">
          <Button
            variant="secondary"
            onClick={() => navigate('/meal-plans')}
          >
            {t('create.cancelButton')}
          </Button>
          <Button
            icon="arrow_forward"
            iconPosition="right"
            onClick={handleSubmit}
            disabled={!planName.trim() || hasReachedLimit}
            className="shadow-lg shadow-primary/20"
          >
            {t('create.nextButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}

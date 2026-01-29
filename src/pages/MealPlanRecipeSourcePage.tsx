import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/common'
import { RecipeSourceSelector, type RecipeSourceType } from '@/components/features'
import { userService } from '@/api/services'

export default function MealPlanRecipeSourcePage() {
  const navigate = useNavigate()
  const { t } = useTranslation('mealPlans')
  const { t: tCommon } = useTranslation('common')

  // Fetch current user to check weekly limit
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: userService.getMe,
  })

  const hasReachedLimit = currentUser?.hasReachedWeeklyLimit ?? false

  // Verify we have pending request data
  useEffect(() => {
    const pendingRequest = sessionStorage.getItem('pendingMealPlanRequest')
    if (!pendingRequest) {
      navigate('/meal-plans/create')
    }
  }, [navigate])

  const handleSelectSource = (source: RecipeSourceType) => {
    if (source === 'ai') {
      navigate('/meal-plans/source/ai')
    } else if (source === 'favorite') {
      navigate('/meal-plans/source/favorites')
    } else if (source === 'loaded') {
      navigate('/meal-plans/source/load')
    }
  }

  return (
    <div className="relative min-h-full pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        {/* Step indicator */}
        <div className="flex items-center gap-2 text-sm text-text-muted-light dark:text-text-muted-dark mb-6">
          <span className="text-primary font-bold">{tCommon('steps.step')} 2</span>
          <span>/</span>
          <span>3</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-text-main-light dark:text-white mb-2">
            {t('source.title', 'Choose Recipe Source')}
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            {t('source.subtitle', 'How would you like to get recipes for your meal plan?')}
          </p>
        </div>

        {/* Source Selector */}
        <RecipeSourceSelector
          hasReachedWeeklyLimit={hasReachedLimit}
          onSelectSource={handleSelectSource}
        />
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 border-t border-border-light dark:border-border-dark bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-sm p-6 z-10 h-[92px]">
        <div className="flex justify-between items-center gap-4 h-full">
          <Button
            variant="secondary"
            icon="arrow_back"
            onClick={() => navigate('/meal-plans/create')}
          >
            {tCommon('buttons.back')}
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate('/meal-plans')}
          >
            {t('create.cancelButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}

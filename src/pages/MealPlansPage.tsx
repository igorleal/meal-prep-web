import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Card, LoadingOverlay, MobileCarousel, EmptyState } from '@/components/common'
import { receitaiPlanService } from '@/api/services'
import { getRecipeImageUrl } from '@/utils/placeholders'
import type { ReceitAIPlanResponse } from '@/types'

function MealPlanCard({
  plan,
  onDelete,
  onClick,
}: {
  plan: ReceitAIPlanResponse
  onDelete: (plan: ReceitAIPlanResponse) => void
  onClick: (plan: ReceitAIPlanResponse) => void
}) {
  const { request, recipe } = plan
  const { t } = useTranslation('mealPlans')
  const { t: tCommon } = useTranslation('common')

  return (
    <Card padding="none" hover className="overflow-hidden group cursor-pointer" onClick={() => onClick(plan)}>
      {/* Image Section */}
      <div className="relative w-full h-48 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url("${getRecipeImageUrl(recipe.imageUrl, 'mealPlan')}")`,
          }}
        />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5">
        {/* Plan Name */}
        <div className="mb-2">
          <span className="text-primary text-xs font-bold uppercase tracking-wider">
            {request.name}
          </span>
        </div>

        {/* Recipe Name */}
        <h3 className="text-text-main-light dark:text-white text-lg font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
          {recipe.name}
        </h3>

        {/* Tags and Delete */}
        <div className="mt-auto flex items-center gap-2">
          <div className="flex flex-wrap gap-2 flex-1">
            <div className="bg-gray-100 dark:bg-[#393028] px-2 py-1 rounded text-xs text-text-muted-light dark:text-text-muted-dark font-medium">
              {tCommon('units.meals', { count: request.mealsPerDay * request.days })}
            </div>
            <div className="bg-gray-100 dark:bg-[#393028] px-2 py-1 rounded text-xs text-text-muted-light dark:text-text-muted-dark font-medium">
              {tCommon('units.days', { count: request.days })}
            </div>
            {request.restrictions && request.restrictions.length > 0 && (
              <div className="bg-gray-100 dark:bg-[#393028] px-2 py-1 rounded text-xs text-text-muted-light dark:text-text-muted-dark font-medium">
                {request.restrictions[0]}
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(plan)
            }}
            className="size-9 rounded-lg flex items-center justify-center text-text-muted-light dark:text-text-muted-dark hover:text-red-400 hover:bg-red-400/10 transition-colors"
            title={t('list.card.deletePlan')}
          >
            <Icon name="delete" size="sm" />
          </button>
        </div>
      </div>
    </Card>
  )
}

export default function MealPlansPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation('mealPlans')
  const { t: tCommon } = useTranslation('common')
  const [planToDelete, setPlanToDelete] = useState<ReceitAIPlanResponse | null>(null)

  const { data: plans, isLoading } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: receitaiPlanService.getPlans,
  })

  const deleteMutation = useMutation({
    mutationFn: receitaiPlanService.deletePlan,
    onSuccess: () => {
      setPlanToDelete(null)
      queryClient.invalidateQueries({ queryKey: ['mealPlans'] })
    },
  })

  const handleConfirmDelete = () => {
    if (planToDelete) {
      deleteMutation.mutate(planToDelete.plan.id)
    }
  }

  const handleViewPlan = (plan: ReceitAIPlanResponse) => {
    sessionStorage.setItem('viewingMealPlan', JSON.stringify(plan))
    navigate('/meal-plans/recipe')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-text-main-light dark:text-white mb-2">
            {t('list.title')}
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            {t('list.subtitle')}
          </p>
        </div>
        <Button
          icon="add"
          iconPosition="left"
          onClick={() => navigate('/meal-plans/create')}
        >
          {t('list.createNew')}
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingOverlay message={t('list.loading')} />
      ) : plans && plans.length > 0 ? (
        <>
          {/* Mobile carousel */}
          <div className="md:hidden">
            <MobileCarousel
              items={plans}
              keyExtractor={(plan) => plan.plan.id}
              renderItem={(plan) => (
                <MealPlanCard
                  plan={plan}
                  onDelete={setPlanToDelete}
                  onClick={handleViewPlan}
                />
              )}
            />
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <MealPlanCard
                key={plan.plan.id}
                plan={plan}
                onDelete={setPlanToDelete}
                onClick={handleViewPlan}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          imageUrl="https://lh3.googleusercontent.com/aida-public/AB6AXuADZhlrl3_VduGQRkep0nSPNCK6hNBkGAfvFEoJvAeEKZYkBXNJ_mxlmyG4bac3oHkK3av1o_6_Xl52ePeTcN5sHL10Ctrlzm_RkugE0ysPLtkfSflWiBy19rFS6iOfjg1ku_TZEtqYZ17RBiEI-dUxWeSGtSqKoIVj9LOqFIyjZi0uk4K6sEARx8Mbv_4MokqDC316qSuRgog3053TjJA2RA-2SkGlDxUWRz3n1_XuHVRV4fJfni4Bg1q9xvszcajTjw46Ol2WMeY"
          title={t('list.empty.title')}
          description={t('list.empty.description')}
          buttonText={t('list.empty.button')}
          onButtonClick={() => navigate('/meal-plans/create')}
        />
      )}

      {/* Delete Confirmation Modal */}
      {planToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setPlanToDelete(null)}
          />

          {/* Modal */}
          <div className="relative bg-surface-light dark:bg-surface-dark rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Icon name="delete" className="text-red-600 dark:text-red-400 text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-text-main-light dark:text-white mb-2">
                  {t('delete.title')}
                </h3>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  {t('delete.message')}{' '}
                  <strong className="text-text-main-light dark:text-white">
                    "{planToDelete.request.name}"
                  </strong>
                  ? {t('delete.warning')}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setPlanToDelete(null)}
                disabled={deleteMutation.isPending}
              >
                {tCommon('buttons.cancel')}
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmDelete}
                loading={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                {tCommon('buttons.delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

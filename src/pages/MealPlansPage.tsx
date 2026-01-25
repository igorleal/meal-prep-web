import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Card, Badge, LoadingOverlay, MobileCarousel } from '@/components/common'
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
      <div className="aspect-video relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url("${getRecipeImageUrl(recipe.imageUrl, 'mealPlan')}")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge
          variant="primary"
          icon="auto_awesome"
          className="absolute top-3 left-3"
        >
          {t('list.card.aiGenerated')}
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-text-main-light dark:text-white mb-2">
          {request.name}
        </h3>
        <p className="text-text-muted-light dark:text-text-muted-dark text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-text-muted-light dark:text-text-muted-dark">
            <span className="flex items-center gap-1">
              <Icon name="restaurant" size="sm" />
              {tCommon('units.meals', { count: request.mealsPerDay * request.days })}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="calendar_today" size="sm" />
              {tCommon('units.days', { count: request.days })}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(plan)
            }}
            className="w-8 h-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-text-muted-light dark:text-text-muted-dark hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
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
        <div className="text-center py-16">
          <Icon
            name="restaurant_menu"
            className="text-gray-300 dark:text-gray-600 mb-4"
            size="xl"
          />
          <h3 className="text-lg font-semibold text-text-main-light dark:text-white mb-2">
            {t('list.empty.title')}
          </h3>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
            {t('list.empty.description')}
          </p>
          <Button onClick={() => navigate('/meal-plans/create')}>
            {t('list.empty.button')}
          </Button>
        </div>
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

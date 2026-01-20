import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Icon, Card, Badge, LoadingOverlay } from '@/components/common'
import { receitaiPlanService } from '@/api/services'
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

  return (
    <Card padding="none" hover className="overflow-hidden group cursor-pointer" onClick={() => onClick(plan)}>
      <div className="aspect-video relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge
          variant="primary"
          icon="auto_awesome"
          className="absolute top-3 left-3"
        >
          AI Generated
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
              {request.mealsPerDay * request.days} meals
            </span>
            <span className="flex items-center gap-1">
              <Icon name="calendar_today" size="sm" />
              {request.days} days
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(plan)
            }}
            className="w-8 h-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-text-muted-light dark:text-text-muted-dark hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            title="Delete plan"
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
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-text-main-light dark:text-white mb-2">
            My Meal Plans
          </h1>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Browse and manage your AI-generated meal plans
          </p>
        </div>
        <Button
          icon="add"
          iconPosition="left"
          onClick={() => navigate('/meal-plans/create')}
        >
          Create New Plan
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingOverlay message="Loading meal plans..." />
      ) : plans && plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <MealPlanCard
              key={plan.plan.id}
              plan={plan}
              onDelete={setPlanToDelete}
              onClick={handleViewPlan}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Icon
            name="restaurant_menu"
            className="text-gray-300 dark:text-gray-600 mb-4"
            size="xl"
          />
          <h3 className="text-lg font-semibold text-text-main-light dark:text-white mb-2">
            No meal plans yet
          </h3>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
            Create your first AI-powered meal plan to get started
          </p>
          <Button onClick={() => navigate('/meal-plans/create')}>
            Create Your First Plan
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
                  Delete Plan
                </h3>
                <p className="text-text-muted-light dark:text-text-muted-dark">
                  Are you sure you want to delete{' '}
                  <strong className="text-text-main-light dark:text-white">
                    "{planToDelete.request.name}"
                  </strong>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setPlanToDelete(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirmDelete}
                loading={deleteMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

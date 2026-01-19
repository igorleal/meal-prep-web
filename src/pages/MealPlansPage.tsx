import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Icon, Card, Badge, LoadingOverlay } from '@/components/common'
import { receitaiPlanService } from '@/api/services'
import type { ReceitAIPlanResponse } from '@/types'

function MealPlanCard({ plan }: { plan: ReceitAIPlanResponse }) {
  const { request, recipe } = plan

  return (
    <Card padding="none" hover className="overflow-hidden group">
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
          <Link
            to={`/meal-plans/${request.id}`}
            className="text-primary font-semibold text-sm hover:underline"
          >
            View Plan
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default function MealPlansPage() {
  const navigate = useNavigate()

  const { data: plans, isLoading } = useQuery({
    queryKey: ['mealPlans'],
    queryFn: receitaiPlanService.getPlans,
  })

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
            <MealPlanCard key={plan.request.id} plan={plan} />
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
    </div>
  )
}

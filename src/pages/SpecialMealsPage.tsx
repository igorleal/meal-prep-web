import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Button, Icon, Card, LoadingOverlay, MobileCarousel } from '@/components/common'
import { foodFriendsService } from '@/api/services'
import { getRecipeImageUrl } from '@/utils/placeholders'
import type { FoodFriendsResponse } from '@/types'

function EventCard({
  event,
  onDelete,
  onClick,
}: {
  event: FoodFriendsResponse
  onDelete: (event: FoodFriendsResponse) => void
  onClick: (event: FoodFriendsResponse) => void
}) {
  const { request, recipe } = event

  return (
    <Card padding="none" hover className="overflow-hidden group cursor-pointer" onClick={() => onClick(event)}>
      {/* Image with overlay */}
      <div className="aspect-video relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url("${getRecipeImageUrl(recipe.imageUrl, 'specialMeal')}")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Date badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-black/70 rounded text-xs font-medium">
          <Icon name="calendar_today" size="sm" />
          <span>Jan 24</span>
        </div>

        {/* Recipe name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-2">{recipe.name}</h3>
          <div className="flex flex-wrap gap-2">
            {request.restrictions.length > 0 && (
              <span className="px-2 py-1 bg-accent-green/80 rounded text-xs text-white">
                {request.restrictions[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer - Event name and delete */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="celebration" size="sm" className="text-primary" />
          <span className="text-sm font-semibold text-text-main-light dark:text-white">
            {request.name}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(event)
          }}
          className="w-8 h-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-text-muted-light dark:text-text-muted-dark hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
          title="Delete event"
        >
          <Icon name="delete" size="sm" />
        </button>
      </div>
    </Card>
  )
}

export default function SpecialMealsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t } = useTranslation('specialMeals')
  const { t: tCommon } = useTranslation('common')
  const [eventToDelete, setEventToDelete] = useState<FoodFriendsResponse | null>(null)

  const { data: events, isLoading } = useQuery({
    queryKey: ['foodFriends'],
    queryFn: foodFriendsService.getEvents,
  })

  const deleteMutation = useMutation({
    mutationFn: foodFriendsService.deletePlan,
    onSuccess: () => {
      setEventToDelete(null)
      queryClient.invalidateQueries({ queryKey: ['foodFriends'] })
    },
  })

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      deleteMutation.mutate(eventToDelete.plan.id)
    }
  }

  const handleViewEvent = (event: FoodFriendsResponse) => {
    sessionStorage.setItem('viewingSpecialMeal', JSON.stringify(event))
    navigate('/special-meals/recipe')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Icon name="celebration" className="text-primary" size="lg" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-text-main-light dark:text-white">
              {t('list.title')}
            </h1>
          </div>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            {t('list.subtitle')}
          </p>
        </div>
        <Button
          icon="add"
          iconPosition="left"
          onClick={() => navigate('/special-meals/create')}
        >
          {t('list.createNew')}
        </Button>
      </div>

      {/* Events grid */}
      {isLoading ? (
        <LoadingOverlay message={t('list.loading')} />
      ) : events && events.length > 0 ? (
        <>
          {/* Mobile carousel */}
          <div className="md:hidden">
            <MobileCarousel
              items={events}
              keyExtractor={(event) => event.plan.id}
              renderItem={(event) => (
                <EventCard
                  event={event}
                  onDelete={setEventToDelete}
                  onClick={handleViewEvent}
                />
              )}
            />
          </div>

          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.plan.id}
                event={event}
                onDelete={setEventToDelete}
                onClick={handleViewEvent}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <Icon
            name="celebration"
            className="text-gray-300 dark:text-gray-600 mb-4"
            size="xl"
          />
          <h3 className="text-lg font-semibold text-text-main-light dark:text-white mb-2">
            {t('list.empty.title')}
          </h3>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
            {t('list.empty.description')}
          </p>
          <Button onClick={() => navigate('/special-meals/create')}>
            {t('list.empty.button')}
          </Button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {eventToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setEventToDelete(null)}
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
                    "{eventToDelete.request.name}"
                  </strong>
                  ? {t('delete.warning')}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="ghost"
                onClick={() => setEventToDelete(null)}
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

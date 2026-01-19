import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Button, Icon, Card, Badge, LoadingOverlay } from '@/components/common'
import { foodFriendsService } from '@/api/services'
import type { FoodFriendsResponse } from '@/types'

function EventCard({ event }: { event: FoodFriendsResponse }) {
  const { request, recipe } = event

  return (
    <Card padding="none" hover className="overflow-hidden group">
      {/* Image with overlay */}
      <div className="aspect-video relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Status badge */}
        <Badge
          variant="success"
          className="absolute top-3 right-3"
        >
          Confirmed
        </Badge>

        {/* Date badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-black/70 rounded text-xs font-medium">
          <Icon name="calendar_today" size="sm" />
          <span>Jan 24</span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white mb-2">{request.name}</h3>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs text-white">
              {recipe.name}
            </span>
            {request.restrictions.length > 0 && (
              <span className="px-2 py-1 bg-accent-green/80 rounded text-xs text-white">
                {request.restrictions[0]}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="group" size="sm" className="text-text-muted-light dark:text-text-muted-dark" />
          <span className="text-sm text-text-muted-light dark:text-text-muted-dark">
            6 Guests
          </span>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="size-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-surface-light dark:border-surface-dark"
            />
          ))}
          <div className="size-8 rounded-full bg-primary/10 text-primary border-2 border-surface-light dark:border-surface-dark flex items-center justify-center text-xs font-bold">
            +3
          </div>
        </div>
      </div>
    </Card>
  )
}

export default function SpecialMealsPage() {
  const navigate = useNavigate()

  const { data: events, isLoading } = useQuery({
    queryKey: ['foodFriends'],
    queryFn: foodFriendsService.getEvents,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Icon name="celebration" className="text-primary" size="lg" />
            <h1 className="text-3xl font-extrabold text-text-main-light dark:text-white">
              Your Special Occasions
            </h1>
          </div>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Plan memorable meals for the people who matter most
          </p>
        </div>
        <Button
          icon="add"
          iconPosition="left"
          onClick={() => navigate('/special-meals/create')}
        >
          Plan New Gathering
        </Button>
      </div>

      {/* Events grid */}
      {isLoading ? (
        <LoadingOverlay message="Loading events..." />
      ) : events && events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.request.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Icon
            name="celebration"
            className="text-gray-300 dark:text-gray-600 mb-4"
            size="xl"
          />
          <h3 className="text-lg font-semibold text-text-main-light dark:text-white mb-2">
            No special occasions planned
          </h3>
          <p className="text-text-muted-light dark:text-text-muted-dark mb-6">
            Create your first gathering to get started
          </p>
          <Button onClick={() => navigate('/special-meals/create')}>
            Plan Your First Gathering
          </Button>
        </div>
      )}
    </div>
  )
}

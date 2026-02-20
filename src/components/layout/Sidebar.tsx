import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/utils/cn'
import { Icon } from '@/components/common'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItemKeys = [
  { id: 'dashboard', path: '/', icon: 'dashboard', labelKey: 'sidebar.dashboard' },
  { id: 'planner', path: '/meal-plans', icon: 'calendar_month', labelKey: 'sidebar.mealPlanner' },
  { id: 'calendar', path: '/calendar', icon: 'event', labelKey: 'sidebar.familyCalendar' },
  { id: 'special', path: '/special-meals', icon: 'local_dining', labelKey: 'sidebar.specialMeals' },
  { id: 'favorites', path: '/favorites', icon: 'favorite', labelKey: 'sidebar.favorites' },
  { id: 'settings', path: '/settings', icon: 'person', labelKey: 'sidebar.profile' },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { t } = useTranslation('navigation')

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:static inset-y-0 left-0 z-50 w-56 md:w-64 h-screen flex-shrink-0 flex flex-col overflow-hidden',
          'border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark',
          'transform transition-transform duration-300 ease-in-out',
          'md:transform-none md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-primary/10 flex items-center justify-center rounded-xl size-10">
              <Icon name="restaurant_menu" className="text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">{t('brand.name')}</h1>
              <p className="text-text-muted-light dark:text-gray-400 text-xs">{t('brand.tagline')}</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2">
            {navItemKeys.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-text-main-light dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon
                    name={item.icon}
                    className={isActive ? 'text-primary' : 'text-gray-400'}
                  />
                  <span className={cn('text-sm', isActive ? 'font-bold' : 'font-medium')}>
                    {t(item.labelKey)}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}

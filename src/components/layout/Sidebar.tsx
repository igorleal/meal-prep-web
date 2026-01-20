import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { Icon } from '@/components/common'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { id: 'dashboard', path: '/', icon: 'dashboard', label: 'Dashboard' },
  { id: 'planner', path: '/meal-plans', icon: 'calendar_month', label: 'Meal Planner' },
  { id: 'calendar', path: '/calendar', icon: 'event', label: 'Family Calendar' },
  { id: 'special', path: '/special-meals', icon: 'local_dining', label: 'Special Meals' },
  { id: 'favorites', path: '/favorites', icon: 'favorite', label: 'Favorite Recipes' },
  { id: 'profile', path: '/settings', icon: 'person', label: 'Profile' },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    onClose()
  }

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
          'fixed md:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col justify-between',
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
              <h1 className="text-lg font-bold leading-none">ReceitAI</h1>
              <p className="text-text-muted-light dark:text-gray-400 text-xs">Plan smart</p>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => {
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
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Theme toggle */}
        <div className="p-6 border-t border-border-light dark:border-border-dark">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-text-muted-light dark:text-gray-400 hover:text-text-main-light dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon name={theme === 'light' ? 'dark_mode' : 'light_mode'} />
            <span className="text-sm font-medium">
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-text-muted-light dark:text-gray-400 hover:text-text-main-light dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon name="logout" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

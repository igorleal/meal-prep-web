import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Icon, Card, ChipInput, LoadingOverlay } from '@/components/common'
import { userService } from '@/api/services'
import { useAuth } from '@/context/AuthContext'

const suggestedRestrictions = ['Vegan', 'Gluten-Free', 'Paleo', 'Low-Sodium']

export default function SettingsPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { logout, updateUser } = useAuth()
  const [restrictions, setRestrictions] = useState<string[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: userService.getMe,
  })

  useEffect(() => {
    if (user?.restrictions) {
      setRestrictions(user.restrictions)
    }
  }, [user])

  const updateMutation = useMutation({
    mutationFn: (newRestrictions: string[]) => userService.updateRestrictions(newRestrictions),
    onSuccess: () => {
      if (user) {
        const updatedUser = { ...user, restrictions }
        updateUser(updatedUser)
        queryClient.setQueryData(['user'], updatedUser)
      }
      setHasChanges(false)
    },
  })

  const handleSave = () => {
    updateMutation.mutate(restrictions)
  }

  const handleRestrictionChange = (newRestrictions: string[]) => {
    setRestrictions(newRestrictions)
    setHasChanges(true)
  }

  const addSuggestedRestriction = (restriction: string) => {
    if (!restrictions.includes(restriction)) {
      handleRestrictionChange([...restrictions, restriction])
    }
  }

  if (isLoading) {
    return <LoadingOverlay message="Loading settings..." />
  }

  return (
    <div className="max-w-4xl w-full mx-auto p-8 md:p-12">
          {/* Page heading */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-extrabold text-text-main-light dark:text-white mb-3">
              Profile & Settings
            </h1>
            <p className="text-text-muted-light dark:text-gray-400 text-base md:text-lg max-w-2xl">
              Manage your account details and personalize your AI meal preferences.
            </p>
          </div>

          {/* Profile card */}
          <Card className="mb-8">
            <h2 className="text-2xl font-bold text-text-main-light dark:text-white mb-1">
              {user?.name || 'User'}
            </h2>
            <p className="text-text-muted-light dark:text-gray-400 mb-4">
              {user?.email}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-green/10 text-accent-green rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-accent-green" />
              Pro Plan Active
            </div>
          </Card>

          {/* Preferences */}
          <Card className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Icon name="tune" />
              </div>
              <h3 className="text-xl font-bold text-text-main-light dark:text-white">
                Preferences
              </h3>
            </div>

            <div className="space-y-6">
              {/* Language (read-only) */}
              <div className="max-w-md">
                <label className="block text-sm font-semibold text-text-main-light dark:text-gray-200 mb-2">
                  Language Preference
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value="English (United States)"
                    disabled
                    className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none text-gray-500 dark:text-gray-400 font-medium cursor-not-allowed"
                  />
                  <Icon
                    name="lock"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size="sm"
                  />
                </div>
                <p className="mt-2 text-xs text-text-muted-light dark:text-gray-500">
                  Language settings are managed by your organization administrator.
                </p>
              </div>

              <hr className="border-border-light dark:border-border-dark" />

              {/* Dietary restrictions */}
              <div>
                <label className="block text-sm font-semibold text-text-main-light dark:text-gray-200 mb-3">
                  Dietary Restrictions
                </label>
                <p className="text-sm text-text-muted-light dark:text-gray-400 mb-4">
                  Add dietary requirements to help our AI curate better recipes for you.
                </p>
                <ChipInput
                  values={restrictions}
                  onChange={handleRestrictionChange}
                  placeholder="Type a restriction and press Enter..."
                  variant="default"
                />
                {/* Suggestions */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-xs text-text-muted-light dark:text-gray-500 py-1">
                    Suggestions:
                  </span>
                  {suggestedRestrictions
                    .filter((r) => !restrictions.includes(r))
                    .map((restriction) => (
                      <button
                        key={restriction}
                        onClick={() => addSuggestedRestriction(restriction)}
                        className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        {restriction}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Action area */}
          <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4 pb-20">
            <Button
              variant="ghost"
              className="w-full sm:w-auto text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              icon="logout"
              iconPosition="left"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              Log Out
            </Button>
            <div className="w-full sm:w-auto flex items-center gap-4">
              {!hasChanges && (
                <span className="text-sm text-accent-green font-medium hidden sm:inline-block">
                  All changes saved automatically
                </span>
              )}
              <Button
                className="w-full sm:w-auto"
                icon="save"
                iconPosition="left"
                onClick={handleSave}
                loading={updateMutation.isPending}
                disabled={!hasChanges}
              >
                Save Changes
              </Button>
          </div>
        </div>
    </div>
  )
}

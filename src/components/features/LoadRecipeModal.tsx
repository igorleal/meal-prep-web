import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from '@tanstack/react-query'
import { Icon, Button, WeeklyLimitBanner } from '@/components/common'
import { recipeService } from '@/api/services'
import type { Recipe, LoadRecipeRequestType } from '@/types'

const MAX_CONTENT_LENGTH = 8000
const MAX_URL_LENGTH = 2048
const URL_REGEX = /^https?:\/\/.+/i

interface LoadRecipeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (recipe: Recipe) => void
  hasReachedWeeklyLimit: boolean
}

export default function LoadRecipeModal({
  isOpen,
  onClose,
  onSuccess,
  hasReachedWeeklyLimit,
}: LoadRecipeModalProps) {
  const { t } = useTranslation('favorites')
  const [activeTab, setActiveTab] = useState<LoadRecipeRequestType>('TEXT')
  const [content, setContent] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const loadMutation = useMutation({
    mutationFn: recipeService.loadRecipe,
    onSuccess: (recipe) => {
      setContent('')
      setUrlInput('')
      setError(null)
      onSuccess(recipe)
    },
    onError: (error: Error & { response?: { status: number; data?: { message?: string } } }) => {
      if (error.response?.status === 429) {
        setError(t('loadRecipe.quotaExceeded'))
      } else if (error.response?.status === 400) {
        setError(t('loadRecipe.urlInvalid'))
      } else if (error.response?.status === 403) {
        setError(t('loadRecipe.urlBlocked'))
      } else if (error.response?.status === 504) {
        setError(t('loadRecipe.urlTimeout'))
      } else if (error.response?.status === 422) {
        setError(activeTab === 'URL' ? t('loadRecipe.urlNoContent') : t('loadRecipe.error'))
      } else if (error.response?.status === 503) {
        setError(t('loadRecipe.urlNotConfigured'))
      } else {
        setError(t('loadRecipe.error'))
      }
    },
  })

  const isValidUrl = (url: string): boolean => {
    return URL_REGEX.test(url.trim()) && url.trim().length <= MAX_URL_LENGTH
  }

  const handleSubmit = () => {
    if (hasReachedWeeklyLimit) return
    setError(null)

    if (activeTab === 'URL') {
      const trimmedUrl = urlInput.trim()
      if (!trimmedUrl || !isValidUrl(trimmedUrl)) {
        setError(t('loadRecipe.urlInvalid'))
        return
      }
      loadMutation.mutate({ type: 'URL', content: trimmedUrl })
    } else {
      if (!content.trim()) return
      loadMutation.mutate({ type: 'TEXT', content: content.trim() })
    }
  }

  const handleClose = () => {
    setContent('')
    setUrlInput('')
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  const isLoading = loadMutation.isPending
  const canSubmit = activeTab === 'URL'
    ? (urlInput.trim().length > 0 && isValidUrl(urlInput) && !hasReachedWeeklyLimit && !isLoading)
    : (content.trim().length > 0 && !hasReachedWeeklyLimit && !isLoading)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-surface-light dark:bg-surface-dark rounded-2xl w-full max-w-lg shadow-xl animate-[zoomIn_0.2s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light dark:border-border-dark">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon name="upload" className="text-primary" />
            </div>
            <h2 className="text-xl font-bold text-text-main-light dark:text-white">
              {t('loadRecipe.title')}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Icon name="close" className="text-text-muted-light dark:text-text-muted-dark" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Weekly Limit Banner */}
          {hasReachedWeeklyLimit && <WeeklyLimitBanner />}

          {/* Tab Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('TEXT')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'TEXT'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-white/5 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              <Icon name="content_paste" className="mr-2 text-base align-middle" />
              {t('loadRecipe.textTab')}
            </button>
            <button
              onClick={() => setActiveTab('URL')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'URL'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-white/5 text-text-muted-light dark:text-text-muted-dark hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              <Icon name="link" className="mr-2 text-base align-middle" />
              {t('loadRecipe.urlTab')}
            </button>
          </div>

          {/* Text Area */}
          {activeTab === 'TEXT' && (
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT_LENGTH))}
                placeholder={t('loadRecipe.textPlaceholder')}
                disabled={isLoading || hasReachedWeeklyLimit}
                className="w-full h-48 p-4 border border-border-light dark:border-border-dark rounded-xl bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder:text-text-muted-light/50 dark:placeholder:text-text-muted-dark/50 resize-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="flex justify-end mt-2">
                <span className={`text-xs ${
                  content.length >= MAX_CONTENT_LENGTH
                    ? 'text-red-500'
                    : 'text-text-muted-light dark:text-text-muted-dark'
                }`}>
                  {t('loadRecipe.characterCount', { count: content.length, max: MAX_CONTENT_LENGTH })}
                </span>
              </div>
            </div>
          )}

          {/* URL Input */}
          {activeTab === 'URL' && (
            <div>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value.slice(0, MAX_URL_LENGTH))}
                placeholder={t('loadRecipe.urlPlaceholder')}
                disabled={isLoading || hasReachedWeeklyLimit}
                className="w-full p-4 border border-border-light dark:border-border-dark rounded-xl bg-background-light dark:bg-background-dark text-text-main-light dark:text-white placeholder:text-text-muted-light/50 dark:placeholder:text-text-muted-dark/50 focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark flex items-center gap-2">
                <Icon name="info" className="text-base" />
                {t('loadRecipe.urlSupportedSites')}
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <Icon name="error" className="text-base" />
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="w-full"
            icon={isLoading ? undefined : 'check'}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Icon name="hourglass_empty" className="animate-spin" />
                {t('loadRecipe.loading')}
              </span>
            ) : (
              t('loadRecipe.loadButton')
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

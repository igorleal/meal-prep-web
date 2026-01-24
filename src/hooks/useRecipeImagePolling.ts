import { useState, useEffect, useRef, useCallback } from 'react'
import { recipeService } from '@/api/services'
import type { Recipe } from '@/types'

interface UseRecipeImagePollingOptions {
  recipe: Recipe
  onImageLoaded?: (updatedRecipe: Recipe) => void
  pollingInterval?: number
  maxPollingTime?: number
  /** If set, only fetch this many times (including initial fetch) instead of continuous polling */
  maxRetries?: number
}

interface UseRecipeImagePollingResult {
  imageUrl: string | undefined
  isPolling: boolean
  hasTimedOut: boolean
}

export function useRecipeImagePolling({
  recipe,
  onImageLoaded,
  pollingInterval = 1000,
  maxPollingTime = 10000,
  maxRetries,
}: UseRecipeImagePollingOptions): UseRecipeImagePollingResult {
  const [imageUrl, setImageUrl] = useState<string | undefined>(recipe.imageUrl)
  const [isPolling, setIsPolling] = useState(!recipe.imageUrl)
  const [hasTimedOut, setHasTimedOut] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const retryCountRef = useRef(0)

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPolling(false)
  }, [])

  useEffect(() => {
    // If recipe already has an imageUrl, no polling needed
    if (recipe.imageUrl) {
      setImageUrl(recipe.imageUrl)
      setIsPolling(false)
      return
    }

    // Start polling
    startTimeRef.current = Date.now()
    retryCountRef.current = 0
    setIsPolling(true)
    setHasTimedOut(false)

    const poll = async () => {
      retryCountRef.current++

      try {
        const updatedRecipe = await recipeService.getRecipe(recipe.id)

        if (updatedRecipe.imageUrl) {
          setImageUrl(updatedRecipe.imageUrl)
          stopPolling()
          onImageLoaded?.(updatedRecipe)
          return
        }

        // Check if we've exceeded max retries (if using retry-based polling)
        if (maxRetries !== undefined && retryCountRef.current >= maxRetries) {
          stopPolling()
          setHasTimedOut(true)
          return
        }

        // Check if we've exceeded max polling time (if using time-based polling)
        if (maxRetries === undefined && startTimeRef.current && Date.now() - startTimeRef.current >= maxPollingTime) {
          stopPolling()
          setHasTimedOut(true)
        }
      } catch (error) {
        // Continue polling on error, don't stop
        console.error('Error polling for recipe image:', error)

        // Check if we've exceeded max retries
        if (maxRetries !== undefined && retryCountRef.current >= maxRetries) {
          stopPolling()
          setHasTimedOut(true)
          return
        }

        // Still check timeout for time-based polling
        if (maxRetries === undefined && startTimeRef.current && Date.now() - startTimeRef.current >= maxPollingTime) {
          stopPolling()
          setHasTimedOut(true)
        }
      }
    }

    // Fetch immediately on mount
    poll()

    // Then set up interval for subsequent fetches
    intervalRef.current = setInterval(poll, pollingInterval)

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [recipe.id, recipe.imageUrl, pollingInterval, maxPollingTime, maxRetries, onImageLoaded, stopPolling])

  return { imageUrl, isPolling, hasTimedOut }
}

import { useState, useEffect, useRef, useCallback } from 'react'
import { recipeService } from '@/api/services'
import type { Recipe } from '@/types'

interface UseRecipeImagePollingOptions {
  recipe: Recipe
  onImageLoaded?: (updatedRecipe: Recipe) => void
  pollingInterval?: number
  maxPollingTime?: number
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
}: UseRecipeImagePollingOptions): UseRecipeImagePollingResult {
  const [imageUrl, setImageUrl] = useState<string | undefined>(recipe.imageUrl)
  const [isPolling, setIsPolling] = useState(!recipe.imageUrl)
  const [hasTimedOut, setHasTimedOut] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

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
    setIsPolling(true)
    setHasTimedOut(false)

    const poll = async () => {
      try {
        const updatedRecipe = await recipeService.getRecipe(recipe.id)

        if (updatedRecipe.imageUrl) {
          setImageUrl(updatedRecipe.imageUrl)
          stopPolling()
          onImageLoaded?.(updatedRecipe)
          return
        }

        // Check if we've exceeded max polling time
        if (startTimeRef.current && Date.now() - startTimeRef.current >= maxPollingTime) {
          stopPolling()
          setHasTimedOut(true)
        }
      } catch (error) {
        // Continue polling on error, don't stop
        console.error('Error polling for recipe image:', error)

        // Still check timeout
        if (startTimeRef.current && Date.now() - startTimeRef.current >= maxPollingTime) {
          stopPolling()
          setHasTimedOut(true)
        }
      }
    }

    intervalRef.current = setInterval(poll, pollingInterval)

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [recipe.id, recipe.imageUrl, pollingInterval, maxPollingTime, onImageLoaded, stopPolling])

  return { imageUrl, isPolling, hasTimedOut }
}

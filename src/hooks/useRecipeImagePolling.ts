import { useState, useEffect, useRef, useCallback } from 'react'
import { recipeService } from '@/api/services'
import type { Recipe } from '@/types'

interface UseRecipeImagePollingOptions {
  recipe: Recipe | null | undefined
  onImageLoaded?: (updatedRecipe: Recipe) => void
}

interface UseRecipeImagePollingResult {
  imageUrl: string | undefined
  isPolling: boolean
  hasTimedOut: boolean
}

// Polling schedule: poll at T5, T10, then every second from T11-T20
const INITIAL_DELAY = 5000 // First poll at 5 seconds
const SECOND_POLL_DELAY = 5000 // Second poll at 10 seconds (5s after first)
const RAPID_POLL_INTERVAL = 1000 // Then every 1 second
const MAX_POLLING_TIME = 20000 // Stop at 20 seconds

export function useRecipeImagePolling({
  recipe,
  onImageLoaded,
}: UseRecipeImagePollingOptions): UseRecipeImagePollingResult {
  const [imageUrl, setImageUrl] = useState<string | undefined>(recipe?.imageUrl)
  const [isPolling, setIsPolling] = useState(!recipe?.imageUrl)
  const [hasTimedOut, setHasTimedOut] = useState(false)
  const startTimeRef = useRef<number | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isStoppedRef = useRef(false)

  const stopPolling = useCallback(() => {
    isStoppedRef.current = true
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setIsPolling(false)
  }, [])

  useEffect(() => {
    // If no recipe, do nothing
    if (!recipe) {
      return
    }

    // If recipe already has an imageUrl, no polling needed
    if (recipe.imageUrl) {
      setImageUrl(recipe.imageUrl)
      setIsPolling(false)
      return
    }

    // Start polling
    const startTime = Date.now()
    startTimeRef.current = startTime
    isStoppedRef.current = false
    setIsPolling(true)
    setHasTimedOut(false)

    const poll = async () => {
      if (isStoppedRef.current) return

      try {
        const updatedRecipe = await recipeService.getRecipe(recipe.id)

        if (updatedRecipe.imageUrl) {
          setImageUrl(updatedRecipe.imageUrl)
          stopPolling()
          onImageLoaded?.(updatedRecipe)
          return
        }
      } catch (error) {
        // Continue polling on error, don't stop
        console.error('Error polling for recipe image:', error)
      }

      // Schedule next poll if not stopped
      if (!isStoppedRef.current) {
        scheduleNextPoll()
      }
    }

    const scheduleNextPoll = () => {
      if (isStoppedRef.current) return

      const elapsed = Date.now() - startTime

      // Check if we've exceeded max polling time
      if (elapsed >= MAX_POLLING_TIME) {
        stopPolling()
        setHasTimedOut(true)
        return
      }

      let nextDelay: number

      if (elapsed < INITIAL_DELAY) {
        // Before T5: wait until T5
        nextDelay = INITIAL_DELAY - elapsed
      } else if (elapsed < INITIAL_DELAY + SECOND_POLL_DELAY) {
        // Between T5 and T10: wait until T10
        nextDelay = INITIAL_DELAY + SECOND_POLL_DELAY - elapsed
      } else {
        // After T10: poll every second
        nextDelay = RAPID_POLL_INTERVAL
      }

      timeoutRef.current = setTimeout(poll, nextDelay)
    }

    // Schedule the first poll at T5
    timeoutRef.current = setTimeout(poll, INITIAL_DELAY)

    // Cleanup
    return () => {
      isStoppedRef.current = true
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [recipe?.id, recipe?.imageUrl, onImageLoaded, stopPolling])

  return { imageUrl, isPolling, hasTimedOut }
}

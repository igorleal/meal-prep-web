import { Icon } from '@/components/common'

export function LoadingRecipeCard() {
  return (
    <article className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-primary/20 bg-primary/[0.02] p-8 text-center transition-all min-h-[500px]">
      <div className="flex flex-col items-center justify-center gap-6">
        {/* Spinning loader */}
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
          <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin" />
          <Icon name="skillet" className="text-4xl text-primary" />
        </div>

        {/* Loading text */}
        <div className="space-y-3 px-6">
          <h3 className="text-2xl font-black text-text-main-light dark:text-white">
            Chef AI is cooking...
          </h3>
          <p className="text-text-muted-light dark:text-text-muted-dark">
            Generating recipes based on your unique nutritional goals and taste profile.
          </p>
        </div>

        {/* Bouncing dots */}
        <div className="mt-4 flex gap-2">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </article>
  )
}

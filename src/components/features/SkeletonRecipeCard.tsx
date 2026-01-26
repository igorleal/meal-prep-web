export function SkeletonRecipeCard() {
  return (
    <div className="flex flex-col rounded-2xl bg-surface-light dark:bg-[#2A221C] border border-gray-200 dark:border-[#3E342B] overflow-hidden relative shadow-lg">
      {/* Left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary/30 z-10" />

      {/* Image skeleton with shimmer */}
      <div className="relative h-48 md:h-56 w-full bg-gray-200 dark:bg-[#1E1915] overflow-hidden">
        <div className="shimmer absolute inset-0" />
      </div>

      {/* Content skeleton */}
      <div className="p-5 md:p-6 flex flex-col gap-4 flex-1">
        {/* Title and rating */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-[#393028] rounded shimmer" />
            <div className="h-4 w-10 bg-gray-200 dark:bg-[#393028] rounded shimmer" />
          </div>
          {/* Description lines */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 dark:bg-[#393028] rounded shimmer" />
            <div className="h-3 w-5/6 bg-gray-200 dark:bg-[#393028] rounded shimmer" />
            <div className="h-3 w-4/6 bg-gray-200 dark:bg-[#393028] rounded shimmer" />
          </div>
        </div>

        {/* Tags skeleton */}
        <div className="flex flex-wrap gap-2">
          <div className="h-6 w-20 bg-gray-200 dark:bg-[#393028] rounded-md shimmer" />
          <div className="h-6 w-16 bg-gray-200 dark:bg-[#393028] rounded-md shimmer" />
        </div>

        {/* Macros grid skeleton */}
        <div className="grid grid-cols-4 gap-2 bg-gray-100 dark:bg-[#1E1915] p-3 rounded-xl border border-gray-200 dark:border-[#3E342B] mt-auto">
          <div className="flex flex-col items-center gap-1">
            <div className="h-2 w-6 bg-gray-200 dark:bg-[#393028] rounded shimmer" />
            <div className="h-4 w-8 bg-gray-200 dark:bg-[#393028] rounded shimmer" />
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-gray-200 dark:border-[#3E342B]">
            <div className="h-2 w-6 bg-gray-200 dark:bg-[#393028] rounded shimmer" />
            <div className="h-4 w-8 bg-gray-200 dark:bg-[#393028] rounded shimmer" />
          </div>
          <div className="flex flex-col items-center gap-1 border-r border-gray-200 dark:border-[#3E342B]">
            <div className="h-2 w-6 bg-gray-200 dark:bg-[#393028] rounded shimmer" />
            <div className="h-4 w-8 bg-gray-200 dark:bg-[#393028] rounded shimmer" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-2 w-6 bg-gray-200 dark:bg-[#393028] rounded shimmer" />
            <div className="h-4 w-8 bg-gray-200 dark:bg-[#393028] rounded shimmer" />
          </div>
        </div>

        {/* Button skeleton */}
        <div className="h-10 w-full bg-gray-200 dark:bg-[#393028] rounded-lg shimmer" />
      </div>
    </div>
  )
}

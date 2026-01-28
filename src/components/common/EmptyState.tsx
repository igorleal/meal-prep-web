import { Icon } from './Icon'

interface EmptyStateProps {
  imageUrl: string
  title: string
  description: string
  buttonText: string
  buttonIcon?: string
  onButtonClick: () => void
}

export function EmptyState({
  imageUrl,
  title,
  description,
  buttonText,
  buttonIcon = 'add_circle',
  onButtonClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-[#e6e0db] dark:border-[#393028] bg-white/50 dark:bg-[#181411]/50 p-8 md:p-12 text-center min-h-[500px]">
      <div className="max-w-md flex flex-col items-center gap-8">
        {/* Illustration Area */}
        <div className="relative w-full aspect-[4/3] max-w-[320px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#2a2018] to-[#181411] ring-1 ring-white/10 group">
          {/* Background Pattern/Effect */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          {/* Main Illustration Image */}
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-contain m-8 transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url("${imageUrl}")` }}
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Text Content */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-[#181411] dark:text-white">
            {title}
          </h2>
          <p className="text-[#5e544c] dark:text-[#9c8e80] text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* CTA Button with shimmer effect */}
        <button
          onClick={onButtonClick}
          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-8 py-3.5 text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40 active:scale-95"
        >
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:animate-shimmer" />
          <Icon name={buttonIcon} className="text-[20px]" />
          <span className="text-sm font-bold tracking-wide">{buttonText}</span>
        </button>
      </div>
    </div>
  )
}

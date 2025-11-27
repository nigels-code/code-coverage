interface CoverageBarProps {
  percentage: number
  size?: 'sm' | 'md'
}

function getCoverageColor(pct: number): string {
  if (pct >= 80) return 'bg-green-500'
  if (pct >= 50) return 'bg-amber-500'
  return 'bg-red-500'
}

export function CoverageBar({ percentage, size = 'md' }: CoverageBarProps) {
  const height = size === 'sm' ? 'h-1.5' : 'h-2'

  return (
    <div className={`${height} w-full rounded-full bg-gray-200 overflow-hidden`}>
      <div
        className={`${height} rounded-full transition-all duration-300 ${getCoverageColor(percentage)}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export function getCoverageTextColor(pct: number): string {
  if (pct >= 80) return 'text-green-600'
  if (pct >= 50) return 'text-amber-600'
  return 'text-red-600'
}

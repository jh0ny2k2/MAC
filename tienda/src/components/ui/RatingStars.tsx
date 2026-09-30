import { Star } from 'lucide-react'
import { cx } from '../../utils/format'

interface RatingStarsProps {
  rating: number
  reviews?: number
  showCount?: boolean
  className?: string
}

export default function RatingStars({ rating, reviews, showCount = false, className }: RatingStarsProps) {
  const rounded = Math.round(rating)

  return (
    <div className={cx('flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={13}
            className={i <= rounded ? 'fill-amber-400 text-amber-400' : 'text-carbon-600'}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-carbon-200">{rating.toFixed(1)}</span>
      {showCount && reviews !== undefined && (
        <span className="text-xs text-carbon-500">({reviews} valoraciones)</span>
      )}
    </div>
  )
}
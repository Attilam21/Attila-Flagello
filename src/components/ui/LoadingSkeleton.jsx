import { cn } from '../../utils/cn'

const LoadingSkeleton = ({ className, ...props }) => (
  <div
    className={cn('animate-pulse rounded-xl bg-surface', className)}
    {...props}
  />
)

const LoadingSkeletonBlock = ({ className, ...props }) => (
  <LoadingSkeleton className={cn('h-4 w-full', className)} {...props} />
)

const LoadingSkeletonCard = ({ className, ...props }) => (
  <div className={cn('space-y-3', className)} {...props}>
    <LoadingSkeleton className="h-4 w-3/4" />
    <LoadingSkeleton className="h-4 w-1/2" />
    <LoadingSkeleton className="h-4 w-5/6" />
  </div>
)

export { LoadingSkeleton, LoadingSkeletonBlock, LoadingSkeletonCard }

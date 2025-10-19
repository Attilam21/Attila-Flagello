import { cn } from '../../utils/cn'

const Input = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-xl border border-surface bg-surface px-3 py-2 text-sm text-white placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export default Input

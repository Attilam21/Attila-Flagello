import { cn } from '../../utils/cn'

const Badge = ({ 
  variant = 'neutral', 
  className, 
  children, 
  ...props 
}) => {
  const variants = {
    neutral: 'bg-surface text-muted border-surface',
    success: 'bg-success/10 text-success border-success/20',
    warn: 'bg-warn/10 text-warn border-warn/20',
    error: 'bg-error/10 text-error border-error/20'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-xl border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export default Badge

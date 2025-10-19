import { cn } from '../../utils/cn'

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-primary-fg hover:bg-primary/90',
    ghost: 'bg-transparent text-muted hover:bg-surface hover:text-white',
    destructive: 'bg-error text-white hover:bg-error/90'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

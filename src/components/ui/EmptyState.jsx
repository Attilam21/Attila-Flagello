import { cn } from '../../utils/cn'

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className,
  ...props 
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className
      )}
      {...props}
    >
      {Icon && (
        <div className="mb-4 rounded-full bg-surface p-3">
          <Icon className="h-6 w-6 text-muted" />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-muted">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}

export default EmptyState

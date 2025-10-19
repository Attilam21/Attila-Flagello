import { cn } from '../../utils/cn'

const Card = ({ className, ...props }) => (
  <div
    className={cn(
      'rounded-2xl border border-gray-800 bg-gray-900 shadow-soft',
      className
    )}
    {...props}
  />
)

const CardHeader = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
)

const CardContent = ({ className, ...props }) => (
  <div className={cn('p-6 pt-0', className)} {...props} />
)

const CardFooter = ({ className, ...props }) => (
  <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
)

export { Card, CardHeader, CardContent, CardFooter }

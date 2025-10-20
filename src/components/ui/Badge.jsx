import { cn } from '../../utils/cn';

const Badge = ({ variant = 'neutral', className, children, ...props }) => {
  const variants = {
    neutral: 'bg-gray-800 text-gray-400 border-gray-700',
    success: 'bg-green-900/20 text-green-400 border-green-800/20',
    warn: 'bg-yellow-900/20 text-yellow-400 border-yellow-800/20',
    error: 'bg-red-900/20 text-red-400 border-red-800/20',
  };

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
  );
};

export default Badge;

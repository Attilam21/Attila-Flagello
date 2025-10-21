import { cn } from '../../utils/cn';

const Badge = ({ variant = 'neutral', className, children, ...props }) => {
  const variants = {
    neutral: 'bg-white/10 text-white border-white/20',
    secondary: 'bg-white/10 text-white border-white/20',
    primary: 'bg-emerald-500 text-[#0b1223] border-emerald-500 font-semibold',
    success: 'bg-green-500 text-white border-green-500',
    warning: 'bg-yellow-500 text-[#0b1223] border-yellow-500 font-semibold',
    danger: 'bg-red-500 text-white border-red-500 font-semibold',
    warn: 'bg-yellow-500 text-[#0b1223] border-yellow-500 font-semibold',
    error: 'bg-red-500 text-white border-red-500 font-semibold',
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

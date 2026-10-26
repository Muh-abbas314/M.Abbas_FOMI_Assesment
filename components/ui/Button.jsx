import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

const VARIANTS = {
  primary: 'bg-accent-ink text-white hover:bg-[#9E5034] disabled:bg-accent disabled:text-white/90',
  secondary: 'border border-line bg-surface text-ink hover:border-ink/20 disabled:text-ink-subtle',
  ghost: 'text-ink-muted hover:bg-panel-strong hover:text-ink disabled:text-ink-subtle',
  studio: 'bg-studio-accent text-studio-on-accent hover:bg-[#EDB09B] disabled:opacity-50',
  'studio-ghost': 'text-studio-ink-muted hover:bg-studio-raised hover:text-studio-ink disabled:opacity-50',
};

const SIZES = {
  sm: 'h-8 gap-1.5 px-3 text-[12px]',
  md: 'h-10 gap-2 px-4 text-[13px]',
};

/** Pill button. Press feedback is a quick scale-down; disabled buttons ignore it. */
const Button = forwardRef(function Button({ variant = 'secondary', size = 'md', className, type = 'button', ...props }, ref) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-medium transition-[background-color,color,border-color,transform] duration-150 ease-out active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    />
  );
});

export default Button;

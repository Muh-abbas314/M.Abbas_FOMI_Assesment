import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * A native <select> styled as a pill. Native gives keyboard support and the phone's own picker for free.
 * Option values keep their type (numbers stay numbers).
 */
export default function Select({ label, value, options, onChange, tone = 'light', className }) {
  return (
    <span className={cn('relative inline-flex', className)}>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => {
          const option = options.find((o) => String(o.value) === event.target.value);
          onChange(option ? option.value : event.target.value);
        }}
        className={cn(
          'h-8 w-full cursor-pointer appearance-none rounded-full border pl-3 pr-8 text-[12px] transition-colors duration-150',
          tone === 'studio'
            ? 'border-studio-line bg-studio-bg text-studio-ink hover:border-studio-ink-muted/50'
            : 'border-line bg-surface text-ink hover:border-ink/20',
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden
        size={14}
        strokeWidth={1.75}
        className={cn('pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2', tone === 'studio' ? 'text-studio-ink-muted' : 'text-ink-muted')}
      />
    </span>
  );
}

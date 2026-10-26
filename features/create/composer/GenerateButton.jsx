import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/cn';

/**
 * The mockup's peach (#E49C84) is the disabled look; once there's a prompt the button turns
 * a deeper terracotta so white text passes contrast (4.6:1).
 */
export default function GenerateButton({ disabled, busy = false, label = 'Generate', iconOnly = false }) {
  // iconOnly: true (always) | 'mobile' (icon below md, labelled from md up) | false
  const responsive = iconOnly === 'mobile';
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-busy={busy || undefined}
      aria-label={iconOnly ? label : undefined}
      className={cn(
        'inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full bg-accent-ink text-[13px] font-medium text-white transition-[background-color,transform] duration-150 ease-out hover:bg-accent-deep active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:bg-accent disabled:text-white/90 disabled:active:scale-100',
        iconOnly === true && 'w-9',
        !iconOnly && 'px-4',
        responsive && 'w-9 md:w-auto md:px-4',
      )}
    >
      <Sparkles aria-hidden size={15} strokeWidth={1.75} className={busy ? 'animate-pulse' : undefined} />
      {!iconOnly && label}
      {responsive && <span className="hidden md:inline">{label}</span>}
    </button>
  );
}

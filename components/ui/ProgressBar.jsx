import { cn } from '@/lib/cn';

/** Determinate progress. The width eases between polls, so 700ms steps read as smooth motion. */
export default function ProgressBar({ value, label, tone = 'light', className }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      className={cn('h-1 w-full overflow-hidden rounded-full', tone === 'studio' ? 'bg-studio-line' : 'bg-panel-strong', className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-700 ease-linear', tone === 'studio' ? 'bg-studio-accent' : 'bg-accent-strong')}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

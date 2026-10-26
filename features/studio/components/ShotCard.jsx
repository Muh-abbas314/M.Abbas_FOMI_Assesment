import Image from 'next/image';
import { formatDuration } from '@/lib/format';
import { isActiveStatus } from '@/lib/job-status';
import { cn } from '@/lib/cn';

/** Cards are as wide as their shot is long, so the board shows the film's pacing at a glance. */
export const shotCardWidth = (durationSec) => 56 + durationSec * 28;

export default function ShotCard({ shot, number, selected, onSelect }) {
  const keeper = shot.takes.find((t) => t.id === shot.chosenTakeId && t.status === 'done');
  const running = [...shot.takes].reverse().find((t) => isActiveStatus(t.status));
  const takeCount = shot.takes.length;
  const label = `Shot ${number}: ${shot.title}, ${formatDuration(shot.durationSec)}, ${takeCount} ${takeCount === 1 ? 'take' : 'takes'}`;

  return (
    <button
      type="button"
      aria-label={label}
      aria-current={selected}
      onClick={() => onSelect(shot.id)}
      style={{ width: shotCardWidth(shot.durationSec) }}
      className={cn(
        'group flex shrink-0 snap-start flex-col overflow-hidden rounded-card border bg-studio-raised text-left transition-[border-color,transform,width] duration-200 ease-[var(--ease-out-soft)] active:scale-[0.98]',
        selected ? 'border-studio-accent shadow-[0_0_0_1px_var(--color-studio-accent)]' : 'border-studio-line hover:border-studio-ink-muted/50',
      )}
    >
      <span className="relative block h-[92px] w-full overflow-hidden bg-studio-surface 2xl:h-[112px]">
        {keeper ? (
          <Image
            src={keeper.media.poster}
            alt=""
            fill
            sizes="280px"
            className="object-cover opacity-90 transition-[opacity,transform] duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center bg-[repeating-linear-gradient(135deg,var(--color-studio-raised)_0_10px,var(--color-studio-surface)_10px_20px)] text-[11px] text-studio-ink-muted">
            No take
          </span>
        )}
        {running && (
          <span className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] tabular-nums text-white">
            <span className="size-1.5 animate-pulse rounded-full bg-studio-accent" />
            {Math.round(running.progress * 100)}%
          </span>
        )}
        {takeCount > 1 && (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] text-white">{`${takeCount} takes`}</span>
        )}
      </span>
      <span className="flex items-center justify-between gap-2 px-2.5 py-1.5 text-[11px]">
        <span className="min-w-0 truncate">
          <span className="font-semibold text-studio-accent">{number}</span>
          <span className="ml-1.5 text-studio-ink">{shot.title}</span>
        </span>
        <span className="shrink-0 tabular-nums text-studio-ink-muted">{formatDuration(shot.durationSec)}</span>
      </span>
    </button>
  );
}

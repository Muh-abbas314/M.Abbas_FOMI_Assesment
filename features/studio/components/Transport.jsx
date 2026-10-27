import { Pause, Play } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatDuration } from '@/lib/format';
import { locate, totalDuration } from '../playback/timeline';

/**
 * Board playback controls. The progress bar is split into one segment per shot, sized by length
 * (like the board cards), so you see where you are in the film, not just a percentage.
 */
export default function Transport({ timeline, t, playing, rate, onToggle, onSeek }) {
  const total = totalDuration(timeline);
  const { index } = locate(timeline, t);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onToggle}
        aria-label={playing ? 'Pause' : 'Play the board'}
        className="grid size-10 shrink-0 place-items-center rounded-full bg-studio-accent text-studio-on-accent transition-[background-color,transform] duration-150 hover:bg-[#EDB09B] active:scale-95"
      >
        {playing ? <Pause aria-hidden size={18} fill="currentColor" strokeWidth={0} /> : <Play aria-hidden size={18} fill="currentColor" strokeWidth={0} />}
      </button>

      <ol aria-label="Board timeline" className="flex h-8 min-w-0 flex-1 gap-0.5">
        {timeline.map((segment, i) => {
          const fill = Math.min(1, Math.max(0, (t - segment.start) / segment.durationSec));
          const current = i === index;
          return (
            <li key={segment.shotId} style={{ flexGrow: segment.durationSec, flexBasis: 0 }} className="min-w-0">
              <button
                type="button"
                aria-label={`Jump to shot ${segment.number}`}
                aria-current={current}
                onClick={() => onSeek(segment.start)}
                className={cn(
                  'relative block h-full w-full overflow-hidden rounded-md text-left transition-colors',
                  segment.media ? 'bg-studio-raised' : 'bg-[repeating-linear-gradient(135deg,var(--color-studio-raised)_0_6px,var(--color-studio-surface)_6px_12px)]',
                  current && 'shadow-[inset_0_0_0_1px_var(--color-studio-accent)]',
                )}
              >
                <span className="absolute inset-y-0 left-0 bg-studio-accent/35" style={{ width: `${fill * 100}%` }} />
                <span className="relative truncate px-1.5 text-[10px] leading-8 text-studio-ink-muted">{segment.number}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <span className="shrink-0 text-[12px] tabular-nums text-studio-ink-muted">{`${formatDuration(t)} / ${formatDuration(total)}`}</span>
      {rate > 1 && <span className="shrink-0 rounded-full bg-studio-raised px-2 py-0.5 text-[11px] font-medium tabular-nums">{`${rate}×`}</span>}
    </div>
  );
}

import CompareView from './CompareView';
import ShotView from './ShotView';

/** The monitor: the selected shot, or two of its takes side by side. */
export default function Stage({ mode = 'shot', shot, number, playing, onTogglePlay, onKeep, onCloseCompare, header, footer }) {
  return (
    <section aria-label="Stage" className="flex min-h-0 flex-col gap-3 p-3 sm:p-4 lg:p-5">
      {header}
      {mode === 'compare' && shot ? (
        <div className="min-h-0 flex-1">
          <CompareView shot={shot} onKeep={onKeep} onClose={onCloseCompare} />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="relative aspect-video max-h-full w-full overflow-hidden rounded-card bg-black shadow-[0_0_0_1px_var(--color-studio-line)] lg:h-full lg:w-auto lg:max-w-full">
            {shot ? <ShotView shot={shot} number={number} playing={playing} onTogglePlay={onTogglePlay} /> : null}
          </div>
        </div>
      )}
      {footer}
    </section>
  );
}

import { Clapperboard, Film } from 'lucide-react';
import Segmented from '@/components/ui/Segmented';
import BoardView from './BoardView';
import CompareView from './CompareView';
import ShotView from './ShotView';
import Transport from './Transport';

const VIEW_OPTIONS = [
  { value: 'shot', label: 'Shot', icon: Clapperboard },
  { value: 'board', label: 'Board', icon: Film },
];

/**
 * The monitor. "Shot" loops the selected shot's keeper; "Board" plays the whole film as an
 * instant animatic; compare puts two takes side by side.
 */
export default function Stage({ mode = 'shot', onModeChange, shot, number, playing, onTogglePlay, onKeep, onCloseCompare, playback, timeline }) {
  const segment = timeline?.[playback?.index ?? 0];
  const previous = playback && playback.index > 0 ? timeline[playback.index - 1] : null;

  return (
    <section aria-label="Stage" className="flex min-h-0 flex-col gap-3 p-3 sm:p-4 lg:p-5">
      {mode !== 'compare' && onModeChange && (
        <div className="flex items-center justify-between gap-3">
          <Segmented label="Stage view" options={VIEW_OPTIONS} value={mode} onChange={onModeChange} tone="studio" size="sm" />
          {mode === 'board' && <p className="hidden text-[12px] text-studio-ink-muted sm:block">Every keeper, back to back. Shots without a take show as slates.</p>}
        </div>
      )}

      {mode === 'compare' && shot ? (
        <div className="min-h-0 flex-1">
          <CompareView shot={shot} onKeep={onKeep} onClose={onCloseCompare} />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="relative aspect-video max-h-full w-full overflow-hidden rounded-card bg-black shadow-[0_0_0_1px_var(--color-studio-line)] lg:h-full lg:w-auto lg:max-w-full">
            {mode === 'board' && segment ? (
              <BoardView
                segment={segment}
                offset={playback.offset}
                playing={playback.playing}
                rate={playback.rate}
                seekId={playback.seekId}
                previousTransition={previous?.transition}
              />
            ) : shot ? (
              <ShotView shot={shot} number={number} playing={playing} onTogglePlay={onTogglePlay} />
            ) : null}
          </div>
        </div>
      )}

      {mode === 'board' && playback && (
        <Transport timeline={timeline} t={playback.t} playing={playback.playing} rate={playback.rate} onToggle={playback.toggle} onSeek={playback.seek} />
      )}
    </section>
  );
}

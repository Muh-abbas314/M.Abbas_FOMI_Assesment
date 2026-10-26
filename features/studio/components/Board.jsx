import { Fragment } from 'react';
import { Blend, Contrast, Plus, Scissors } from 'lucide-react';
import { formatDuration } from '@/lib/format';
import { totalSeconds } from '../cost';
import ShotCard from './ShotCard';

const TRANSITION_GLYPHS = {
  cut: { icon: Scissors, verb: 'cuts to' },
  dissolve: { icon: Blend, verb: 'dissolves into' },
  fade: { icon: Contrast, verb: 'fades through black into' },
};

/** The storyboard: shots in order, with how each one hands over to the next. */
export default function Board({ shots, selectedShotId, onSelect, onAdd }) {
  return (
    <section aria-label="Board" className="flex min-h-0 flex-col gap-2 border-t border-studio-line bg-studio-surface px-3 pb-3 pt-2.5 sm:px-4">
      <header className="flex items-baseline gap-2 text-[12px]">
        <h2 className="font-semibold">Board</h2>
        <p className="tabular-nums text-studio-ink-muted">{`${shots.length} shots · ${formatDuration(totalSeconds(shots))}`}</p>
      </header>
      <ol aria-label="Shots" className="flex snap-x items-center gap-1.5 overflow-x-auto pb-1">
        {shots.map((shot, index) => {
          const next = shots[index + 1];
          const glyph = TRANSITION_GLYPHS[shot.transition] ?? TRANSITION_GLYPHS.cut;
          const Icon = glyph.icon;
          return (
            <Fragment key={shot.id}>
              <li className="shrink-0">
                <ShotCard shot={shot} number={index + 1} selected={shot.id === selectedShotId} onSelect={onSelect} />
              </li>
              {next && (
                <li aria-label={`Shot ${index + 1} ${glyph.verb} shot ${index + 2}`} className="grid size-6 shrink-0 place-items-center rounded-full border border-studio-line text-studio-ink-muted">
                  <Icon aria-hidden size={12} strokeWidth={1.75} />
                </li>
              )}
            </Fragment>
          );
        })}
        <li className="shrink-0 pl-1.5">
          <button
            type="button"
            onClick={onAdd}
            className="grid h-[118px] w-24 place-items-center rounded-card border border-dashed border-studio-line text-[12px] text-studio-ink-muted transition-[border-color,color,transform] duration-150 hover:border-studio-ink-muted/60 hover:text-studio-ink active:scale-[0.98] 2xl:h-[138px]"
          >
            <span className="flex flex-col items-center gap-1">
              <Plus aria-hidden size={18} strokeWidth={1.75} />
              Add shot
            </span>
          </button>
        </li>
      </ol>
    </section>
  );
}

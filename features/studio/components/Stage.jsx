import ShotView from './ShotView';

/** The monitor. A 16:9 frame that fits whatever space the layout gives it. */
export default function Stage({ shot, number, playing, onTogglePlay, header, footer }) {
  return (
    <section aria-label="Stage" className="flex min-h-0 flex-col gap-3 p-3 sm:p-4 lg:p-5">
      {header}
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <div className="relative aspect-video max-h-full w-full overflow-hidden rounded-card bg-black shadow-[0_0_0_1px_var(--color-studio-line)] lg:w-auto lg:max-w-full lg:h-full">
          {shot ? <ShotView shot={shot} number={number} playing={playing} onTogglePlay={onTogglePlay} /> : null}
        </div>
      </div>
      {footer}
    </section>
  );
}

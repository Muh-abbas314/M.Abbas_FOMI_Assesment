'use client';

import { useEffect, useRef } from 'react';
import { Pause, Play } from 'lucide-react';
import Slate from './Slate';

/** Plays the selected shot's keeper on a loop, letterboxed like a monitor. */
export default function ShotView({ shot, number, playing, onTogglePlay }) {
  const videoRef = useRef(null);
  const keeper = shot.takes.find((t) => t.id === shot.chosenTakeId && t.status === 'done');
  const keeperNumber = keeper ? shot.takes.indexOf(keeper) + 1 : 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [playing, keeper?.id]);

  return (
    <>
      {keeper ? (
        <video
          key={keeper.id}
          ref={videoRef}
          src={keeper.media.src}
          poster={keeper.media.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={keeper.media.alt}
          className="absolute inset-0 size-full object-contain"
        />
      ) : (
        <Slate number={number} title={shot.title} />
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-black/60 to-transparent p-3">
        <p className="text-[12px] font-medium text-white">{`Shot ${number} · ${shot.title}`}</p>
        {keeper && <p className="text-[11px] text-white/70">{`Take ${keeperNumber} of ${shot.takes.length}`}</p>}
      </div>

      {keeper && (
        <button
          type="button"
          onClick={onTogglePlay}
          aria-label={playing ? 'Pause shot' : 'Play shot'}
          className="absolute bottom-3 left-3 grid size-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-[background-color,transform] duration-150 hover:bg-black/75 active:scale-95"
        >
          {playing ? <Pause aria-hidden size={18} fill="currentColor" strokeWidth={0} /> : <Play aria-hidden size={18} fill="currentColor" strokeWidth={0} />}
        </button>
      )}
    </>
  );
}

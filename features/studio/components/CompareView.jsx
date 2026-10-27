'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import Select from '@/components/ui/Select';
import { formatDuration } from '@/lib/format';
import { driftCorrect, syncVideos } from '../compare/sync';

function CompareSide({ label, entry, options, isKeeper, videoRef, onPick, onKeep, onTimeUpdate, onEnded }) {
  return (
    <figure className="flex min-h-0 min-w-0 flex-col gap-2">
      <figcaption className="flex items-center justify-between gap-2">
        <span className="text-[12px] font-semibold">{label}</span>
        <Select tone="studio" label={`Take for ${label}`} value={entry.take.id} options={options} onChange={onPick} />
      </figcaption>
      <div className="relative min-h-[120px] flex-1 overflow-hidden rounded-tile bg-black">
        <video
          key={entry.take.id}
          ref={videoRef}
          src={entry.take.media.src}
          poster={entry.take.media.poster}
          muted
          playsInline
          preload="auto"
          aria-label={`${label}: Take ${entry.number}`}
          onTimeUpdate={onTimeUpdate}
          onEnded={onEnded}
          className="absolute inset-0 size-full object-contain"
        />
      </div>
      <Button variant={isKeeper ? 'studio-ghost' : 'studio'} size="sm" onClick={() => onKeep(entry.take.id)}>
        {`Keep ${label}`}
      </Button>
    </figure>
  );
}

/**
 * Two takes side by side under one scrubber and one play button, so you judge the same moment
 * in both. B follows A; drift beyond ~2 frames is snapped back.
 */
export default function CompareView({ shot, onKeep, onClose }) {
  const done = shot.takes.map((take, index) => ({ take, number: index + 1 })).filter(({ take }) => take.status === 'done');
  const keeper = done.find(({ take }) => take.id === shot.chosenTakeId) ?? done[0];
  const other = [...done].reverse().find(({ take }) => take.id !== keeper?.take.id) ?? keeper;

  const [aId, setAId] = useState(keeper?.take.id);
  const [bId, setBId] = useState(other?.take.id);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const aRef = useRef(null);
  const bRef = useRef(null);

  const a = done.find(({ take }) => take.id === aId) ?? keeper;
  const b = done.find(({ take }) => take.id === bId) ?? other;
  const max = Math.min(a.take.media.durationSec, b.take.media.durationSec);
  const options = done.map(({ take, number }) => ({ value: take.id, label: `Take ${number}` }));

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    for (const video of [aRef.current, bRef.current]) {
      if (!video) continue;
      if (playing) video.play().catch(() => setPlaying(false));
      else video.pause();
    }
  }, [playing, aId, bId]);

  function scrub(value) {
    setT(value);
    syncVideos([aRef.current, bRef.current], value);
  }

  function followA(event) {
    setT(event.currentTarget.currentTime);
    driftCorrect(event.currentTarget, bRef.current);
  }

  const shared = { options, onKeep, onEnded: () => setPlaying(false) };

  return (
    <div className="flex size-full flex-col gap-3 rounded-card bg-studio-surface p-3 sm:p-4">
      <header className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold">{`Compare takes · ${shot.title}`}</h2>
        <IconButton icon={X} label="Close compare" tone="studio" size={32} tooltip={false} onClick={onClose} />
      </header>
      <div className="grid min-h-0 flex-1 auto-rows-[minmax(0,1fr)] grid-cols-1 gap-3 sm:grid-cols-2">
        <CompareSide label="A" entry={a} isKeeper={a.take.id === shot.chosenTakeId} videoRef={aRef} onPick={setAId} onTimeUpdate={followA} {...shared} />
        <CompareSide label="B" entry={b} isKeeper={b.take.id === shot.chosenTakeId} videoRef={bRef} onPick={setBId} {...shared} />
      </div>
      <div className="flex items-center gap-3">
        <IconButton icon={playing ? Pause : Play} label={playing ? 'Pause both' : 'Play both'} tone="studio" size={36} tooltip={false} onClick={() => setPlaying((p) => !p)} />
        <input
          type="range"
          aria-label="Scrub both takes"
          min={0}
          max={max}
          step={0.05}
          value={Math.min(t, max)}
          onChange={(event) => scrub(Number(event.target.value))}
          className="h-1 flex-1 cursor-pointer accent-[var(--color-studio-accent)]"
        />
        <span className="w-20 text-right text-[12px] tabular-nums text-studio-ink-muted">{`${formatDuration(t)} / ${formatDuration(max)}`}</span>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/cn';
import Slate from './Slate';
import styles from './studio.module.css';

const ENTRY_CLASS = { dissolve: styles.enterDissolve, fade: styles.enterFade };

/**
 * One frame of the animatic: the current shot's keeper (looping if the clip is shorter than the
 * shot, cut off if longer), or a slate when the shot has no take yet.
 */
export default function BoardView({ segment, offset, playing, rate, seekId, previousTransition }) {
  const videoRef = useRef(null);
  const offsetRef = useRef(offset);

  useEffect(() => {
    offsetRef.current = offset;
  });

  // Jump the clip to the playhead when the shot changes or the user seeks.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const duration = video.duration;
    video.currentTime = duration ? offsetRef.current % duration : offsetRef.current;
  }, [segment.shotId, seekId]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.playbackRate = rate;
  }, [rate, segment.shotId]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) video.play().catch(() => {});
    else video.pause();
  }, [playing, segment.shotId]);

  return (
    <div key={segment.shotId} className={cn('absolute inset-0', ENTRY_CLASS[previousTransition])}>
      {segment.media ? (
        <video
          ref={videoRef}
          src={segment.media.src}
          poster={segment.media.poster}
          muted
          loop
          playsInline
          preload="auto"
          aria-label={segment.media.alt}
          className="absolute inset-0 size-full object-contain"
        />
      ) : (
        <Slate number={segment.number} title={segment.title} durationSec={segment.durationSec} message="No take yet" />
      )}
      {segment.media && (
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 to-transparent p-3">
          <p className="text-[12px] font-medium text-white">{`Shot ${segment.number} · ${segment.title}`}</p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Maximize2, Play } from 'lucide-react';
import { cssAspectRatio } from '@/lib/aspect';
import { cn } from '@/lib/cn';
import { formatDuration } from '@/lib/format';
import { useInView } from '@/lib/hooks/use-in-view';
import { useMediaQuery } from '@/lib/hooks/use-media-query';
import styles from './VideoTile.module.css';

/**
 * A video result. Only the poster loads up front; the <video> element is mounted when the tile
 * nears the viewport and fetches nothing until it plays (preload="none").
 * Pointer devices: hover or focus previews, click opens. Touch devices: tap previews, the corner button opens.
 */
export default function VideoTile({ media, aspectRatio, sizes, onOpen, label, className, style }) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const inView = useInView(containerRef);
  const touch = useMediaQuery('(hover: none)');

  function play() {
    const video = videoRef.current;
    if (!video) return;
    video.play().then(
      () => setPlaying(true),
      () => setPlaying(false), // Autoplay blocked: the poster simply stays.
    );
  }

  function stop() {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setPlaying(false);
  }

  return (
    <div
      ref={containerRef}
      data-tile
      onMouseEnter={touch ? undefined : play}
      onMouseLeave={touch ? undefined : stop}
      onFocus={play}
      onBlur={stop}
      onClick={touch ? () => (playing ? stop() : play()) : undefined}
      style={{ aspectRatio: cssAspectRatio(aspectRatio), ...style }}
      className={cn('group relative overflow-hidden rounded-tile bg-panel-strong', className)}
    >
      <Image src={media.poster} alt={media.alt} fill sizes={sizes} className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]" />
      {inView && (
        <video
          ref={videoRef}
          src={media.src}
          poster={media.poster}
          preload="none"
          muted
          loop
          playsInline
          aria-hidden
          data-playing={playing}
          className={cn('absolute inset-0 size-full object-cover', styles.video)}
        />
      )}

      {!touch && <button type="button" aria-label={label} onClick={onOpen} className="absolute inset-0 rounded-tile" />}

      <span className="pointer-events-none absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-ink/65 px-2 py-0.5 text-[11px] font-medium tabular-nums text-white backdrop-blur-sm">
        <Play aria-hidden size={9} fill="currentColor" strokeWidth={0} />
        {formatDuration(media.durationSec)}
      </span>

      {touch && (
        <button
          type="button"
          aria-label={label.replace(/^Open result/, 'Open video')}
          onClick={(event) => {
            event.stopPropagation();
            onOpen();
          }}
          className="absolute right-2 top-2 grid size-9 place-items-center rounded-full bg-ink/65 text-white backdrop-blur-sm active:scale-95"
        >
          <Maximize2 aria-hidden size={15} strokeWidth={1.75} />
        </button>
      )}
    </div>
  );
}

'use client';

import Image from 'next/image';
import { Play } from 'lucide-react';
import { cn } from '@/lib/cn';
import styles from './HistoryStrip.module.css';

/** Frosted strip of recent results. Clicking one jumps to the generation it came from. */
export default function HistoryStrip({ items, onSelect, onViewAll, className }) {
  return (
    <div className={cn('flex items-center gap-2 rounded-panel bg-panel/70 p-2 shadow-float backdrop-blur-md lg:gap-2.5 lg:p-2.5', className)}>
      <button
        type="button"
        onClick={onViewAll}
        className="flex h-12 w-[72px] shrink-0 flex-col items-center justify-center rounded-tile border border-line bg-surface leading-tight transition-[border-color,transform] duration-150 hover:border-ink/15 active:scale-[0.97] lg:h-16 lg:w-[84px]"
      >
        <span className="text-[13px] font-semibold text-ink">History</span>{' '}
        <span className="text-[10px] text-ink-muted">view all</span>
      </button>

      <span aria-hidden className="h-8 w-px shrink-0 bg-line" />

      <ul className={cn('flex min-w-0 flex-1 snap-x gap-2 overflow-x-auto py-0.5 lg:gap-2.5', styles.scroller)}>
        {items.map(({ generationId, media }, index) => (
          <li key={`${generationId}-${media.id}-${index}`} className="snap-start">
            <button
              type="button"
              onClick={() => onSelect(generationId)}
              aria-label={`Go to ${media.alt}`}
              className="group relative block size-12 overflow-hidden rounded-tile bg-panel-strong transition-transform duration-150 active:scale-[0.95] lg:size-16"
            >
              <Image
                src={media.kind === 'video' ? media.poster : media.src}
                alt=""
                fill
                sizes="64px"
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              />
              {media.kind === 'video' && (
                <span className="absolute bottom-1 right-1 grid size-4 place-items-center rounded-full bg-ink/70 text-white">
                  <Play aria-hidden size={8} fill="currentColor" strokeWidth={0} />
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

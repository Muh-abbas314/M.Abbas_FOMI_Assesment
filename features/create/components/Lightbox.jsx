'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Download, ImagePlus, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { modelLabel } from '@/lib/generation-options';
import styles from './Lightbox.module.css';

const navButton =
  'grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-[background-color,transform] duration-150 hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:active:scale-100';

/**
 * Full-screen viewer on a native <dialog>: the browser traps focus and handles Esc.
 * ←/→ move through results and stop at the ends. Closing returns focus to whatever opened it.
 */
export default function Lightbox({ items, index, onIndexChange, onClose, onUseAsReference }) {
  const dialogRef = useRef(null);
  const total = items.length;
  const { media, generation } = items[index];
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  useEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    if (!dialog.open) dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      if (opener instanceof HTMLElement) opener.focus();
    };
  }, []);

  // Listen on the document while open, so arrows work wherever focus sits inside the modal.
  // A focused <video> keeps its own arrow-key seeking.
  useEffect(() => {
    function onKeyDown(event) {
      if (event.target instanceof HTMLVideoElement) return;
      if (event.key === 'ArrowLeft' && hasPrev) onIndexChange(index - 1);
      if (event.key === 'ArrowRight' && hasNext) onIndexChange(index + 1);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [index, hasPrev, hasNext, onIndexChange]);

  const extension = media.src.split('.').pop();

  return (
    <dialog
      ref={dialogRef}
      aria-label="Result viewer"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className={cn(
        'm-0 h-dvh max-h-none w-dvw max-w-none flex-col bg-ink/90 p-0 text-white backdrop-blur-sm open:flex',
        styles.dialog,
      )}
    >
      <header className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6">
        <p className="text-[13px] font-medium tabular-nums text-white/80">{`${index + 1} / ${total}`}</p>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="border-white/15 bg-white/10 text-white hover:bg-white/20"
            onClick={() => {
              onUseAsReference(media);
              onClose();
            }}
          >
            <ImagePlus aria-hidden size={14} strokeWidth={1.75} />
            Use as reference
          </Button>
          <a
            href={media.src}
            download={`fomi-${media.id}.${extension}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white/10 px-3 text-[12px] font-medium text-white transition-colors hover:bg-white/20"
          >
            <Download aria-hidden size={14} strokeWidth={1.75} />
            Download
          </a>
          <button type="button" aria-label="Close" onClick={onClose} className={cn(navButton, 'size-9')}>
            <X aria-hidden size={18} strokeWidth={1.75} />
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 items-center gap-2 px-2 lg:gap-4 lg:px-6">
        <button type="button" aria-label="Previous" disabled={!hasPrev} onClick={() => onIndexChange(index - 1)} className={navButton}>
          <ChevronLeft aria-hidden size={22} strokeWidth={1.75} />
        </button>
        <div key={media.id + index} className={cn('relative h-full min-w-0 flex-1', styles.media)}>
          {media.kind === 'video' ? (
            <video src={media.src} poster={media.poster} controls autoPlay muted playsInline className="absolute inset-0 size-full object-contain" />
          ) : (
            <Image src={media.src} alt={media.alt} fill sizes="100vw" className="object-contain" />
          )}
        </div>
        <button type="button" aria-label="Next" disabled={!hasNext} onClick={() => onIndexChange(index + 1)} className={navButton}>
          <ChevronRight aria-hidden size={22} strokeWidth={1.75} />
        </button>
      </div>

      <footer className="mx-auto w-full max-w-3xl px-4 pb-5 pt-3 text-center">
        <p className="line-clamp-2 text-[13px] leading-relaxed text-white/85">{generation.prompt}</p>
        <p className="mt-1 text-[11px] text-white/55">{modelLabel(generation.settings.model)}</p>
      </footer>
    </dialog>
  );
}

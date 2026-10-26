'use client';

import { Images } from 'lucide-react';
import MainNav from './MainNav';
import SupportPopover from './SupportPopover';

export function FomiMark({ className }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <path d="M11 7h11v4.2h-6.6v3.4h5.8v4.1h-5.8V25H11z" fill="currentColor" />
    </svg>
  );
}

const pillClass =
  'hidden h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[12px] text-ink-muted transition-[color,border-color,transform] duration-150 hover:border-ink/15 hover:text-ink active:scale-[0.97] md:inline-flex';

export default function TopBar({ activeTab, onSelectTab, onOpenGallery }) {
  return (
    <header className="sticky top-0 z-30 h-[var(--topbar-h)] bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto grid h-full max-w-[1680px] grid-cols-[1fr_auto_1fr] items-center gap-1 px-3 sm:gap-2 sm:px-4 lg:px-6 2xl:px-8 3xl:max-w-[1760px]">
        <a href="/create" aria-label="Fomi, go to Create" className="justify-self-start text-ink">
          <FomiMark className="size-8 -ml-1.5" />
        </a>

        <MainNav active={activeTab} onSelectTab={onSelectTab} />

        <div className="flex items-center justify-self-end gap-2">
          <button type="button" className={pillClass} onClick={onOpenGallery}>
            <Images aria-hidden size={14} strokeWidth={1.75} />
            Gallery
          </button>
          <SupportPopover />
          <span
            role="img"
            aria-label="Signed in as Muhammad Abbas"
            className="ml-1 grid size-8 place-items-center rounded-full bg-accent-ink text-[11px] font-medium tracking-wide text-white"
          >
            MA
          </span>
        </div>
      </div>
    </header>
  );
}

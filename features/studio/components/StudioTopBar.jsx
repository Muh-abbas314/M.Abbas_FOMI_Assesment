import Link from 'next/link';
import { ArrowLeft, Coins } from 'lucide-react';
import { formatCredits } from '@/lib/format';
import { FomiMark } from '@/features/create/components/TopBar';

export default function StudioTopBar({ project, children }) {
  return (
    <header className="flex h-14 items-center gap-2 border-b border-studio-line px-3 sm:gap-3 sm:px-4">
      <Link
        href="/create"
        aria-label="Back to Create"
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2 text-[12px] text-studio-ink-muted transition-colors hover:bg-studio-raised hover:text-studio-ink sm:px-2.5"
      >
        <ArrowLeft aria-hidden size={14} strokeWidth={1.75} />
        <span className="hidden sm:inline">Create</span>
      </Link>
      <span aria-hidden className="hidden h-5 w-px shrink-0 bg-studio-line sm:block" />
      <FomiMark className="hidden size-6 shrink-0 text-studio-ink sm:block" />
      <div className="min-w-0 leading-tight">
        <h1 className="truncate text-[13px] font-semibold sm:text-[14px]">{project.title}</h1>
        <p className="hidden text-[11px] text-studio-ink-muted sm:block">Director&apos;s Board</p>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
        <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-studio-line px-2.5 text-[12px] tabular-nums text-studio-ink-muted sm:px-3">
          <Coins aria-hidden size={14} strokeWidth={1.75} />
          <span className="text-studio-ink">{`${formatCredits(project.credits)} credits`}</span>
        </span>
        {children}
      </div>
    </header>
  );
}

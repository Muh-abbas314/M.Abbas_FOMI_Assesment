import Link from 'next/link';
import { ArrowLeft, Coins } from 'lucide-react';
import { formatCredits } from '@/lib/format';
import { FomiMark } from '@/features/create/components/TopBar';

export default function StudioTopBar({ project, children }) {
  return (
    <header className="flex h-14 items-center gap-3 border-b border-studio-line px-3 sm:px-4">
      <Link
        href="/create"
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[12px] text-studio-ink-muted transition-colors hover:bg-studio-raised hover:text-studio-ink"
      >
        <ArrowLeft aria-hidden size={14} strokeWidth={1.75} />
        Create
      </Link>
      <span aria-hidden className="h-5 w-px shrink-0 bg-studio-line" />
      <FomiMark className="size-6 shrink-0 text-studio-ink" />
      <div className="min-w-0 leading-tight">
        <h1 className="truncate text-[14px] font-semibold">{project.title}</h1>
        <p className="hidden text-[11px] text-studio-ink-muted sm:block">Director&apos;s Board</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="inline-flex h-8 items-center gap-1.5 rounded-full border border-studio-line px-3 text-[12px] tabular-nums text-studio-ink-muted">
          <Coins aria-hidden size={14} strokeWidth={1.75} />
          <span className="text-studio-ink">{`${formatCredits(project.credits)} credits`}</span>
        </span>
        {children}
      </div>
    </header>
  );
}

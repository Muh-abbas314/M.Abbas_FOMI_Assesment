import { ListVideo, LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Opens the render queue; shows how many jobs are running so you never wonder. */
export default function QueueButton({ activeCount, open, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={`Render queue, ${activeCount} active`}
      className={cn(
        'inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12px] transition-[border-color,color,background-color] duration-150',
        open ? 'border-studio-accent text-studio-ink' : 'border-studio-line text-studio-ink-muted hover:text-studio-ink',
      )}
    >
      {activeCount > 0 ? (
        <LoaderCircle aria-hidden size={14} strokeWidth={1.75} className="animate-spin text-studio-accent" />
      ) : (
        <ListVideo aria-hidden size={14} strokeWidth={1.75} />
      )}
      Render queue
      {activeCount > 0 && (
        <span aria-hidden className="grid min-w-5 place-items-center rounded-full bg-studio-accent px-1 text-[11px] font-semibold text-studio-on-accent">
          {activeCount}
        </span>
      )}
    </button>
  );
}

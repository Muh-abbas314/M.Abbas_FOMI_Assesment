import { Clapperboard } from 'lucide-react';
import { formatDuration } from '@/lib/format';

/** Stand-in for a shot with no take: the board still plays in full, and you see the gap. */
export default function Slate({ number, title, durationSec, message = 'No take yet — generate one in the inspector' }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(135deg,var(--color-studio-raised)_0_14px,var(--color-studio-surface)_14px_28px)] p-6 text-center">
      <Clapperboard aria-hidden size={28} strokeWidth={1.5} className="text-studio-ink-muted" />
      <p className="text-[15px] font-semibold text-studio-ink">{`Shot ${number} · ${title}`}</p>
      <p className="text-[12px] text-studio-ink-muted">
        {message}
        {durationSec ? ` · ${formatDuration(durationSec)}` : ''}
      </p>
    </div>
  );
}

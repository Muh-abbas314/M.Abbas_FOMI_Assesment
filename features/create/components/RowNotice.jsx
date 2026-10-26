import { Ban, CircleAlert } from 'lucide-react';
import Button from '@/components/ui/Button';

/** Shown in place of results when a generation failed or was cancelled. Always offers a way forward. */
export default function RowNotice({ tone, title, message, actionLabel, onAction }) {
  const Icon = tone === 'error' ? CircleAlert : Ban;
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className="flex min-h-[140px] flex-col items-start justify-center gap-3 rounded-tile border border-dashed border-line bg-panel/40 p-5 sm:flex-row sm:items-center">
      <Icon aria-hidden size={20} strokeWidth={1.75} className={tone === 'error' ? 'shrink-0 text-accent-ink' : 'shrink-0 text-ink-muted'} />
      <div className="flex-1">
        <p className="text-[13px] font-medium text-ink">{title}</p>
        {message && <p className="mt-0.5 text-[12px] text-ink-muted">{message}</p>}
      </div>
      <Button variant={tone === 'error' ? 'primary' : 'secondary'} size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}

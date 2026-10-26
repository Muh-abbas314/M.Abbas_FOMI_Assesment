import { X } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import QueueItem from './QueueItem';

/**
 * Non-modal side panel: jobs keep running and you keep working while it's open.
 * Esc closes it when focus is inside.
 */
export default function RenderQueue({ open, entries, onClose, onCancel, onWatch }) {
  if (!open) return null;
  return (
    <aside
      aria-label="Render queue"
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose();
      }}
      className="fixed inset-x-0 bottom-0 top-14 z-40 flex flex-col border-l border-studio-line bg-studio-surface shadow-[-12px_0_32px_rgb(0_0_0/0.35)] md:left-auto md:w-[360px]"
    >
      <header className="flex items-center justify-between border-b border-studio-line px-4 py-3">
        <h2 className="text-[13px] font-semibold">Render queue</h2>
        <IconButton icon={X} label="Close queue" tone="studio" size={32} tooltip={false} onClick={onClose} />
      </header>
      {entries.length === 0 ? (
        <p className="p-4 text-[12px] leading-relaxed text-studio-ink-muted">
          Nothing rendering. Drafts are quick; the final render is 6× the cost per second.
        </p>
      ) : (
        <ul className="flex flex-col gap-2 overflow-y-auto p-3">
          {entries.map((entry) => (
            <QueueItem key={entry.key} entry={entry} onCancel={onCancel} onWatch={onWatch} />
          ))}
        </ul>
      )}
    </aside>
  );
}

import { Headset } from 'lucide-react';

const SHORTCUTS = [
  ['Generate', '⌘/Ctrl + Enter'],
  ['Next / previous in viewer', '→ / ←'],
  ['Close viewer', 'Esc'],
];

/**
 * "Support" opens a small help card using the HTML popover attribute:
 * the browser handles open, close, Esc and click-outside with no JavaScript.
 */
export default function SupportPopover() {
  return (
    <>
      <button
        type="button"
        popoverTarget="support-popover"
        className="hidden h-8 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[12px] text-ink-muted transition-[color,border-color,transform] duration-150 hover:border-ink/15 hover:text-ink active:scale-[0.97] md:inline-flex"
      >
        <Headset aria-hidden size={14} strokeWidth={1.75} />
        Support
      </button>
      <div
        id="support-popover"
        popover="auto"
        className="fixed inset-auto right-4 top-[calc(var(--topbar-h)+4px)] m-0 w-72 rounded-card border border-line bg-surface p-4 text-ink shadow-float lg:right-6"
      >
        <h2 className="text-[13px] font-semibold">Keyboard shortcuts</h2>
        <dl className="mt-3 flex flex-col gap-2 text-[12px]">
          {SHORTCUTS.map(([action, keys]) => (
            <div key={action} className="flex items-center justify-between gap-3">
              <dt className="text-ink-muted">{action}</dt>
              <dd>
                <kbd className="rounded-md border border-line bg-canvas px-1.5 py-0.5 font-sans text-[11px] text-ink">{keys}</kbd>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  );
}

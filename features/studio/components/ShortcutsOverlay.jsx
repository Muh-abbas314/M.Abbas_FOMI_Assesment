import Dialog from '@/components/ui/Dialog';
import { STUDIO_SHORTCUTS } from '../studio-options';

const KEY_NAMES = {
  Space: 'Space',
  ArrowLeft: '←',
  ArrowRight: '→',
  'Alt+ArrowLeft': 'Alt/⌥ + ←',
  'Alt+ArrowRight': 'Alt/⌥ + →',
  'Mod+Enter': '⌘/Ctrl + Enter',
};

/** Rows for the overlay: the same list that drives the keys, with "Choose take 1…4" folded into one row. */
function rows() {
  const out = [];
  for (const shortcut of STUDIO_SHORTCUTS) {
    if (shortcut.action.startsWith('chooseTake')) {
      if (shortcut.action === 'chooseTake1') out.push({ keys: '1–4', label: 'Choose take' });
      continue;
    }
    out.push({ keys: KEY_NAMES[shortcut.keys] ?? shortcut.keys.toUpperCase(), label: shortcut.label });
  }
  return out;
}

export default function ShortcutsOverlay({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} title="Keyboard shortcuts">
      <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-[13px]">
        {rows().map(({ keys, label }) => (
          <div key={label} className="contents">
            <dt className="text-studio-ink-muted">{label}</dt>
            <dd className="text-right">
              <kbd className="rounded-md border border-studio-line bg-studio-bg px-1.5 py-0.5 font-sans text-[12px]">{keys}</kbd>
            </dd>
          </div>
        ))}
      </dl>
      <p className="text-[12px] text-studio-ink-muted">Shortcuts pause while you type in a field, except ⌘/Ctrl + Enter.</p>
    </Dialog>
  );
}

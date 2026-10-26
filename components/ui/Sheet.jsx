'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import IconButton from './IconButton';
import styles from './Sheet.module.css';

/** Modal sheet on a native <dialog> (focus trap, Esc and inert background come from the browser). */
export default function Sheet({ open, onClose, title, children, tone = 'light' }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        'p-0 shadow-float',
        tone === 'studio' ? 'bg-studio-surface text-studio-ink' : 'bg-canvas text-ink',
        styles.sheet,
      )}
    >
      {open && (
        <div className="flex max-h-[85dvh] flex-col">
          <header className="flex items-center justify-between gap-2 px-4 pb-2 pt-3">
            <h2 className="text-[14px] font-semibold">{title}</h2>
            <IconButton icon={X} label="Close" size={32} tone={tone} tooltip={false} onClick={onClose} />
          </header>
          <div className="overflow-y-auto px-4 pb-[max(16px,env(safe-area-inset-bottom))]">{children}</div>
        </div>
      )}
    </dialog>
  );
}

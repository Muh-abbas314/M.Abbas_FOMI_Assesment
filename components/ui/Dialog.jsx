'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';
import IconButton from './IconButton';
import styles from './Dialog.module.css';

/** Centred modal on a native <dialog> (focus trap, Esc and inert background from the browser). */
export default function Dialog({ open, onClose, title, children, tone = 'studio' }) {
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
      className={cn('p-0 shadow-float', tone === 'studio' ? 'border border-studio-line bg-studio-surface text-studio-ink' : 'bg-canvas text-ink', styles.dialog)}
    >
      {open && (
        <div className="flex flex-col gap-4 p-5">
          <header className="flex items-center justify-between gap-2">
            <h2 className="text-[15px] font-semibold">{title}</h2>
            <IconButton icon={X} label="Close" size={32} tone={tone} tooltip={false} onClick={onClose} />
          </header>
          {children}
        </div>
      )}
    </dialog>
  );
}

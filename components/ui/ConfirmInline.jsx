'use client';

import { useEffect, useRef } from 'react';
import Button from './Button';

/** A question that replaces the button that asked it. Focus lands on the answer; Esc backs out. */
export default function ConfirmInline({ prompt, confirmLabel, cancelLabel = 'Keep', onConfirm, onCancel, tone = 'studio' }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    confirmRef.current?.focus();
  }, []);

  const studio = tone === 'studio';
  return (
    <div
      role="group"
      aria-label={prompt}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.stopPropagation();
          onCancel();
        }
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <p className={studio ? 'text-[12px] text-studio-ink' : 'text-[12px] text-ink'}>{prompt}</p>
      <div className="flex gap-1.5">
        <Button ref={confirmRef} size="sm" variant={studio ? 'studio' : 'primary'} className="h-7 px-3" onClick={onConfirm}>
          {confirmLabel}
        </Button>
        <Button size="sm" variant={studio ? 'studio-ghost' : 'ghost'} className="h-7 px-3" onClick={onCancel}>
          {cancelLabel}
        </Button>
      </div>
    </div>
  );
}

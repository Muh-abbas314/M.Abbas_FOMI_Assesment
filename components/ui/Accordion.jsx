'use client';

import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

/** Collapsible section. Collapsed content is `inert`, so it can't be tabbed into while hidden. */
export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const buttonId = `${id}-button`;
  const regionId = `${id}-region`;

  return (
    <div className="flex flex-col">
      <button
        id={buttonId}
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-full items-center justify-center gap-1.5 rounded-full bg-surface text-[13px] font-medium text-ink transition-[background-color,transform] duration-150 hover:bg-surface/70 active:scale-[0.99]"
      >
        {title}
        <ChevronDown aria-hidden size={15} strokeWidth={1.75} className={cn('text-ink-muted transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <div
        id={regionId}
        role="region"
        aria-labelledby={buttonId}
        className={cn('grid transition-[grid-template-rows] duration-200 ease-[var(--ease-out-soft)]', open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="px-1 pb-1 pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

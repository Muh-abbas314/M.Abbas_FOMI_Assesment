'use client';

import { useId, useState } from 'react';
import { modelLabel } from '@/lib/generation-options';
import { cn } from '@/lib/cn';

/** Long prompts get a "Show more" toggle on small screens, where they'd push results off-screen. */
const CLAMP_FROM_CHARS = 140;

export default function PromptCard({ generation, actions, status }) {
  const [expanded, setExpanded] = useState(false);
  const textId = useId();
  const clampable = generation.prompt.length > CLAMP_FROM_CHARS;

  return (
    <article className="flex flex-col gap-3 rounded-card bg-panel p-4 xl:min-h-[132px]">
      <p id={textId} className={cn('text-[12px] leading-[1.6] text-ink', clampable && !expanded && 'line-clamp-3 md:line-clamp-none')}>
        {generation.prompt}
      </p>
      {clampable && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={textId}
          onClick={() => setExpanded((open) => !open)}
          className="-mt-2 self-start text-[12px] font-medium text-accent-ink underline-offset-2 hover:underline md:hidden"
        >
          {expanded ? 'Show less' : 'Show more'}
        </button>
      )}
      {status}
      <footer className="mt-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">{actions}</div>
        <span className="rounded-full bg-surface px-3 py-1 text-[11px] text-ink-muted">{modelLabel(generation.settings.model)}</span>
      </footer>
    </article>
  );
}

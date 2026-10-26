'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import IconButton from '@/components/ui/IconButton';
import { modelLabel } from '@/lib/generation-options';
import { cn } from '@/lib/cn';

/** Long prompts get a "Show more" toggle on small screens, where they'd push results off-screen. */
const CLAMP_FROM_CHARS = 140;
const COPIED_MS = 1500;

export default function PromptCard({ generation, onReuse, status, notice }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);
  const textId = useId();
  const clampable = generation.prompt.length > CLAMP_FROM_CHARS;

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(generation.prompt);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      // Clipboard blocked: leave the label as is rather than claim it worked.
    }
  }

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
      {notice && <p className="text-[11px] text-ink-muted">{notice}</p>}
      <footer className="mt-auto flex items-center justify-between gap-2">
        <div className="-ml-1.5 flex items-center">
          {onReuse && <IconButton icon={RotateCcw} label="Reuse prompt" size={30} onClick={() => onReuse(generation)} />}
          <IconButton icon={copied ? Check : Copy} label={copied ? 'Copied' : 'Copy prompt'} size={30} onClick={copy} />
        </div>
        <span className="rounded-full bg-surface px-3 py-1 text-[11px] text-ink-muted">{modelLabel(generation.settings.model)}</span>
      </footer>
    </article>
  );
}

import { PROMPT_COUNTER_FROM, PROMPT_MAX } from '@/lib/generation-options';
import { cn } from '@/lib/cn';

export const PROMPT_PLACEHOLDER = 'Describe your imagination to be converted to a piece of art…';

/** Prompt box. Cmd/Ctrl+Enter submits; the character counter only appears near the limit. */
export default function PromptField({ value, onChange, onSubmitShortcut, textareaRef, rows = 6, children, className, textareaClassName }) {
  const length = value.length;
  const over = length > PROMPT_MAX;

  return (
    <div
      className={cn(
        'relative rounded-card border border-line bg-surface transition-colors duration-150',
        'has-[textarea:focus-visible]:border-ink/20 has-[textarea:focus-visible]:outline-2 has-[textarea:focus-visible]:outline-offset-2 has-[textarea:focus-visible]:outline-accent-ink',
        className,
      )}
    >
      <textarea
        ref={textareaRef}
        aria-label="Describe your imagination"
        placeholder={PROMPT_PLACEHOLDER}
        value={value}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            onSubmitShortcut();
          }
        }}
        className={cn(
          'block w-full resize-none bg-transparent px-3.5 pb-14 pt-3 text-[13px] leading-relaxed text-ink placeholder:text-ink-subtle focus-visible:outline-none',
          textareaClassName,
        )}
      />
      <div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2">
        <span aria-live="polite" className={cn('pl-1.5 text-[11px] tabular-nums', over ? 'font-medium text-accent-ink' : 'text-ink-muted')}>
          {length >= PROMPT_COUNTER_FROM ? `${length} / ${PROMPT_MAX}` : ''}
        </span>
        {children}
      </div>
    </div>
  );
}

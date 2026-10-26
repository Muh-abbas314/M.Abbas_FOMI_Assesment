import { PROMPT_COUNTER_FROM, PROMPT_MAX } from '@/lib/generation-options';
import { cn } from '@/lib/cn';

export const PROMPT_PLACEHOLDER = 'Describe your imagination to be converted to a piece of art…';

/**
 * Prompt box. Cmd/Ctrl+Enter submits; the character counter only appears near the limit.
 * `compact` is the dock version: one line that grows to four (CSS field-sizing), Generate at the end.
 */
export default function PromptField({ value, onChange, onSubmitShortcut, textareaRef, rows = 6, compact = false, children, className }) {
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
        rows={compact ? 1 : rows}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            onSubmitShortcut();
          }
        }}
        className={cn(
          'block w-full resize-none bg-transparent text-[13px] leading-relaxed text-ink placeholder:text-ink-subtle focus-visible:outline-none',
          compact
            ? 'max-h-28 min-h-[42px] py-2.5 pl-3.5 pr-14 [field-sizing:content] md:min-h-[72px] md:pb-12 md:pr-3.5'
            : 'px-3.5 pb-14 pt-3',
        )}
      />
      <div className="absolute inset-x-2 bottom-1.5 flex items-center justify-between gap-2 md:bottom-2">
        <span aria-live="polite" className={cn('pl-1.5 text-[11px] tabular-nums', over ? 'font-medium text-accent-deep' : 'text-ink-muted')}>
          {length >= PROMPT_COUNTER_FROM ? `${length} / ${PROMPT_MAX}` : ''}
        </span>
        {children}
      </div>
    </div>
  );
}

import { useId } from 'react';
import { NEGATIVE_PROMPT_MAX } from '@/lib/generation-options';

const fieldClass =
  'rounded-tile border border-line bg-surface px-3 py-2 text-[12px] font-normal text-ink placeholder:text-ink-subtle transition-colors hover:border-ink/20';

export default function AdvancedFields({ settings, onChange }) {
  const hintId = useId();
  return (
    <div className="flex flex-col gap-3">
      <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink">
        Negative prompt
        <textarea
          rows={2}
          maxLength={NEGATIVE_PROMPT_MAX}
          value={settings.negativePrompt}
          onChange={(event) => onChange('negativePrompt', event.target.value)}
          placeholder="What to leave out, e.g. blur, text, watermarks"
          className={`${fieldClass} resize-none`}
        />
      </label>
      <label className="flex flex-col gap-1.5 text-[12px] font-medium text-ink">
        Seed
        <input
          inputMode="numeric"
          value={settings.seed}
          onChange={(event) => onChange('seed', event.target.value.replace(/\D/g, '').slice(0, 9))}
          placeholder="Random"
          aria-describedby={hintId}
          className={`${fieldClass} h-8 py-0`}
        />
        <span id={hintId} className="text-[11px] font-normal text-ink-muted">
          The same seed and prompt give the same result.
        </span>
      </label>
    </div>
  );
}

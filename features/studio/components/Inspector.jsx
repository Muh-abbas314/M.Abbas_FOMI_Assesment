import { useId } from 'react';
import { MoveLeft, MoveRight, Sparkles } from 'lucide-react';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { CAMERA_MOTIONS } from '@/lib/generation-options';
import { takeCost } from '../cost';
import { SHOT_DURATIONS, TRANSITIONS } from '../studio-options';

const DURATION_OPTIONS = SHOT_DURATIONS.map((d) => ({ value: d, label: `${d}s` }));
const CAMERA_OPTIONS = CAMERA_MOTIONS.map((c) => ({ value: c, label: c }));

const inputClass =
  'w-full rounded-tile border border-studio-line bg-studio-bg px-3 text-[13px] text-studio-ink placeholder:text-studio-ink-muted/70 transition-colors hover:border-studio-ink-muted/50';

function FieldLabel({ children }) {
  return <span className="text-[11px] font-medium text-studio-ink-muted">{children}</span>;
}

/** Why Generate is unavailable, in plain words, or null when it's ready. */
export function generateBlockedReason(shot, credits) {
  if (!shot.prompt.trim()) return 'Add a prompt first';
  if (credits < takeCost(shot)) return 'Not enough credits';
  return null;
}

/** Everything about the selected shot: its fields, a Generate draft button, and (children) its takes. */
export default function Inspector({ shot, number, total, credits = Infinity, onChange, onMove, onGenerate, children }) {
  const id = useId();
  const blocked = generateBlockedReason(shot, credits);
  return (
    <section aria-label="Shot inspector" className="flex min-h-0 flex-col gap-4 overflow-y-auto border-studio-line bg-studio-surface p-4 lg:border-l">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-[13px] font-semibold">
          Shot {number} <span className="font-normal text-studio-ink-muted">of {total}</span>
        </h2>
        <div className="flex items-center gap-1">
          <Button variant="studio-ghost" size="sm" className="h-7 px-2" disabled={number === 1} onClick={() => onMove(-1)}>
            <MoveLeft aria-hidden size={14} strokeWidth={1.75} />
            Move left
          </Button>
          <Button variant="studio-ghost" size="sm" className="h-7 px-2" disabled={number === total} onClick={() => onMove(1)}>
            Move right
            <MoveRight aria-hidden size={14} strokeWidth={1.75} />
          </Button>
        </div>
      </header>

      <label className="flex flex-col gap-1.5">
        <FieldLabel>Title</FieldLabel>
        <input id={`${id}-title`} value={shot.title} onChange={(e) => onChange({ title: e.target.value })} maxLength={40} className={`${inputClass} h-9`} />
      </label>

      <label className="flex flex-col gap-1.5">
        <FieldLabel>Prompt</FieldLabel>
        <textarea
          value={shot.prompt}
          onChange={(e) => onChange({ prompt: e.target.value })}
          rows={4}
          maxLength={2000}
          placeholder="What happens in this shot?"
          className={`${inputClass} resize-none py-2 leading-relaxed`}
        />
      </label>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1.5">
          <FieldLabel>Duration</FieldLabel>
          <Select tone="studio" label="Duration" value={shot.durationSec} options={DURATION_OPTIONS} onChange={(durationSec) => onChange({ durationSec })} />
        </div>
        <div className="col-span-2 flex flex-col gap-1.5">
          <FieldLabel>Camera</FieldLabel>
          <Select tone="studio" label="Camera" value={shot.camera} options={CAMERA_OPTIONS} onChange={(camera) => onChange({ camera })} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <FieldLabel>Transition out</FieldLabel>
        <Select tone="studio" label="Transition out" value={shot.transition} options={TRANSITIONS} onChange={(transition) => onChange({ transition })} />
      </div>

      {onGenerate && (
        <div className="flex flex-col gap-1.5">
          <Button variant="studio" disabled={Boolean(blocked)} aria-describedby={`${id}-generate`} onClick={() => onGenerate(shot.id)}>
            <Sparkles aria-hidden size={15} strokeWidth={1.75} />
            Generate take
          </Button>
          <p id={`${id}-generate`} className="text-center text-[11px] tabular-nums text-studio-ink-muted">
            {blocked ?? `Draft · ${takeCost(shot)} credits · ⌘/Ctrl + Enter`}
          </p>
        </div>
      )}

      {children}
    </section>
  );
}

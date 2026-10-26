'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Check, Columns2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { cn } from '@/lib/cn';
import { formatDuration } from '@/lib/format';
import { isActiveStatus } from '@/lib/job-status';

const STEP = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };

function PendingTake({ take, number, onCancel, onRetry }) {
  if (isActiveStatus(take.status)) {
    return (
      <div className="flex flex-col gap-1.5 rounded-tile border border-studio-line p-2.5">
        <div className="flex items-center justify-between gap-2 text-[12px]">
          <span>
            <span className="font-medium">{`Take ${number}`}</span>
            <span className="ml-2 tabular-nums text-studio-ink-muted">{`${take.stage} · ${Math.round(take.progress * 100)}%`}</span>
          </span>
          <Button variant="studio-ghost" size="sm" className="-mr-1.5 h-7 px-2" disabled={!take.jobId || take.cancelRequested} onClick={() => onCancel(take.id)}>
            {take.cancelRequested ? 'Stopping…' : 'Cancel take'}
          </Button>
        </div>
        <ProgressBar tone="studio" value={take.progress} label={`Take ${number} progress`} />
      </div>
    );
  }
  const label = take.status === 'failed' ? take.error : 'Stopped';
  return (
    <div className="flex items-center justify-between gap-2 rounded-tile border border-dashed border-studio-line p-2.5 text-[12px]">
      <span className="min-w-0">
        <span className="font-medium">{`Take ${number}`}</span>
        <span className="ml-2 text-studio-ink-muted">
          {label}
          {take.refunded ? ` · ${take.cost} credits refunded` : ''}
        </span>
      </span>
      {take.status === 'failed' && (
        <Button variant="studio-ghost" size="sm" className="-mr-1.5 h-7 px-2" aria-label={`Retry take ${number}`} onClick={() => onRetry(take.id)}>
          Retry
        </Button>
      )}
    </div>
  );
}

/**
 * Every take of the shot. Finished takes form a radio group (pick the keeper); running and
 * failed ones are listed underneath with Cancel / Retry. Nothing here ever replaces a take.
 */
export default function TakesStack({ shot, onChoose, onCompare, onCancel, onRetry }) {
  const refs = useRef({});
  const numbered = shot.takes.map((take, index) => ({ take, number: index + 1 }));
  const done = numbered.filter(({ take }) => take.status === 'done');
  const others = numbered.filter(({ take }) => take.status !== 'done');
  const keeperIndex = done.findIndex(({ take }) => take.id === shot.chosenTakeId);

  function onKeyDown(event) {
    if (!(event.key in STEP) || done.length === 0) return;
    event.preventDefault();
    const next = (Math.max(keeperIndex, 0) + STEP[event.key] + done.length) % done.length;
    onChoose(done[next].take.id);
    refs.current[done[next].take.id]?.focus();
  }

  return (
    <section aria-label="Takes for this shot" className="flex flex-col gap-2.5">
      <header className="flex items-center justify-between">
        <h3 className="text-[12px] font-semibold">Takes</h3>
        <Button variant="studio-ghost" size="sm" className="-mr-1.5 h-7 px-2" disabled={done.length < 2} onClick={onCompare}>
          <Columns2 aria-hidden size={14} strokeWidth={1.75} />
          Compare takes
        </Button>
      </header>

      {done.length > 0 ? (
        <div role="radiogroup" aria-label="Takes" onKeyDown={onKeyDown} className="flex flex-col gap-1.5">
          {done.map(({ take, number }, index) => {
            const checked = take.id === shot.chosenTakeId;
            return (
              <button
                key={take.id}
                ref={(el) => { refs.current[take.id] = el; }}
                type="button"
                role="radio"
                aria-checked={checked}
                tabIndex={checked || (keeperIndex < 0 && index === 0) ? 0 : -1}
                onClick={() => onChoose(take.id)}
                className={cn(
                  'flex items-center gap-3 rounded-tile border p-1.5 pr-3 text-left transition-[border-color,background-color] duration-150',
                  checked ? 'border-studio-accent bg-studio-raised' : 'border-studio-line hover:border-studio-ink-muted/50',
                )}
              >
                <span className="relative h-9 w-16 shrink-0 overflow-hidden rounded-md bg-studio-bg">
                  <Image src={take.media.poster} alt="" fill sizes="64px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1 text-[12px]">
                  <span className="block font-medium">{`Take ${number}`}</span>
                  <span className="block tabular-nums text-studio-ink-muted">{formatDuration(take.media.durationSec)} clip</span>
                </span>
                {checked && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-studio-accent">
                    <Check aria-hidden size={13} strokeWidth={2} />
                    Keeper
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        others.length === 0 && <p className="text-[12px] text-studio-ink-muted">No takes yet. Generate a draft to start.</p>
      )}

      {others.map(({ take, number }) => (
        <PendingTake key={take.id} take={take} number={number} onCancel={onCancel} onRetry={onRetry} />
      ))}
    </section>
  );
}

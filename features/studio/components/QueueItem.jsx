'use client';

import { useState } from 'react';
import { Film, Sparkles } from 'lucide-react';
import Button from '@/components/ui/Button';
import ConfirmInline from '@/components/ui/ConfirmInline';
import ProgressBar from '@/components/ui/ProgressBar';
import { formatEta } from '@/lib/format';
import { isActiveStatus } from '@/lib/job-status';

function Outcome({ entry, onWatch }) {
  if (entry.status === 'cancelled') {
    return <p className="text-[12px] text-studio-ink-muted">{entry.refunded ? `Stopped · ${entry.cost} credits refunded` : 'Stopped'}</p>;
  }
  if (entry.status === 'failed') {
    return (
      <p className="text-[12px] text-studio-ink-muted">
        {entry.error}
        {entry.refunded ? ` · ${entry.cost} credits refunded` : ''}
      </p>
    );
  }
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-[12px] text-studio-ink-muted">{entry.notice ?? 'Ready'}</p>
      {entry.kind === 'final' && (
        <Button variant="studio" size="sm" className="h-7 px-3" onClick={() => onWatch(entry)}>
          Watch
        </Button>
      )}
    </div>
  );
}

/** One job in the queue: its real stage, honest time left, and a Cancel that asks first. */
export default function QueueItem({ entry, onCancel, onWatch }) {
  const [confirming, setConfirming] = useState(false);
  const active = isActiveStatus(entry.status);
  const Icon = entry.kind === 'final' ? Film : Sparkles;

  return (
    <li className="flex flex-col gap-2 rounded-card border border-studio-line bg-studio-bg p-3">
      <div className="flex items-start gap-2.5">
        <Icon aria-hidden size={15} strokeWidth={1.75} className={entry.kind === 'final' ? 'mt-0.5 text-studio-accent' : 'mt-0.5 text-studio-ink-muted'} />
        <p className="min-w-0 flex-1 text-[12px] font-medium leading-snug">{entry.title}</p>
      </div>

      {active ? (
        <>
          <div className="flex items-center justify-between gap-2 text-[12px] tabular-nums">
            <span>{`${entry.stage} · ${Math.round(entry.progress * 100)}%`}</span>
            <span className="text-studio-ink-muted">{formatEta(entry.etaMs)}</span>
          </div>
          <ProgressBar tone="studio" value={entry.progress} label={`${entry.title} progress`} />
          {entry.cancelRequested ? (
            <p aria-live="polite" className="text-[12px] text-studio-ink-muted">Stopping…</p>
          ) : confirming ? (
            <ConfirmInline
              prompt="Stop this render? Credits are refunded."
              confirmLabel="Stop render"
              onConfirm={() => {
                setConfirming(false);
                onCancel(entry);
              }}
              onCancel={() => setConfirming(false)}
            />
          ) : (
            <Button variant="studio-ghost" size="sm" className="-ml-2 h-7 self-start px-2" onClick={() => setConfirming(true)}>
              Cancel
            </Button>
          )}
        </>
      ) : (
        <Outcome entry={entry} onWatch={onWatch} />
      )}
    </li>
  );
}

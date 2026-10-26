import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { VIDEO_RESULT_COUNT } from '@/lib/generation-options';
import { isActiveStatus } from '@/lib/job-status';
import PromptCard from './PromptCard';
import ResultGrid, { PendingGrid } from './ResultGrid';
import RowNotice from './RowNotice';
import styles from './GenerationRow.module.css';

function JobStatus({ generation, onCancel }) {
  const pct = Math.round(generation.progress * 100);
  return (
    <div className="flex flex-col gap-1.5">
      <p aria-live="polite" className="text-[12px] font-medium tabular-nums text-ink">{`${generation.stage} · ${pct}%`}</p>
      <div className="flex items-center gap-2">
        <ProgressBar value={generation.progress} label={`${generation.mode === 'video' ? 'Video' : 'Image'} generation progress`} className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          className="-mr-2 h-7 px-2.5"
          disabled={!generation.jobId || generation.cancelRequested}
          onClick={() => onCancel(generation.id)}
        >
          {generation.cancelRequested ? 'Cancelling…' : 'Cancel'}
        </Button>
      </div>
    </div>
  );
}

export default function GenerationRow({ generation, onOpen, onReuse, onCancel, onRetry, highlighted = false }) {
  const { id, status, settings } = generation;
  const active = isActiveStatus(status);
  const count = generation.mode === 'video' ? VIDEO_RESULT_COUNT : settings.count ?? 4;

  let results;
  if (active) {
    results = <PendingGrid aspectRatio={settings.aspectRatio} count={count} />;
  } else if (status === 'failed') {
    results = <RowNotice tone="error" title="This one didn't finish" message={generation.error} actionLabel="Retry" onAction={() => onRetry(id)} />;
  } else if (status === 'cancelled') {
    results = <RowNotice tone="neutral" title="Cancelled" message="Your prompt and settings are kept." actionLabel="Run again" onAction={() => onRetry(id)} />;
  } else {
    results = <ResultGrid generation={generation} onOpen={(index) => onOpen(id, index)} />;
  }

  return (
    <li
      id={`gen-${id}`}
      data-highlighted={highlighted || undefined}
      className={`${styles.row} grid scroll-mt-[calc(var(--topbar-h)+var(--history-h)+24px)] items-start gap-3 xl:grid-cols-[240px_1fr] 2xl:grid-cols-[280px_1fr]`}
    >
      <PromptCard
        generation={generation}
        onReuse={onReuse}
        notice={generation.notice}
        status={active ? <JobStatus generation={generation} onCancel={onCancel} /> : null}
      />
      {results}
    </li>
  );
}

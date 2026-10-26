'use client';

import { usePollJob } from '@/lib/hooks/use-poll-job';

/**
 * Invisible poller. Providers mount one per running job, so polling doesn't depend on
 * whether the row or panel showing that job is on screen.
 */
export default function JobWatcher({ jobId, onUpdate }) {
  usePollJob(jobId, onUpdate);
  return null;
}

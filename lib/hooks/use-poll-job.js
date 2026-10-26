'use client';

import { useEffect, useRef } from 'react';
import { getJob, NETWORK_ERROR } from '@/lib/api/jobs-client';
import { isTerminalStatus } from '@/lib/job-status';

const MAX_CONSECUTIVE_ERRORS = 5;

/**
 * Poll a job until it finishes.
 * - A setTimeout chain (not setInterval), so a slow response never overlaps the next request.
 * - Hidden tabs don't poll; coming back polls at once. Progress comes from the clock, so it catches up.
 * - After 5 failures in a row it reports a failure instead of spinning forever.
 */
export function usePollJob(jobId, onUpdate, { intervalMs = 700 } = {}) {
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  });

  useEffect(() => {
    if (!jobId) return undefined;

    const controller = new AbortController();
    let stopped = false;
    let inFlight = false;
    let errors = 0;
    let timer = null;

    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(tick, intervalMs);
    };

    async function tick() {
      if (stopped || inFlight || document.hidden) return;
      inFlight = true;
      try {
        const state = await getJob(jobId, { signal: controller.signal });
        errors = 0;
        if (stopped) return;
        onUpdateRef.current(state);
        if (isTerminalStatus(state.status)) {
          stopped = true;
          return;
        }
      } catch {
        if (stopped || controller.signal.aborted) return;
        errors += 1;
        if (errors >= MAX_CONSECUTIVE_ERRORS) {
          stopped = true;
          onUpdateRef.current({ status: 'failed', error: NETWORK_ERROR, progress: 0, stage: 'Stopped', etaMs: 0, results: [] });
          return;
        }
      } finally {
        inFlight = false;
      }
      schedule();
    }

    function onVisibilityChange() {
      if (document.hidden) return;
      clearTimeout(timer);
      tick();
    }

    document.addEventListener('visibilitychange', onVisibilityChange);
    tick();

    return () => {
      stopped = true;
      clearTimeout(timer);
      controller.abort();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [jobId, intervalMs]);
}

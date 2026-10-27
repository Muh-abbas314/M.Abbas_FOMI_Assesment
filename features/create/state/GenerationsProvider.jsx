'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import JobWatcher from '@/components/JobWatcher';
import { cancelJob, createJob } from '@/lib/api/jobs-client';
import { isActiveStatus } from '@/lib/job-status';
import { loadJSON, saveJSON } from '@/lib/storage';
import { generationsReducer, isGenerationLike, MAX_PERSISTED, selectHistory, STORAGE_KEY_CREATE } from './generations-reducer';

const GenerationsContext = createContext(null);

export function useGenerations() {
  const value = useContext(GenerationsContext);
  if (!value) throw new Error('useGenerations must be used inside <GenerationsProvider>.');
  return value;
}

/**
 * Owns the /create feed: starting, polling, cancelling and retrying jobs, and saving the user's rows.
 * `fresh` (from ?fresh=1) starts empty and saves nothing, for demoing the first-run experience.
 */
export function GenerationsProvider({ initialFeed, fresh = false, children }) {
  const [items, dispatch] = useReducer(generationsReducer, initialFeed);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const initialItemsRef = useRef(items);
  const itemsRef = useRef(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Never write while the feed is still what we started with: in development React runs effects
  // twice, and saving the untouched seed would overwrite saved work before it's restored.
  useEffect(() => {
    if (fresh || items === initialItemsRef.current) return;
    saveJSON(STORAGE_KEY_CREATE, items.filter((g) => !g.id.startsWith('seed-')).slice(0, MAX_PERSISTED));
  }, [items, fresh]);

  useEffect(() => {
    if (fresh) return;
    const saved = loadJSON(STORAGE_KEY_CREATE, []);
    const rows = Array.isArray(saved) ? saved.filter(isGenerationLike) : [];
    if (rows.length) dispatch({ type: 'hydrate', items: rows });
  }, [fresh]);

  const startJob = useCallback(async (id, body) => {
    try {
      const { jobId, createdAt } = await createJob(body);
      dispatch({ type: 'jobAssigned', id, jobId, createdAt });
    } catch (error) {
      dispatch({ type: 'createFailed', id, error: error.message });
    }
  }, []);

  const generate = useCallback(
    async (body) => {
      if (submittingRef.current) return null;
      submittingRef.current = true;
      setIsSubmitting(true);
      const id = crypto.randomUUID();
      dispatch({ type: 'create', generation: { id, mode: body.mode, prompt: body.prompt, settings: body.settings, attempt: 1, createdAt: Date.now() } });
      try {
        await startJob(id, { ...body, attempt: 1 });
      } finally {
        submittingRef.current = false;
        setIsSubmitting(false);
      }
      return id;
    },
    [startJob],
  );

  const retry = useCallback(
    (id) => {
      const row = itemsRef.current.find((g) => g.id === id);
      if (!row) return;
      dispatch({ type: 'retry', id });
      startJob(id, { mode: row.mode, prompt: row.prompt, settings: row.settings, attempt: row.attempt + 1 });
    },
    [startJob],
  );

  const cancel = useCallback(async (id) => {
    const row = itemsRef.current.find((g) => g.id === id);
    if (!row?.jobId || row.cancelRequested) return;
    dispatch({ type: 'cancelRequested', id });
    try {
      const result = await cancelJob(row.jobId);
      if (result.outcome === 'cancelled') dispatch({ type: 'cancelled', id });
      else dispatch({ type: 'cancelRejected', id, state: result.state });
    } catch {
      dispatch({ type: 'cancelFailed', id });
    }
  }, []);

  const onJobUpdate = useCallback((id, jobId, state) => dispatch({ type: 'jobUpdate', id, jobId, state }), []);

  const value = useMemo(
    () => ({ items, history: selectHistory(items), isSubmitting, generate, cancel, retry }),
    [items, isSubmitting, generate, cancel, retry],
  );

  return (
    <GenerationsContext.Provider value={value}>
      {items
        .filter((g) => g.jobId && isActiveStatus(g.status) && !g.cancelRequested)
        .map((g) => (
          <JobWatcher key={g.jobId} jobId={g.jobId} onUpdate={(state) => onJobUpdate(g.id, g.jobId, state)} />
        ))}
      {children}
    </GenerationsContext.Provider>
  );
}

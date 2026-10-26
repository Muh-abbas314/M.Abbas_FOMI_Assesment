'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import JobWatcher from '@/components/JobWatcher';
import { cancelJob, createJob } from '@/lib/api/jobs-client';
import { isActiveStatus } from '@/lib/job-status';
import { loadJSON, saveJSON } from '@/lib/storage';
import { takeCost } from '../cost';
import { STORAGE_KEY_STUDIO } from '../studio-options';
import { initStudioState, isStudioStateLike, reviveStudioState, studioReducer } from './studio-reducer';

const StudioContext = createContext(null);

export function useStudio() {
  const value = useContext(StudioContext);
  if (!value) throw new Error('useStudio must be used inside <StudioProvider>.');
  return value;
}

const findShot = (state, shotId) => state.project.shots.find((s) => s.id === shotId);

function newJob(cost) {
  return {
    id: crypto.randomUUID(),
    jobId: null,
    status: 'queued',
    progress: 0,
    stage: 'Queued',
    etaMs: 0,
    error: null,
    createdAt: Date.now(),
    cost,
    refunded: false,
    cancelRequested: false,
    notice: null,
  };
}

/**
 * Owns the project and its jobs. It is saved on every change, so a returning director picks up
 * where they left off, running jobs included.
 */
export function StudioProvider({ initialProject, children }) {
  const [state, dispatch] = useReducer(studioReducer, initialProject, initStudioState);
  const hydratedRef = useRef(false);
  const stateRef = useRef(state);
  const startingRef = useRef(new Set());

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Save only after hydration, so the first render can't overwrite what's stored.
  useEffect(() => {
    if (hydratedRef.current) saveJSON(STORAGE_KEY_STUDIO, state);
  }, [state]);

  useEffect(() => {
    const saved = loadJSON(STORAGE_KEY_STUDIO, null);
    if (isStudioStateLike(saved)) dispatch({ type: 'hydrate', state: reviveStudioState(saved) });
    hydratedRef.current = true;
  }, []);

  const startTake = useCallback(async (shotId, attempt) => {
    const shot = findShot(stateRef.current, shotId);
    if (!shot || !shot.prompt.trim() || startingRef.current.has(shotId)) return;
    const cost = takeCost(shot);
    if (stateRef.current.project.credits < cost) return;
    startingRef.current.add(shotId);
    const take = { ...newJob(cost), media: null };
    dispatch({ type: 'takeQueued', shotId, take });
    try {
      const { jobId, createdAt } = await createJob({
        mode: 'video',
        prompt: shot.prompt,
        settings: { aspectRatio: '16:9', durationSec: shot.durationSec, camera: shot.camera, quality: 'draft' },
        attempt,
      });
      dispatch({ type: 'takeJobAssigned', shotId, takeId: take.id, jobId, createdAt });
    } catch (error) {
      dispatch({ type: 'takeCreateFailed', shotId, takeId: take.id, error: error.message });
    } finally {
      startingRef.current.delete(shotId);
    }
  }, []);

  const generateTake = useCallback((shotId) => startTake(shotId, 1), [startTake]);
  const retryTake = useCallback((shotId) => startTake(shotId, 2), [startTake]);

  const cancelTake = useCallback(async (shotId, takeId) => {
    const take = findShot(stateRef.current, shotId)?.takes.find((t) => t.id === takeId);
    if (!take?.jobId || take.cancelRequested) return;
    dispatch({ type: 'takeCancelRequested', shotId, takeId });
    try {
      const result = await cancelJob(take.jobId);
      if (result.outcome === 'cancelled') dispatch({ type: 'takeCancelled', shotId, takeId });
      else dispatch({ type: 'takeCancelRejected', shotId, takeId, state: result.state });
    } catch {
      dispatch({ type: 'takeCancelFailed', shotId, takeId });
    }
  }, []);

  const chooseTake = useCallback((shotId, takeId) => dispatch({ type: 'chooseTake', shotId, takeId }), []);

  const value = useMemo(
    () => ({ state, dispatch, generateTake, retryTake, cancelTake, chooseTake }),
    [state, generateTake, retryTake, cancelTake, chooseTake],
  );

  const watchedTakes = state.project.shots.flatMap((shot) =>
    shot.takes.filter((t) => t.jobId && isActiveStatus(t.status) && !t.cancelRequested).map((take) => ({ shotId: shot.id, take })),
  );

  return (
    <StudioContext.Provider value={value}>
      {watchedTakes.map(({ shotId, take }) => (
        <JobWatcher
          key={take.jobId}
          jobId={take.jobId}
          onUpdate={(jobState) => dispatch({ type: 'takeUpdate', shotId, takeId: take.id, jobId: take.jobId, state: jobState })}
        />
      ))}
      {children}
    </StudioContext.Provider>
  );
}

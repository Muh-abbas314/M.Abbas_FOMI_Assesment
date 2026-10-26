import { formatDuration } from '@/lib/format';
import { isActiveStatus } from '@/lib/job-status';

const QUEUE_FINISHED_LIMIT = 5;
export const STOP_TOO_LATE_NOTICE = 'Finished before it could stop.';
export const STOP_FAILED_NOTICE = "Couldn't stop it — still running.";

const isSettledUnpaid = (status) => status === 'failed' || status === 'cancelled';

/** @returns {import('@/features/studio/types').StudioState} */
export function initStudioState(project) {
  return { project, selectedShotId: project.shots[0]?.id ?? null };
}

export function selectedShot(state) {
  return state.project.shots.find((s) => s.id === state.selectedShotId) ?? null;
}

function withProject(state, change) {
  return { ...state, project: { ...state.project, ...change } };
}

/**
 * Apply `change` to a job (take or render). If it just failed or was cancelled, refund its
 * cost once. Returns the updated job and the refund amount.
 */
function settle(job, change) {
  const next = { ...job, ...change };
  if (isSettledUnpaid(next.status) && !job.refunded && job.cost > 0) {
    return { job: { ...next, refunded: true }, refund: job.cost };
  }
  return { job: next, refund: 0 };
}

function updateTake(state, shotId, takeId, changeFor) {
  let refund = 0;
  const shots = state.project.shots.map((shot) => {
    if (shot.id !== shotId) return shot;
    let chosenTakeId = shot.chosenTakeId;
    const takes = shot.takes.map((take) => {
      if (take.id !== takeId) return take;
      const result = settle(take, changeFor(take));
      refund += result.refund;
      // A shot's first finished take becomes its keeper; later takes never replace a keeper.
      if (result.job.status === 'done' && chosenTakeId === null) chosenTakeId = take.id;
      return result.job;
    });
    return { ...shot, takes, chosenTakeId };
  });
  return withProject(state, { shots, credits: state.project.credits + refund });
}

function updateRender(state, renderId, changeFor) {
  let refund = 0;
  const renders = state.project.renders.map((render) => {
    if (render.id !== renderId) return render;
    const result = settle(render, changeFor(render));
    refund += result.refund;
    return result.job;
  });
  return withProject(state, { renders, credits: state.project.credits + refund });
}

/** Job state from the API → fields on a take (the first result becomes the take's media). */
function takeFields({ status, progress, stage, etaMs, error, results }) {
  return { status, progress, stage, etaMs, error: error ?? null, media: results?.[0] ?? null };
}

function renderFields({ status, progress, stage, etaMs, error }) {
  return { status, progress, stage, etaMs, error: error ?? null };
}

/** Ignore late updates for jobs that were replaced or already settled. */
const live = (job, jobId, fields) => (isActiveStatus(job.status) && (!jobId || job.jobId === jobId) ? fields : {});

function nextShotNumber(shots) {
  return shots.reduce((max, s) => Math.max(max, Number(s.id.replace(/\D/g, '')) || 0), 0) + 1;
}

export function studioReducer(state, action) {
  const { shots } = state.project;
  switch (action.type) {
    case 'hydrate':
      return action.state;

    case 'selectShot':
      return { ...state, selectedShotId: action.shotId };

    case 'selectAdjacent': {
      const index = shots.findIndex((s) => s.id === state.selectedShotId);
      const next = Math.min(shots.length - 1, Math.max(0, index + action.delta));
      return { ...state, selectedShotId: shots[next]?.id ?? null };
    }

    case 'addShot': {
      const shot = {
        id: action.id ?? `shot-${nextShotNumber(shots)}`,
        title: `Shot ${shots.length + 1}`,
        prompt: '',
        durationSec: 4,
        camera: 'Static',
        transition: 'cut',
        takes: [],
        chosenTakeId: null,
      };
      return { ...withProject(state, { shots: [...shots, shot] }), selectedShotId: shot.id };
    }

    case 'updateShot':
      return withProject(state, { shots: shots.map((s) => (s.id === action.shotId ? { ...s, ...action.patch } : s)) });

    case 'moveShot': {
      const from = shots.findIndex((s) => s.id === action.shotId);
      const to = from + action.delta;
      if (from < 0 || to < 0 || to >= shots.length) return state;
      const reordered = [...shots];
      [reordered[from], reordered[to]] = [reordered[to], reordered[from]];
      return withProject(state, { shots: reordered });
    }

    // Takes
    case 'takeQueued': {
      const next = withProject(state, {
        shots: shots.map((s) => (s.id === action.shotId ? { ...s, takes: [...s.takes, action.take] } : s)),
        credits: state.project.credits - action.take.cost,
      });
      return next;
    }
    case 'takeJobAssigned':
      return updateTake(state, action.shotId, action.takeId, () => ({ jobId: action.jobId, createdAt: action.createdAt }));
    case 'takeUpdate':
      return updateTake(state, action.shotId, action.takeId, (t) => live(t, action.jobId, takeFields(action.state)));
    case 'takeCancelRequested':
      return updateTake(state, action.shotId, action.takeId, () => ({ cancelRequested: true }));
    case 'takeCancelled':
      return updateTake(state, action.shotId, action.takeId, () => ({ status: 'cancelled', cancelRequested: false }));
    case 'takeCancelRejected':
      return updateTake(state, action.shotId, action.takeId, () => ({ ...takeFields(action.state), cancelRequested: false, notice: STOP_TOO_LATE_NOTICE }));
    case 'takeCancelFailed':
      return updateTake(state, action.shotId, action.takeId, () => ({ cancelRequested: false, notice: STOP_FAILED_NOTICE }));
    case 'takeCreateFailed':
      return updateTake(state, action.shotId, action.takeId, () => ({ status: 'failed', error: action.error }));
    case 'chooseTake': {
      const shot = shots.find((s) => s.id === action.shotId);
      const take = shot?.takes.find((t) => t.id === action.takeId);
      if (!take || take.status !== 'done') return state;
      return withProject(state, { shots: shots.map((s) => (s.id === action.shotId ? { ...s, chosenTakeId: action.takeId } : s)) });
    }

    // Final renders
    case 'renderQueued':
      return withProject(state, {
        renders: [...state.project.renders, action.render],
        credits: state.project.credits - action.render.cost,
      });
    case 'renderJobAssigned':
      return updateRender(state, action.renderId, () => ({ jobId: action.jobId, createdAt: action.createdAt }));
    case 'renderUpdate':
      return updateRender(state, action.renderId, (r) => live(r, action.jobId, renderFields(action.state)));
    case 'renderCancelRequested':
      return updateRender(state, action.renderId, () => ({ cancelRequested: true }));
    case 'renderCancelled':
      return updateRender(state, action.renderId, () => ({ status: 'cancelled', cancelRequested: false }));
    case 'renderCancelRejected':
      return updateRender(state, action.renderId, () => ({ ...renderFields(action.state), cancelRequested: false, notice: STOP_TOO_LATE_NOTICE }));
    case 'renderCancelFailed':
      return updateRender(state, action.renderId, () => ({ cancelRequested: false, notice: STOP_FAILED_NOTICE }));
    case 'renderCreateFailed':
      return updateRender(state, action.renderId, () => ({ status: 'failed', error: action.error }));

    default:
      return state;
  }
}

const JOB_FIELDS = ['status', 'stage', 'progress', 'etaMs', 'cost', 'refunded', 'cancelRequested', 'notice', 'createdAt', 'error'];
const jobFields = (job) => Object.fromEntries(JOB_FIELDS.map((key) => [key, job[key]]));

/**
 * Everything the user paid for, for the render queue: running jobs first, then the last few finished.
 * Seed takes cost nothing and aren't listed.
 */
export function selectQueue(state) {
  const entries = [];
  state.project.shots.forEach((shot, shotIndex) => {
    shot.takes.forEach((take, takeIndex) => {
      if (take.cost > 0) {
        entries.push({ key: take.id, kind: 'draft', title: `Shot ${shotIndex + 1} · Take ${takeIndex + 1} · Draft`, shotId: shot.id, takeId: take.id, ...jobFields(take) });
      }
    });
  });
  for (const render of state.project.renders) {
    entries.push({ key: render.id, kind: 'final', title: `Final film · ${render.shotCount} shots · ${formatDuration(render.totalSec)}`, renderId: render.id, ...jobFields(render) });
  }
  const newestFirst = (a, b) => b.createdAt - a.createdAt;
  const active = entries.filter((e) => isActiveStatus(e.status)).sort(newestFirst);
  const finished = entries.filter((e) => !isActiveStatus(e.status)).sort(newestFirst).slice(0, QUEUE_FINISHED_LIMIT);
  return [...active, ...finished];
}

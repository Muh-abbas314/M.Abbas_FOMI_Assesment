import { isActiveStatus } from '@/lib/job-status';

export const STORAGE_KEY_CREATE = 'fomi.create.v1';
export const MAX_PERSISTED = 30;
const HISTORY_LIMIT = 20;

export const CANCEL_TOO_LATE_NOTICE = 'Finished before it could be cancelled.';
export const CANCEL_FAILED_NOTICE = "Couldn't cancel — it's still running.";
export const INTERRUPTED_ERROR = 'This generation was interrupted. Try again.';

const fresh = { status: 'queued', progress: 0, stage: 'Queued', etaMs: 0, jobId: null, results: [], error: null, cancelRequested: false, notice: null };

function update(items, id, change) {
  return items.map((g) => (g.id === id ? { ...g, ...(typeof change === 'function' ? change(g) : change) } : g));
}

/** A saved row from a previous visit, made safe to resume. */
function revive(g) {
  if (isActiveStatus(g.status) && !g.jobId) return { ...g, status: 'failed', error: INTERRUPTED_ERROR, cancelRequested: false };
  return { ...g, cancelRequested: false };
}

/** @param {import('@/lib/types').Generation[]} items */
export function generationsReducer(items, action) {
  switch (action.type) {
    case 'hydrate': {
      const saved = action.items.map(revive);
      const savedIds = new Set(saved.map((g) => g.id));
      return [...saved, ...items.filter((g) => !savedIds.has(g.id))];
    }
    case 'create':
      return [{ ...action.generation, ...fresh }, ...items];
    case 'jobAssigned':
      return update(items, action.id, { jobId: action.jobId, createdAt: action.createdAt });
    case 'jobUpdate':
      return update(items, action.id, (g) => {
        // Late answers for a replaced job, or for a row already settled, are ignored.
        if ((action.jobId && g.jobId !== action.jobId) || !isActiveStatus(g.status)) return {};
        return { ...action.state };
      });
    case 'cancelRequested':
      return update(items, action.id, { cancelRequested: true });
    case 'cancelled':
      return update(items, action.id, { status: 'cancelled', cancelRequested: false });
    case 'cancelRejected':
      return update(items, action.id, { ...action.state, cancelRequested: false, notice: CANCEL_TOO_LATE_NOTICE });
    case 'cancelFailed':
      return update(items, action.id, { cancelRequested: false, notice: CANCEL_FAILED_NOTICE });
    case 'retry':
      return update(items, action.id, (g) => ({ ...fresh, attempt: g.attempt + 1 }));
    case 'createFailed':
      return update(items, action.id, { status: 'failed', error: action.error });
    default:
      return items;
  }
}

/** Results of finished generations, newest first. */
export function selectHistory(items, { limit = HISTORY_LIMIT } = {}) {
  const history = [];
  for (const g of [...items].sort((a, b) => b.createdAt - a.createdAt)) {
    if (g.status !== 'done') continue;
    for (const media of g.results) {
      if (history.length >= limit) return history;
      history.push({ generationId: g.id, media });
    }
  }
  return history;
}

/** Shape check for rows read back from storage. */
export function isGenerationLike(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    typeof value.prompt === 'string' &&
    (value.mode === 'image' || value.mode === 'video') &&
    value.settings !== null &&
    typeof value.settings === 'object' &&
    Array.isArray(value.results) &&
    typeof value.status === 'string'
  );
}

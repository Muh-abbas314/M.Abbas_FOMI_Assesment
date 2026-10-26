import { pickMedia } from './media-library';

/** Every job spends its first 800ms queued, like a real render farm. */
export const QUEUE_MS = 800;

export const JOB_PROFILES = {
  image: { totalMs: 6000, stages: ['Queued', 'Reading your prompt', 'Composing', 'Rendering details', 'Finishing up'] },
  video: { totalMs: 10000, stages: ['Queued', 'Planning the motion', 'Generating frames', 'Adding camera motion', 'Encoding'] },
  draft: { totalMs: 5000, stages: ['Queued', 'Drafting'] },
  final: { totalMs: 20000, stages: ['Queued', 'Rendering', 'Upscaling'] },
};

export const FAIL_MESSAGE = "The model couldn't finish this one. Your prompt is saved — try again.";

/** Fail the job at this fraction of the work, so the demo shows a partial run first. */
const FAIL_AT = 0.6;

export function resolveProfile(mode, quality) {
  if (mode === 'image') return 'image';
  return quality === 'draft' || quality === 'final' ? quality : 'video';
}

/** Demo hook: a prompt containing the word "fail" fails on its first attempt only, so Retry works. */
export function shouldFail(prompt, attempt) {
  return /\bfail\b/i.test(prompt) && attempt === 1;
}

/** MOCK_JOB_SPEED speeds the clock up for tests (1–100, default 1). */
export function getJobSpeed() {
  return Math.min(100, Math.max(1, Number(process.env.MOCK_JOB_SPEED) || 1));
}

/**
 * Work out a job's state purely from its payload and the current time.
 * @param {import('@/lib/types').JobPayload} payload
 * @param {number} now  Epoch ms
 * @param {number} [speed]
 * @returns {import('@/lib/types').JobState}
 */
export function computeJobState(payload, now, speed = 1) {
  const { totalMs, stages } = JOB_PROFILES[payload.p];
  const elapsed = Math.max(0, (now - payload.t) * speed);

  if (elapsed < QUEUE_MS) {
    return { status: 'queued', progress: 0, stage: stages[0], etaMs: totalMs - elapsed, results: [], error: null };
  }

  const frac = Math.min(1, (elapsed - QUEUE_MS) / (totalMs - QUEUE_MS));
  if (payload.f && frac >= FAIL_AT) {
    return { status: 'failed', progress: FAIL_AT, stage: 'Stopped', etaMs: 0, results: [], error: FAIL_MESSAGE };
  }
  if (frac >= 1) {
    const results = payload.p === 'final'
      ? []
      : pickMedia({ kind: payload.p === 'image' ? 'image' : 'video', count: payload.n, seed: payload.s, aspectRatio: payload.ar, tags: payload.k });
    return { status: 'done', progress: 1, stage: 'Done', etaMs: 0, results, error: null };
  }

  const stage = stages[1 + Math.min(stages.length - 2, Math.floor(frac * (stages.length - 1)))];
  return { status: 'generating', progress: frac, stage, etaMs: totalMs - elapsed, results: [], error: null };
}

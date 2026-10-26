import {
  CAMERA_MOTIONS,
  DRAFT_DURATIONS,
  FINAL_MAX_SECONDS,
  IMAGE_ASPECTS,
  IMAGE_COUNTS,
  IMAGE_DEFAULTS,
  IMAGE_MODELS,
  NEGATIVE_PROMPT_MAX,
  PROMPT_MAX,
  QUALITIES,
  STYLES,
  VIDEO_ASPECTS,
  VIDEO_DEFAULTS,
  VIDEO_DURATIONS,
  VIDEO_MODELS,
  VIDEO_RESULT_COUNT,
} from '@/lib/generation-options';

const fail = (error) => ({ ok: false, error });
const oneOf = (value, allowed, fallback) => (value === undefined ? fallback : allowed.includes(value) ? value : undefined);
const COUNT_BY_QUALITY = { standard: VIDEO_RESULT_COUNT, draft: 1, final: 0 };

/**
 * Check a create-job request and fill in defaults.
 * @returns {{ ok: true, value: import('@/lib/types').CreateJobInput } | { ok: false, error: string }}
 */
export function validateCreateBody(body) {
  if (!body || typeof body !== 'object') return fail('Body must be a JSON object.');
  const { mode, prompt, settings = {}, attempt = 1 } = body;

  if (mode !== 'image' && mode !== 'video') return fail('mode must be "image" or "video".');
  if (typeof prompt !== 'string' || !prompt.trim()) return fail('prompt is required.');
  const trimmed = prompt.trim();
  if (trimmed.length > PROMPT_MAX) return fail(`prompt must be ${PROMPT_MAX} characters or fewer.`);
  if (!Number.isInteger(attempt) || attempt < 1) return fail('attempt must be a positive integer.');
  if (!settings || typeof settings !== 'object') return fail('settings must be an object.');

  const common = validateCommon(settings, mode === 'image' ? IMAGE_MODELS : VIDEO_MODELS, mode === 'image' ? IMAGE_DEFAULTS : VIDEO_DEFAULTS);
  if (typeof common === 'string') return fail(common);

  const specific = mode === 'image' ? validateImage(settings) : validateVideo(settings);
  if (typeof specific === 'string') return fail(specific);

  return { ok: true, value: { mode, prompt: trimmed, attempt, settings: { ...specific, ...common } } };
}

function validateCommon(s, models, defaults) {
  const model = oneOf(s.model, models.map((m) => m.value), defaults.model);
  if (!model) return 'Unknown model.';
  const style = oneOf(s.style, STYLES, defaults.style);
  if (!style) return 'Unknown style.';
  const negativePrompt = s.negativePrompt ?? '';
  if (typeof negativePrompt !== 'string' || negativePrompt.length > NEGATIVE_PROMPT_MAX) return 'negativePrompt is too long.';
  const seed = s.seed ?? null;
  if (seed !== null && (!Number.isInteger(seed) || seed < 0)) return 'seed must be a non-negative integer.';
  const referenceId = s.referenceId ?? null;
  if (referenceId !== null && typeof referenceId !== 'string') return 'referenceId must be a string.';
  return { model, style, negativePrompt, seed, referenceId };
}

function validateImage(s) {
  if (s.quality !== undefined && s.quality !== 'standard') return 'Draft and final quality are video-only.';
  const count = oneOf(s.count, IMAGE_COUNTS, IMAGE_DEFAULTS.count);
  if (!count) return 'count must be 1–4.';
  const aspectRatio = oneOf(s.aspectRatio, IMAGE_ASPECTS, IMAGE_DEFAULTS.aspectRatio);
  if (!aspectRatio) return 'Unsupported aspect ratio.';
  return { count, aspectRatio };
}

function validateVideo(s) {
  const quality = oneOf(s.quality, QUALITIES, 'standard');
  if (!quality) return 'Unknown quality.';
  const aspectRatio = oneOf(s.aspectRatio, VIDEO_ASPECTS, VIDEO_DEFAULTS.aspectRatio);
  if (!aspectRatio) return 'Unsupported aspect ratio.';
  const camera = oneOf(s.camera, CAMERA_MOTIONS, VIDEO_DEFAULTS.camera);
  if (!camera) return 'Unknown camera motion.';

  const durationSec = s.durationSec ?? VIDEO_DEFAULTS.durationSec;
  const durationOk =
    quality === 'final'
      ? Number.isInteger(durationSec) && durationSec > 0 && durationSec <= FINAL_MAX_SECONDS
      : (quality === 'draft' ? DRAFT_DURATIONS : VIDEO_DURATIONS).includes(durationSec);
  if (!durationOk) return 'Unsupported duration.';

  return { count: COUNT_BY_QUALITY[quality], aspectRatio, durationSec, camera, quality };
}

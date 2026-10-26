// The single source of truth for what a generation can be asked to do.
// Used by the composer UI, the studio and the mock API's validation.

export const IMAGE_MODELS = [
  { value: 'fomi-photoreal', label: 'Fomi Photoreal' },
  { value: 'fomi-image-2', label: 'Fomi Image 2' },
  { value: 'fomi-illustrate', label: 'Fomi Illustrate' },
];
export const VIDEO_MODELS = [
  { value: 'fomi-motion', label: 'Fomi Motion' },
  { value: 'fomi-motion-turbo', label: 'Fomi Motion Turbo' },
];

export const IMAGE_COUNTS = [1, 2, 3, 4];
export const IMAGE_ASPECTS = ['1:1', '3:4', '4:3', '16:9', '9:16'];
export const VIDEO_ASPECTS = ['16:9', '9:16', '1:1'];
export const VIDEO_DURATIONS = [4, 6, 8];
/** Studio shots are shorter beats, so drafts also allow 2s. */
export const DRAFT_DURATIONS = [2, 4, 6, 8];
export const FINAL_MAX_SECONDS = 600;
export const CAMERA_MOTIONS = ['Static', 'Push in', 'Pull out', 'Pan left', 'Pan right', 'Orbit', 'Handheld'];
export const STYLES = ['None', 'Cinematic', 'Portrait', 'Anime', 'Product', 'Film grain', 'Watercolor'];
export const QUALITIES = ['standard', 'draft', 'final'];

/** Video is expensive, so a standard video batch is 2 clips. */
export const VIDEO_RESULT_COUNT = 2;
export const PROMPT_MAX = 2000;
export const PROMPT_COUNTER_FROM = 1800;
export const NEGATIVE_PROMPT_MAX = 500;

export const IMAGE_DEFAULTS = {
  count: 4,
  aspectRatio: '1:1',
  model: IMAGE_MODELS[0].value,
  style: 'None',
  negativePrompt: '',
  seed: null,
};
export const VIDEO_DEFAULTS = {
  durationSec: 6,
  aspectRatio: '16:9',
  model: VIDEO_MODELS[0].value,
  camera: 'Static',
  style: 'None',
  negativePrompt: '',
  seed: null,
};

const modelLabels = new Map([...IMAGE_MODELS, ...VIDEO_MODELS].map((m) => [m.value, m.label]));

/** 'fomi-photoreal' → 'Fomi Photoreal' (falls back to the raw value). */
export function modelLabel(value) {
  return modelLabels.get(value) ?? value;
}

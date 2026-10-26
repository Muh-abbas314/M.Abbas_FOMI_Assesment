import { IMAGE_DEFAULTS, PROMPT_MAX, VIDEO_DEFAULTS } from '@/lib/generation-options';

// Each mode remembers its own settings, so switching Image → Video → Image loses nothing.

const SETTING_KEYS = {
  image: ['count', 'aspectRatio', 'model', 'style', 'negativePrompt', 'seed'],
  video: ['durationSec', 'aspectRatio', 'model', 'camera', 'style', 'negativePrompt', 'seed'],
};

/** Seeds are typed into a text field, so the draft keeps them as strings ('' = random). */
export function initialComposerState(mode = 'image') {
  return {
    mode,
    prompt: '',
    image: { ...IMAGE_DEFAULTS, seed: '' },
    video: { ...VIDEO_DEFAULTS, seed: '' },
    reference: null,
  };
}

function pick(source, keys) {
  return Object.fromEntries(keys.filter((key) => source[key] !== undefined).map((key) => [key, source[key]]));
}

export function composerReducer(state, action) {
  switch (action.type) {
    case 'setMode':
      return { ...state, mode: action.mode };
    case 'setPrompt':
      return { ...state, prompt: action.prompt };
    case 'setSetting':
      return { ...state, [state.mode]: { ...state[state.mode], [action.key]: action.value } };
    case 'setReference':
      return { ...state, reference: action.media };
    case 'loadGeneration': {
      const { mode, prompt, settings } = action.generation;
      const restored = pick(settings, SETTING_KEYS[mode]);
      return {
        ...state,
        mode,
        prompt,
        [mode]: { ...state[mode], ...restored, seed: settings.seed == null ? '' : String(settings.seed) },
      };
    }
    default:
      return state;
  }
}

export function canGenerate(state) {
  const length = state.prompt.trim().length;
  return length > 0 && length <= PROMPT_MAX;
}

/** The request body for POST /api/generations: only the active mode's settings. */
export function toCreateBody(state) {
  const settings = pick(state[state.mode], SETTING_KEYS[state.mode]);
  const seed = Number.parseInt(settings.seed, 10);
  return {
    mode: state.mode,
    prompt: state.prompt.trim(),
    settings: { ...settings, seed: Number.isNaN(seed) ? null : seed, referenceId: state.reference?.id ?? null },
  };
}

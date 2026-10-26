import { DRAFT_DURATIONS } from '@/lib/generation-options';

export const SHOT_DURATIONS = DRAFT_DURATIONS;

export const TRANSITIONS = [
  { value: 'cut', label: 'Cut' },
  { value: 'dissolve', label: 'Dissolve' },
  { value: 'fade', label: 'Fade through black' },
];

export const STARTING_CREDITS = 1200;
export const STORAGE_KEY_STUDIO = 'fomi.studio.v1';

/** One list drives both the key handling and the `?` overlay, so they can't drift apart. */
export const STUDIO_SHORTCUTS = [
  { keys: 'Space', label: 'Play or pause', action: 'togglePlay' },
  { keys: 'ArrowLeft', label: 'Previous shot', action: 'prevShot' },
  { keys: 'ArrowRight', label: 'Next shot', action: 'nextShot' },
  { keys: 'Alt+ArrowLeft', label: 'Move shot left', action: 'moveLeft' },
  { keys: 'Alt+ArrowRight', label: 'Move shot right', action: 'moveRight' },
  { keys: '1', label: 'Choose take 1', action: 'chooseTake1' },
  { keys: '2', label: 'Choose take 2', action: 'chooseTake2' },
  { keys: '3', label: 'Choose take 3', action: 'chooseTake3' },
  { keys: '4', label: 'Choose take 4', action: 'chooseTake4' },
  { keys: 'Mod+Enter', label: 'Generate a take', action: 'generateTake' },
  { keys: 'j', label: 'Back 2 seconds', action: 'shuttleBack' },
  { keys: 'k', label: 'Pause', action: 'shuttlePause' },
  { keys: 'l', label: 'Play faster', action: 'shuttleForward' },
  { keys: '?', label: 'Show shortcuts', action: 'toggleShortcuts' },
];

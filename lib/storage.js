// localStorage can throw (private mode, blocked storage, quota) or hold anything.
// These helpers never throw, so persistence can only ever be a bonus.

export function loadJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable: the app keeps working, just without saving.
  }
}

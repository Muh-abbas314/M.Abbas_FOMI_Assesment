const creditsFormat = new Intl.NumberFormat('en-US');

/** Seconds → "m:ss", rounded to the nearest second. */
export function formatDuration(sec) {
  const total = Math.max(0, Math.round(sec));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/** Remaining milliseconds → "~5s left" or "~1m 1s left", always rounding up. */
export function formatEta(ms) {
  const sec = Math.ceil(ms / 1000);
  if (sec <= 0) return 'Almost done';
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return minutes > 0 ? `~${minutes}m ${seconds}s left` : `~${seconds}s left`;
}

/** 1240 → "1,240" */
export function formatCredits(n) {
  return creditsFormat.format(n);
}

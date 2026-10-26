/** '16:9' → 'landscape', '3:4' → 'portrait', '1:1' → 'square' */
export function orientationOf(aspectRatio) {
  const [w, h] = aspectRatio.split(':').map(Number);
  if (w === h) return 'square';
  return w > h ? 'landscape' : 'portrait';
}

/** '3:4' → '3 / 4' for the CSS aspect-ratio property. */
export function cssAspectRatio(aspectRatio) {
  return aspectRatio.replace(':', ' / ');
}

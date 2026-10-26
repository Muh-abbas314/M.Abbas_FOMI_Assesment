import { orientationOf } from '@/lib/aspect';

// Class strings are written out in full so Tailwind can find them.
// The rule: a batch never leaves an orphan tile on its own row.

/** Grid columns for a batch of `count` results at `aspectRatio`. */
export function gridColumnsClass(aspectRatio, count) {
  if (orientationOf(aspectRatio) === 'landscape') {
    return count === 4 ? 'grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2';
  }
  if (count === 4) return 'grid-cols-2 md:grid-cols-4';
  if (count === 3) return 'grid-cols-3';
  return 'grid-cols-2';
}

/** `sizes` for next/image that matches the columns above, so the browser fetches the right width. */
export function tileSizes(aspectRatio, count) {
  if (orientationOf(aspectRatio) === 'landscape') {
    return count === 4 ? '(min-width:1536px) 18vw, (min-width:640px) 40vw, 100vw' : '(min-width:1280px) 30vw, (min-width:640px) 45vw, 100vw';
  }
  if (count === 4) return '(min-width:1280px) 15vw, (min-width:768px) 22vw, 50vw';
  return '(min-width:1280px) 22vw, (min-width:768px) 30vw, 50vw';
}

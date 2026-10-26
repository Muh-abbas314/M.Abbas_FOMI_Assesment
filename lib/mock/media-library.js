import media from '@/data/media.json';
import { mulberry32, seededShuffle } from './prng';

/** @type {import('@/lib/types').MediaItem[]} */
export const MEDIA = media;

const MAX_TAGS = 5;
const byId = new Map(MEDIA.map((m) => [m.id, m]));
const knownTags = new Set(MEDIA.flatMap((m) => m.tags));

export function getMediaById(id) {
  return byId.get(id);
}

/** '16:9' → 'landscape', '3:4' → 'portrait', '1:1' → 'square' */
export function orientationOf(aspectRatio) {
  const [w, h] = aspectRatio.split(':').map(Number);
  if (w === h) return 'square';
  return w > h ? 'landscape' : 'portrait';
}

function mediaOrientation(m) {
  const ratio = m.width / m.height;
  if (Math.abs(ratio - 1) <= 0.05) return 'square';
  return ratio > 1 ? 'landscape' : 'portrait';
}

/** Media tags that appear as whole words in the prompt, in prompt order, at most 5. */
export function matchTags(prompt) {
  const words = prompt.toLowerCase().split(/[^\p{L}\p{N}-]+/u);
  const found = [];
  for (const word of words) {
    if (knownTags.has(word) && !found.includes(word)) found.push(word);
    if (found.length === MAX_TAGS) break;
  }
  return found;
}

/**
 * Deterministically pick `count` items for a mock result.
 * Order: most tag matches first, then matching orientation, then a seeded shuffle.
 * Cycles through the pool when `count` is larger than it.
 */
export function pickMedia({ kind, count, seed, aspectRatio, tags = [] }) {
  const wanted = orientationOf(aspectRatio);
  const shuffled = seededShuffle(MEDIA.filter((m) => m.kind === kind), mulberry32(seed));
  const ranked = shuffled
    .map((m, index) => ({
      m,
      index,
      score: m.tags.filter((t) => tags.includes(t)).length,
      fits: mediaOrientation(m) === wanted ? 1 : 0,
    }))
    .sort((a, b) => b.score - a.score || b.fits - a.fits || a.index - b.index)
    .map((entry) => entry.m);
  if (ranked.length === 0) return [];
  return Array.from({ length: count }, (_, i) => ranked[i % ranked.length]);
}

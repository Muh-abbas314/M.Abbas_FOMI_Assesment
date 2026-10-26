import seed from '@/data/seed-feed.json';
import { getMediaById } from './media-library';
import { validateCreateBody } from './validate';

/**
 * The returning user's existing generations, newest first.
 * Settings go through the same validation as real requests, so every default is filled in.
 * @returns {import('@/lib/types').Generation[]}
 */
export function getSeedFeed() {
  return seed
    .map((entry) => {
      const { value } = validateCreateBody({ mode: entry.mode, prompt: entry.prompt, settings: entry.settings });
      return {
        id: entry.id,
        jobId: null,
        mode: value.mode,
        prompt: value.prompt,
        settings: value.settings,
        attempt: 1,
        createdAt: Date.parse(entry.createdAt),
        status: 'done',
        progress: 1,
        stage: 'Done',
        etaMs: 0,
        results: entry.mediaIds.map(getMediaById),
        error: null,
        cancelRequested: false,
        notice: null,
      };
    })
    .sort((a, b) => b.createdAt - a.createdAt);
}

import seed from '@/data/studio-project.json';
import { STARTING_CREDITS } from '@/features/studio/studio-options';
import { getMediaById } from './media-library';

/**
 * The returning user's project in the studio: five shots, most with takes already made.
 * Shot 4 has none on purpose, to show slates in playback and the final-render check.
 * @returns {import('@/features/studio/types').Project}
 */
export function getSeedProject() {
  return {
    id: seed.id,
    title: seed.title,
    aspectRatio: seed.aspectRatio,
    credits: STARTING_CREDITS,
    renders: [],
    shots: seed.shots.map((shot) => {
      const takes = shot.takes.map((mediaId, index) => ({
        id: `${shot.id}-take-${index + 1}`,
        jobId: null,
        status: 'done',
        progress: 1,
        stage: 'Done',
        etaMs: 0,
        media: getMediaById(mediaId),
        error: null,
        createdAt: 0,
        cost: 0,
        refunded: false,
        cancelRequested: false,
        notice: null,
      }));
      return {
        id: shot.id,
        title: shot.title,
        prompt: shot.prompt,
        durationSec: shot.durationSec,
        camera: shot.camera,
        transition: shot.transition,
        takes,
        chosenTakeId: shot.keeper === null ? null : takes[shot.keeper].id,
      };
    }),
  };
}

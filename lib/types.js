// Shared JSDoc types. Import them in JSDoc with `import('@/lib/types').Name`.

/**
 * @typedef {object} MediaItem
 * @property {string} id
 * @property {'image'|'video'} kind
 * @property {string} src            Path under /public, e.g. "/media/images/img-scene-01.jpg"
 * @property {string} [poster]       Video poster path
 * @property {number} width          Pixel width
 * @property {number} height         Pixel height
 * @property {number} [durationSec]  Video length
 * @property {string} alt
 * @property {string[]} tags         Words used to match prompts to mock results
 * @property {{ author: string, source: string, url: string }} credit
 */

export {};

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

/**
 * Everything the mock needs to recompute a job's progress, packed into its id.
 * @typedef {object} JobPayload
 * @property {'image'|'video'|'draft'|'final'} p  Profile
 * @property {number} n    Result count
 * @property {string} ar   Aspect ratio, e.g. "16:9"
 * @property {number} t    Created at (epoch ms)
 * @property {number} s    Seed for picking results
 * @property {0|1} f       Will fail (demo)
 * @property {string[]} k  Prompt tags for picking results
 */

/**
 * @typedef {object} JobState
 * @property {'queued'|'generating'|'done'|'failed'} status
 * @property {number} progress   0..1
 * @property {string} stage      Human-readable stage, e.g. "Composing"
 * @property {number} etaMs
 * @property {MediaItem[]} results
 * @property {string|null} error
 */

/**
 * @typedef {object} CreateJobInput
 * @property {'image'|'video'} mode
 * @property {string} prompt
 * @property {object} settings
 * @property {number} attempt
 */

/**
 * A row in the /create feed.
 * @typedef {object} Generation
 * @property {string} id
 * @property {string|null} jobId
 * @property {'image'|'video'} mode
 * @property {string} prompt
 * @property {object} settings
 * @property {number} attempt
 * @property {number} createdAt
 * @property {'queued'|'generating'|'done'|'failed'|'cancelled'} status
 * @property {number} progress
 * @property {string} stage
 * @property {number} etaMs
 * @property {MediaItem[]} results
 * @property {string|null} error
 * @property {boolean} cancelRequested
 * @property {string|null} notice
 */

/**
 * @typedef {object} HistoryItem
 * @property {string} generationId
 * @property {MediaItem} media
 */

export {};

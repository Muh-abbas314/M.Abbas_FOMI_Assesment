// JSDoc types for the studio. Import with `import('@/features/studio/types').Name`.

/**
 * One generated version of a shot. Takes are never overwritten; the shot's keeper is chosen explicitly.
 * @typedef {object} Take
 * @property {string} id
 * @property {string|null} jobId
 * @property {'queued'|'generating'|'done'|'failed'|'cancelled'} status
 * @property {number} progress
 * @property {string} stage
 * @property {number} etaMs
 * @property {import('@/lib/types').MediaItem|null} media
 * @property {string|null} error
 * @property {number} createdAt
 * @property {number} cost          Credits charged when it started (0 for seed takes)
 * @property {boolean} refunded
 * @property {boolean} cancelRequested
 * @property {string|null} notice
 */

/**
 * @typedef {object} Shot
 * @property {string} id
 * @property {string} title
 * @property {string} prompt
 * @property {number} durationSec
 * @property {string} camera
 * @property {'cut'|'dissolve'|'fade'} transition   How this shot hands over to the next
 * @property {Take[]} takes
 * @property {string|null} chosenTakeId
 */

/**
 * A final render of the whole board.
 * @typedef {object} Render
 * @property {string} id
 * @property {string|null} jobId
 * @property {'queued'|'generating'|'done'|'failed'|'cancelled'} status
 * @property {number} progress
 * @property {string} stage
 * @property {number} etaMs
 * @property {number} cost
 * @property {boolean} refunded
 * @property {boolean} cancelRequested
 * @property {string|null} notice
 * @property {number} shotCount
 * @property {number} totalSec
 * @property {number} createdAt
 */

/**
 * @typedef {object} Project
 * @property {string} id
 * @property {string} title
 * @property {'16:9'} aspectRatio
 * @property {number} credits
 * @property {Shot[]} shots
 * @property {Render[]} renders
 */

/**
 * @typedef {object} StudioState
 * @property {Project} project
 * @property {string|null} selectedShotId
 */

/**
 * @typedef {object} Segment  One shot's slot in the board playback.
 * @property {string} shotId
 * @property {number} number
 * @property {string} title
 * @property {number} start
 * @property {number} end
 * @property {number} durationSec
 * @property {import('@/lib/types').MediaItem|null} media   null → shown as a slate
 * @property {'cut'|'dissolve'|'fade'} transition
 */

export {};

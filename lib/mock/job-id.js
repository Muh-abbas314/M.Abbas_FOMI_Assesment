// "The job id is the job": everything needed to answer "how far along is it?"
// is packed into the id itself, so any server instance can answer without shared memory.

const PROFILES = ['image', 'video', 'draft', 'final'];

/** @param {import('@/lib/types').JobPayload} payload */
export function encodeJobId(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

/** @returns {import('@/lib/types').JobPayload | null} */
export function decodeJobId(id) {
  if (typeof id !== 'string' || !/^[A-Za-z0-9_-]+$/.test(id)) return null;
  try {
    const p = JSON.parse(Buffer.from(id, 'base64url').toString('utf8'));
    return isPayload(p) ? { p: p.p, n: p.n, ar: p.ar, t: p.t, s: p.s, f: p.f, k: p.k } : null;
  } catch {
    return null;
  }
}

function isPayload(p) {
  return (
    p !== null &&
    typeof p === 'object' &&
    PROFILES.includes(p.p) &&
    Number.isInteger(p.n) && p.n >= 0 &&
    typeof p.ar === 'string' &&
    Number.isFinite(p.t) &&
    Number.isInteger(p.s) &&
    (p.f === 0 || p.f === 1) &&
    Array.isArray(p.k) && p.k.every((tag) => typeof tag === 'string')
  );
}

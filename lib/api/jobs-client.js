// Thin client for the generations API. Errors come back as plain-language messages.

export const NETWORK_ERROR = "Couldn't reach Fomi. Check your connection and try again.";

async function request(url, { method = 'GET', body, signal } = {}) {
  let response;
  try {
    response = await fetch(url, {
      method,
      signal,
      headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error?.name === 'AbortError') throw error;
    throw new Error(NETWORK_ERROR);
  }
  const json = await response.json().catch(() => null);
  return { response, json };
}

/** @returns {Promise<{ jobId: string, createdAt: number }>} */
export async function createJob(body, { signal } = {}) {
  const { response, json } = await request('/api/generations', { method: 'POST', body, signal });
  if (!response.ok) throw new Error(json?.error?.message ?? NETWORK_ERROR);
  return { jobId: json.jobId, createdAt: json.createdAt };
}

/** @returns {Promise<import('@/lib/types').JobState & { jobId: string }>} */
export async function getJob(jobId, { signal } = {}) {
  const { response, json } = await request(`/api/generations/${jobId}`, { signal });
  if (!response.ok) throw new Error(json?.error?.message ?? NETWORK_ERROR);
  return json;
}

/**
 * Ask the server to cancel. A 409 means the job finished first; the caller should show that result.
 * @returns {Promise<{ outcome: 'cancelled' } | { outcome: 'too-late', state: object }>}
 */
export async function cancelJob(jobId) {
  const { response, json } = await request(`/api/generations/${jobId}`, { method: 'DELETE' });
  if (response.status === 409) return { outcome: 'too-late', state: json };
  if (!response.ok) throw new Error(json?.error?.message ?? NETWORK_ERROR);
  return { outcome: 'cancelled' };
}

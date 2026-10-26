import { errorResponse, jsonResponse } from '@/lib/mock/http';
import { decodeJobId } from '@/lib/mock/job-id';
import { computeJobState, getJobSpeed } from '@/lib/mock/job-engine';

const notFound = () => errorResponse('not_found', 'No such job.', 404);

/** Current state of a job, worked out from its id and the clock. */
export async function GET(request, { params }) {
  const { id } = await params;
  const payload = decodeJobId(id);
  if (!payload) return notFound();
  return jsonResponse({ jobId: id, ...computeJobState(payload, Date.now(), getJobSpeed()) });
}

/**
 * Cancel a job. If it already finished, say so honestly (409 with the final state)
 * so the UI never claims a cancel that didn't happen.
 */
export async function DELETE(request, { params }) {
  const { id } = await params;
  const payload = decodeJobId(id);
  if (!payload) return notFound();
  const state = computeJobState(payload, Date.now(), getJobSpeed());
  if (state.status === 'done' || state.status === 'failed') {
    return jsonResponse({ jobId: id, ...state }, 409);
  }
  return jsonResponse({ jobId: id, status: 'cancelled' });
}

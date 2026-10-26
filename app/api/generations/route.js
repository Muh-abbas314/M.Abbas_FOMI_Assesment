import { errorResponse, jsonResponse } from '@/lib/mock/http';
import { encodeJobId } from '@/lib/mock/job-id';
import { resolveProfile, shouldFail } from '@/lib/mock/job-engine';
import { matchTags } from '@/lib/mock/media-library';
import { getSeedFeed } from '@/lib/mock/seed-feed';
import { validateCreateBody } from '@/lib/mock/validate';

/** The returning user's feed. */
export async function GET() {
  return jsonResponse({ items: getSeedFeed() });
}

/** Start a generation. Nothing is stored: the job id carries everything. */
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return errorResponse('invalid_body', 'Body must be valid JSON.', 400);
  }

  const result = validateCreateBody(body);
  if (!result.ok) return errorResponse('invalid_body', result.error, 400);

  const { mode, prompt, settings, attempt } = result.value;
  const createdAt = Date.now();
  const jobId = encodeJobId({
    p: resolveProfile(mode, settings.quality),
    n: settings.count,
    ar: settings.aspectRatio,
    t: createdAt,
    s: settings.seed ?? Math.floor(Math.random() * 2 ** 31),
    f: shouldFail(prompt, attempt) ? 1 : 0,
    k: matchTags(prompt),
  });

  return jsonResponse({ jobId, createdAt, status: 'queued' }, 201);
}

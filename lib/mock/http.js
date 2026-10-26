/** JSON response that is never cached: job state changes every second. */
export function jsonResponse(body, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export function errorResponse(code, message, status) {
  return jsonResponse({ error: { code, message } }, status);
}

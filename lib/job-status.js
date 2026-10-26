/** Still running: worth polling. */
export function isActiveStatus(status) {
  return status === 'queued' || status === 'generating';
}

/** Finished one way or another: stop polling. */
export function isTerminalStatus(status) {
  return status === 'done' || status === 'failed' || status === 'cancelled';
}

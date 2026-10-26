'use client';

import { useState } from 'react';

const WORDS = { done: 'is ready', failed: 'failed', cancelled: 'stopped' };

/**
 * Screen-reader updates for background jobs. Always mounted (the queue panel may be closed), it
 * speaks when a job's status changes to finished, failed or stopped.
 * `entries` must be memoised by the caller; a new array means "something changed".
 */
export default function Announcer({ entries }) {
  const [previous, setPrevious] = useState(entries);
  const [message, setMessage] = useState('');

  if (entries !== previous) {
    const before = new Map(previous.map((e) => [e.key, e.status]));
    const changed = entries.find((e) => before.has(e.key) && before.get(e.key) !== e.status && WORDS[e.status]);
    setPrevious(entries);
    if (changed) setMessage(`${changed.title} ${WORDS[changed.status]}`);
  }

  return (
    <div role="status" aria-live="polite" className="sr-only">
      {message}
    </div>
  );
}

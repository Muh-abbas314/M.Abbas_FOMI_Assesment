'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { locate, totalDuration } from './timeline';

const MAX_RATE = 4;
const SHUTTLE_BACK_SECONDS = 2;

/**
 * The board's playhead. A requestAnimationFrame clock is the source of truth, not video events:
 * slates (no video) and clips longer or shorter than their shot all advance at the same honest pace.
 * `seekId` changes on every jump, so players know to resync instead of drifting.
 */
export function useBoardPlayback(timeline) {
  const total = totalDuration(timeline);
  const [clock, setClock] = useState({ playing: false, t: 0, rate: 1, seekId: 0 });
  const totalRef = useRef(total);

  useEffect(() => {
    totalRef.current = total;
  }, [total]);

  useEffect(() => {
    if (!clock.playing) return undefined;
    let frame;
    let last = performance.now();
    const tick = (now) => {
      const dt = (now - last) / 1000;
      last = now;
      setClock((c) => {
        if (!c.playing) return c;
        const t = c.t + dt * c.rate;
        return t >= totalRef.current ? { ...c, t: totalRef.current, playing: false } : { ...c, t };
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [clock.playing]);

  const play = useCallback(() => {
    setClock((c) => {
      const restart = c.t >= totalRef.current;
      return { ...c, playing: totalRef.current > 0, t: restart ? 0 : c.t, seekId: restart ? c.seekId + 1 : c.seekId };
    });
  }, []);

  const pause = useCallback(() => setClock((c) => ({ ...c, playing: false })), []);

  const toggle = useCallback(() => {
    setClock((c) => {
      if (c.playing) return { ...c, playing: false };
      const restart = c.t >= totalRef.current;
      return { ...c, playing: totalRef.current > 0, t: restart ? 0 : c.t, seekId: restart ? c.seekId + 1 : c.seekId };
    });
  }, []);

  const seek = useCallback((t) => {
    setClock((c) => ({ ...c, t: Math.min(Math.max(t, 0), totalRef.current), seekId: c.seekId + 1 }));
  }, []);

  const shuttle = useCallback((key) => {
    setClock((c) => {
      if (key === 'k') return { ...c, playing: false, rate: 1 };
      if (key === 'j') return { ...c, t: Math.max(0, c.t - SHUTTLE_BACK_SECONDS), seekId: c.seekId + 1 };
      if (!c.playing) {
        const restart = c.t >= totalRef.current;
        return { ...c, playing: totalRef.current > 0, rate: 1, t: restart ? 0 : c.t, seekId: restart ? c.seekId + 1 : c.seekId };
      }
      return { ...c, rate: Math.min(MAX_RATE, c.rate * 2) };
    });
  }, []);

  const { index, offset } = useMemo(() => locate(timeline, clock.t), [timeline, clock.t]);

  return { ...clock, total, index, offset, play, pause, toggle, seek, shuttle };
}

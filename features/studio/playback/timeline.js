/**
 * Lay the board's shots end to end. A shot without a finished keeper becomes a slate (media: null),
 * so the board always plays in full, even before every shot has a take.
 * @returns {import('@/features/studio/types').Segment[]}
 */
export function buildTimeline(shots) {
  let start = 0;
  return shots.map((shot, index) => {
    const keeper = shot.takes.find((t) => t.id === shot.chosenTakeId && t.status === 'done');
    const segment = {
      shotId: shot.id,
      number: index + 1,
      title: shot.title,
      start,
      end: start + shot.durationSec,
      durationSec: shot.durationSec,
      media: keeper?.media ?? null,
      transition: shot.transition,
    };
    start = segment.end;
    return segment;
  });
}

export function totalDuration(timeline) {
  return timeline.at(-1)?.end ?? 0;
}

/** Which segment is playing at time `t`, and how far into it. `t` is clamped to the board. */
export function locate(timeline, t) {
  if (timeline.length === 0) return { index: 0, offset: 0 };
  const time = Math.min(Math.max(t, 0), totalDuration(timeline));
  let index = timeline.findIndex((segment) => time < segment.end);
  if (index === -1) index = timeline.length - 1;
  return { index, offset: time - timeline[index].start };
}

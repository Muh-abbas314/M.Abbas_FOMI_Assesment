/** Credits per second of video. Drafts are cheap so trying ideas is cheap; finals cost 6×. */
export const CREDIT_RATES = { draft: 1, final: 6 };

export function totalSeconds(shots) {
  return shots.reduce((sum, shot) => sum + shot.durationSec, 0);
}

export function takeCost(shot) {
  return shot.durationSec * CREDIT_RATES.draft;
}

export function finalCost(shots) {
  return totalSeconds(shots) * CREDIT_RATES.final;
}

/** Shot numbers (1-based) that have no finished keeper yet. */
export function missingTakeShots(shots) {
  return shots
    .map((shot, index) => ({ shot, number: index + 1 }))
    .filter(({ shot }) => !shot.takes.some((t) => t.id === shot.chosenTakeId && t.status === 'done'))
    .map(({ number }) => number);
}

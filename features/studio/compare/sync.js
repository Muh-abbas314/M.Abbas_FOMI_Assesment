/** Put every video at time `t` (clamped to each one's length once it's known). */
export function syncVideos(videos, t) {
  for (const video of videos) {
    if (!video) continue;
    video.currentTime = Math.min(t, video.duration || t);
  }
}

/**
 * Two players drift apart by a few frames as they decode. When the follower is off by more than
 * `tolerance` seconds, snap it back to the leader. Returns whether it had to.
 */
export function driftCorrect(leader, follower, tolerance = 0.08) {
  if (!leader || !follower) return false;
  if (Math.abs(follower.currentTime - leader.currentTime) <= tolerance) return false;
  follower.currentTime = leader.currentTime;
  return true;
}

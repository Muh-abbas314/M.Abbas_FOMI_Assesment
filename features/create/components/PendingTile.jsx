import Skeleton from '@/components/ui/Skeleton';
import { cssAspectRatio } from '@/lib/aspect';

/** Placeholder in the exact shape of the coming result, so nothing jumps when it arrives. */
export default function PendingTile({ aspectRatio }) {
  return <Skeleton data-testid="pending-tile" aria-hidden className="rounded-tile" style={{ aspectRatio: cssAspectRatio(aspectRatio) }} />;
}

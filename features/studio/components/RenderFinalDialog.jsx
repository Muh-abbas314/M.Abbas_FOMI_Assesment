import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import { formatCredits, formatDuration } from '@/lib/format';
import { finalCost, missingTakeShots, totalSeconds } from '../cost';

function shotList(numbers) {
  if (numbers.length === 1) return `shot ${numbers[0]}`;
  return `shots ${numbers.slice(0, -1).join(', ')} and ${numbers.at(-1)}`;
}

/** The point of commitment: what you're rendering, what it costs, and what's left after. */
export default function RenderFinalDialog({ open, shots, credits, onConfirm, onClose, onJumpToShot }) {
  const missing = missingTakeShots(shots);
  const cost = finalCost(shots);
  const affordable = credits >= cost;
  const ready = missing.length === 0 && affordable;

  return (
    <Dialog open={open} onClose={onClose} title="Render the final film">
      <div className="flex flex-col gap-1 rounded-card bg-studio-bg p-4">
        <p className="text-[14px] font-medium tabular-nums">{`${shots.length} shots · ${formatDuration(totalSeconds(shots))} · ${cost} credits`}</p>
        <p className="text-[12px] tabular-nums text-studio-ink-muted">{`Balance after: ${formatCredits(credits - cost)}`}</p>
      </div>

      {missing.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-[13px]">{`Pick a take for ${shotList(missing)} first`}</p>
          <div className="flex flex-wrap gap-1.5">
            {missing.map((n) => (
              <Button key={n} variant="studio-ghost" size="sm" className="h-7 border border-studio-line px-3" onClick={() => onJumpToShot(n)}>
                {`Go to shot ${n}`}
              </Button>
            ))}
          </div>
        </div>
      )}
      {missing.length === 0 && !affordable && <p className="text-[13px]">Not enough credits</p>}

      <p className="text-[12px] leading-relaxed text-studio-ink-muted">
        Finals take longer and cost 6× a draft per second. You can keep working while it renders, and stopping it refunds the credits.
      </p>

      <div className="flex justify-end gap-2">
        <Button variant="studio-ghost" onClick={onClose}>
          Not yet
        </Button>
        <Button variant="studio" disabled={!ready} onClick={onConfirm}>
          Render final
        </Button>
      </div>
    </Dialog>
  );
}

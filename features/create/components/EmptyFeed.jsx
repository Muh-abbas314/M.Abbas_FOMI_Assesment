import { Image as ImageIcon, Video } from 'lucide-react';
import { EXAMPLE_PROMPTS } from '../examples';

/** First-run feed: an invitation to act, with starters that drop straight into the composer. */
export default function EmptyFeed({ onPick }) {
  return (
    <section aria-labelledby="empty-title" className="flex flex-col items-start gap-5 rounded-panel bg-panel/60 p-6 lg:p-8">
      <div>
        <h2 id="empty-title" className="text-[18px] font-semibold text-ink">
          Start with an idea
        </h2>
        <p className="mt-1 text-[13px] text-ink-muted">Pick an example or describe your own. Press ⌘/Ctrl + Enter to generate.</p>
      </div>
      <ul className="grid w-full gap-2 sm:grid-cols-2">
        {EXAMPLE_PROMPTS.map(({ mode, prompt }) => {
          const Icon = mode === 'video' ? Video : ImageIcon;
          return (
            <li key={prompt}>
              <button
                type="button"
                onClick={() => onPick({ mode, prompt })}
                className="flex h-full w-full items-start gap-3 rounded-card border border-line bg-surface p-3.5 text-left text-[13px] leading-snug text-ink transition-[border-color,transform] duration-150 hover:border-ink/20 active:scale-[0.99]"
              >
                <Icon aria-hidden size={16} strokeWidth={1.75} className="mt-0.5 shrink-0 text-accent-ink" />
                <span>{prompt}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

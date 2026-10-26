'use client';

import { useCallback, useMemo, useState } from 'react';
import Feed from './components/Feed';
import HistoryStrip from './components/HistoryStrip';
import TopBar from './components/TopBar';

const HISTORY_LIMIT = 20;

/** Keep `?mode=` in the address bar without a server round-trip. */
function syncModeToUrl(tab) {
  const url = tab === 'image' || tab === 'video' ? `?mode=${tab}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

export default function CreateWorkspace({ initialFeed, initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const items = initialFeed;

  const history = useMemo(
    () =>
      items
        .filter((g) => g.status === 'done')
        .flatMap((g) => g.results.map((media) => ({ generationId: g.id, media })))
        .slice(0, HISTORY_LIMIT),
    [items],
  );

  const selectTab = useCallback((tab) => {
    setActiveTab(tab);
    syncModeToUrl(tab);
    if (tab === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const noop = useCallback(() => {}, []);

  return (
    <div className="min-h-dvh">
      <TopBar activeTab={activeTab} onSelectTab={selectTab} onOpenGallery={noop} />

      <div className="mx-auto max-w-[1680px] px-4 lg:px-6 2xl:px-8 3xl:max-w-[1760px]">
        <div className="z-20 pb-3 pt-1 md:sticky md:top-[var(--topbar-h)]">
          <HistoryStrip items={history} onSelect={noop} onViewAll={noop} />
        </div>

        <div className="items-start gap-6 lg:grid lg:grid-cols-[288px_1fr] 2xl:grid-cols-[320px_1fr]">
          <aside
            aria-label="Composer"
            className="sticky top-[calc(var(--topbar-h)+var(--history-h)+16px)] hidden h-[calc(100dvh-var(--topbar-h)-var(--history-h)-32px)] rounded-panel bg-panel lg:block"
          />
          <main id="feed" className="min-w-0 pb-40 lg:pb-12">
            <h1 className="sr-only">Create</h1>
            <Feed items={items} onOpen={noop} />
          </main>
        </div>
      </div>
    </div>
  );
}

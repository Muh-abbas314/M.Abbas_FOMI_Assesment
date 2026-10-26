'use client';

import { useCallback, useReducer, useRef, useState } from 'react';
import Composer from './composer/Composer';
import { composerReducer, initialComposerState } from './composer/composer-state';
import Feed from './components/Feed';
import HistoryStrip from './components/HistoryStrip';
import TopBar from './components/TopBar';
import { useGenerations } from './state/GenerationsProvider';

/** Keep `?mode=` in the address bar without a server round-trip. */
function syncModeToUrl(tab) {
  const url = tab === 'image' || tab === 'video' ? `?mode=${tab}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

export default function CreateWorkspace({ initialTab }) {
  const { items, history, isSubmitting, generate, cancel, retry } = useGenerations();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [composer, dispatchComposer] = useReducer(composerReducer, initialTab === 'video' ? 'video' : 'image', initialComposerState);
  const promptRef = useRef(null);

  // The Image/Video tabs and the composer's mode switch are one piece of state.
  const selectTab = useCallback((tab) => {
    setActiveTab(tab);
    syncModeToUrl(tab);
    if (tab === 'image' || tab === 'video') dispatchComposer({ type: 'setMode', mode: tab });
    if (tab === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const changeMode = useCallback((mode) => {
    dispatchComposer({ type: 'setMode', mode });
    setActiveTab(mode);
    syncModeToUrl(mode);
  }, []);

  const reuse = useCallback(
    (generation) => {
      dispatchComposer({ type: 'loadGeneration', generation });
      setActiveTab(generation.mode);
      syncModeToUrl(generation.mode);
      promptRef.current?.focus();
    },
    [],
  );

  const handleGenerate = useCallback(
    (body) => {
      generate(body);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [generate],
  );

  const noop = useCallback(() => {}, []);

  return (
    <div className="min-h-dvh">
      <TopBar activeTab={activeTab} onSelectTab={selectTab} onOpenGallery={noop} />

      <div className="mx-auto max-w-[1680px] px-4 lg:px-6 2xl:px-8 3xl:max-w-[1760px]">
        <div className="z-20 pb-3 pt-1 md:sticky md:top-[var(--topbar-h)]">
          <HistoryStrip items={history} onSelect={noop} onViewAll={noop} />
        </div>

        <div className="items-start gap-6 lg:grid lg:grid-cols-[288px_1fr] 2xl:grid-cols-[320px_1fr]">
          <div className="sticky top-[calc(var(--topbar-h)+var(--history-h)+16px)] hidden max-h-[calc(100dvh-var(--topbar-h)-var(--history-h)-32px)] overflow-y-auto rounded-panel lg:block">
            <Composer
              state={composer}
              dispatch={dispatchComposer}
              onModeChange={changeMode}
              onGenerate={handleGenerate}
              isSubmitting={isSubmitting}
              promptRef={promptRef}
              className="min-h-[calc(100dvh-var(--topbar-h)-var(--history-h)-32px)]"
            />
          </div>
          <main id="feed" className="min-w-0 pb-40 lg:pb-12">
            <h1 className="sr-only">Create</h1>
            <Feed items={items} onOpen={noop} onReuse={reuse} onCancel={cancel} onRetry={retry} />
          </main>
        </div>
      </div>
    </div>
  );
}

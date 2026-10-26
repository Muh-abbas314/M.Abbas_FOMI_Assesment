'use client';

import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import Composer from './composer/Composer';
import ComposerDock from './composer/ComposerDock';
import { composerReducer, initialComposerState } from './composer/composer-state';
import EmptyFeed from './components/EmptyFeed';
import Feed from './components/Feed';
import HistoryStrip from './components/HistoryStrip';
import Lightbox from './components/Lightbox';
import TopBar from './components/TopBar';
import { useGenerations } from './state/GenerationsProvider';
import { selectHistory } from './state/generations-reducer';

const HIGHLIGHT_MS = 1200;

/** Keep `?mode=` in the address bar without a server round-trip. */
function syncModeToUrl(tab) {
  const url = tab === 'image' || tab === 'video' ? `?mode=${tab}` : window.location.pathname;
  window.history.replaceState(null, '', url);
}

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function CreateWorkspace({ initialTab }) {
  const { items, history, isSubmitting, generate, cancel, retry } = useGenerations();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [composer, dispatchComposer] = useReducer(composerReducer, initialTab === 'video' ? 'video' : 'image', initialComposerState);
  const [viewerIndex, setViewerIndex] = useState(null);
  const [highlightedId, setHighlightedId] = useState(null);
  const railPromptRef = useRef(null);
  const dockPromptRef = useRef(null);
  const highlightTimer = useRef(null);

  // Every finished result, newest first: the viewer and Gallery walk through this list.
  const viewerItems = useMemo(
    () => selectHistory(items, { limit: Infinity }).map(({ generationId, media }) => ({ media, generation: items.find((g) => g.id === generationId) })),
    [items],
  );

  useEffect(() => () => clearTimeout(highlightTimer.current), []);

  // The Image/Video tabs and the composer's mode switch are one piece of state.
  const selectTab = useCallback((tab) => {
    setActiveTab(tab);
    syncModeToUrl(tab);
    if (tab === 'image' || tab === 'video') dispatchComposer({ type: 'setMode', mode: tab });
    if (tab === 'home') window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, []);

  const changeMode = useCallback((mode) => {
    dispatchComposer({ type: 'setMode', mode });
    setActiveTab(mode);
    syncModeToUrl(mode);
  }, []);

  // Rail and dock share one draft; focus whichever one this screen size is showing.
  const focusPrompt = useCallback(() => {
    const visible = [railPromptRef.current, dockPromptRef.current].find((el) => el && el.offsetParent !== null);
    visible?.focus();
  }, []);

  const pickExample = useCallback(
    ({ mode, prompt }) => {
      changeMode(mode);
      dispatchComposer({ type: 'setPrompt', prompt });
      focusPrompt();
    },
    [changeMode, focusPrompt],
  );

  const reuse = useCallback(
    (generation) => {
      dispatchComposer({ type: 'loadGeneration', generation });
      setActiveTab(generation.mode);
      syncModeToUrl(generation.mode);
      focusPrompt();
    },
    [focusPrompt],
  );

  const useAsReference = useCallback(
    (media) => {
      dispatchComposer({ type: 'setReference', media });
      focusPrompt();
    },
    [focusPrompt],
  );

  const handleGenerate = useCallback(
    (body) => {
      generate(body);
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    },
    [generate],
  );

  const openViewer = useCallback(
    (generationId, resultIndex) => {
      const first = viewerItems.findIndex((item) => item.generation.id === generationId);
      if (first >= 0) setViewerIndex(first + resultIndex);
    },
    [viewerItems],
  );

  const openGallery = useCallback(() => {
    if (viewerItems.length) setViewerIndex(0);
  }, [viewerItems.length]);

  const jumpToGeneration = useCallback((generationId) => {
    document.getElementById(`gen-${generationId}`)?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    setHighlightedId(null);
    requestAnimationFrame(() => setHighlightedId(generationId));
    clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => setHighlightedId(null), HIGHLIGHT_MS);
  }, []);

  return (
    <div className="min-h-dvh">
      <TopBar activeTab={activeTab} onSelectTab={selectTab} onOpenGallery={openGallery} />

      <div className="mx-auto max-w-[1680px] px-4 lg:px-6 2xl:px-8 3xl:max-w-[1760px]">
        {history.length > 0 && (
          <div className="z-20 pb-3 pt-1 md:sticky md:top-[var(--topbar-h)]">
            <HistoryStrip items={history} onSelect={jumpToGeneration} onViewAll={openGallery} />
          </div>
        )}

        <div className="items-start gap-6 lg:grid lg:grid-cols-[288px_1fr] 2xl:grid-cols-[320px_1fr]">
          <div className="sticky top-[calc(var(--topbar-h)+var(--history-h)+16px)] hidden max-h-[calc(100dvh-var(--topbar-h)-var(--history-h)-32px)] overflow-y-auto rounded-panel lg:block">
            <Composer
              state={composer}
              dispatch={dispatchComposer}
              onModeChange={changeMode}
              onGenerate={handleGenerate}
              isSubmitting={isSubmitting}
              promptRef={railPromptRef}
              className="min-h-[calc(100dvh-var(--topbar-h)-var(--history-h)-32px)]"
            />
          </div>
          <main id="feed" className="min-w-0 pb-40 lg:pb-12">
            <h1 className="sr-only">Create</h1>
            {items.length === 0 ? (
              <EmptyFeed onPick={pickExample} />
            ) : (
              <Feed items={items} highlightedId={highlightedId} onOpen={openViewer} onReuse={reuse} onCancel={cancel} onRetry={retry} />
            )}
          </main>
        </div>
      </div>

      <ComposerDock
        state={composer}
        dispatch={dispatchComposer}
        onModeChange={changeMode}
        onGenerate={handleGenerate}
        isSubmitting={isSubmitting}
        promptRef={dockPromptRef}
      />

      {viewerIndex !== null && viewerItems[viewerIndex] && (
        <Lightbox
          items={viewerItems}
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          onClose={() => setViewerIndex(null)}
          onUseAsReference={useAsReference}
        />
      )}
    </div>
  );
}

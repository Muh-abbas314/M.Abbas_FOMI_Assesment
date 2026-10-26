'use client';

import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { loadJSON, saveJSON } from '@/lib/storage';
import { STORAGE_KEY_STUDIO } from '../studio-options';
import { initStudioState, isStudioStateLike, reviveStudioState, studioReducer } from './studio-reducer';

const StudioContext = createContext(null);

export function useStudio() {
  const value = useContext(StudioContext);
  if (!value) throw new Error('useStudio must be used inside <StudioProvider>.');
  return value;
}

/** Owns the project. It is saved on every change, so a returning director picks up where they left off. */
export function StudioProvider({ initialProject, children }) {
  const [state, dispatch] = useReducer(studioReducer, initialProject, initStudioState);
  const hydratedRef = useRef(false);

  // Save only after hydration, so the first render can't overwrite what's stored.
  useEffect(() => {
    if (hydratedRef.current) saveJSON(STORAGE_KEY_STUDIO, state);
  }, [state]);

  useEffect(() => {
    const saved = loadJSON(STORAGE_KEY_STUDIO, null);
    if (isStudioStateLike(saved)) dispatch({ type: 'hydrate', state: reviveStudioState(saved) });
    hydratedRef.current = true;
  }, []);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

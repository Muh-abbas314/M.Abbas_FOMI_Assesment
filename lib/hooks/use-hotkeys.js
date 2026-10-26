'use client';

import { useEffect, useRef } from 'react';

/** keydown → 'Mod+Enter' | 'Alt+ArrowLeft' | 'Space' | '?' | 'j' … (Mod = ⌘ on Mac, Ctrl elsewhere). */
export function normalizeKey(event) {
  const key = event.key === ' ' ? 'Space' : event.key;
  const mod = event.metaKey || event.ctrlKey ? 'Mod+' : '';
  const alt = event.altKey ? 'Alt+' : '';
  return `${mod}${alt}${key}`;
}

// Places where keys already mean something: typing, and controls that use arrows themselves.
const OWNS_KEYS = 'input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="radiogroup"], [role="slider"]';
// Space activates these natively; don't steal it.
const OWNS_SPACE = 'button, a, [role="button"], [role="radio"], video';

/**
 * Global keyboard shortcuts. Ignores keys while you type in a field (except ⌘/Ctrl combos, which
 * never type text) and leaves Space to buttons and links.
 */
export function useHotkeys(bindings, { enabled = true } = {}) {
  const bindingsRef = useRef(bindings);
  useEffect(() => {
    bindingsRef.current = bindings;
  });

  useEffect(() => {
    if (!enabled) return undefined;
    function onKeyDown(event) {
      if (event.defaultPrevented || event.isComposing) return;
      const key = normalizeKey(event);
      const handler = bindingsRef.current[key];
      if (!handler) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(OWNS_KEYS) && !key.startsWith('Mod+')) return;
      if (key === 'Space' && target?.closest(OWNS_SPACE)) return;
      event.preventDefault();
      handler(event);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
}

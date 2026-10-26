'use client';

import { useEffect, useState } from 'react';

/**
 * True once `ref`'s element comes within `rootMargin` of the viewport.
 * With `once` (the default) it stays true, so media mounted on first sight isn't torn down and refetched.
 */
export function useInView(ref, { rootMargin = '200px', once = true } = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin, once]);

  return inView;
}

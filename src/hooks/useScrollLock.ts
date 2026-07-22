import { useEffect } from 'react';

/**
 * Locks scrolling on `document.body` while `active` is true, restoring the
 * previous value on deactivation/unmount.
 */
export function useScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [active]);
}

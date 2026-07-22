import { useEffect } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** Returns the tabbable elements within `container`, in DOM order. */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

/**
 * Traps keyboard focus within `containerRef` while `active` is true:
 *  - moves focus into the container on activation,
 *  - wraps Tab / Shift+Tab at the boundaries,
 *  - restores focus to the previously focused element on deactivation.
 *
 * The container element should be focusable (e.g. `tabIndex={-1}`).
 */
export function useFocusTrap(active: boolean, containerRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    if (!active) return;
    const container = containerRef.current;
    /* c8 ignore next -- container is always mounted while active */
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    const focusables = getFocusableElements(container);
    (focusables[0] ?? container).focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab') return;
      const items = getFocusableElements(container as HTMLElement);
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      /* c8 ignore next -- activeElement is always an element in practice */
      previouslyFocused?.focus();
    };
  }, [active, containerRef]);
}

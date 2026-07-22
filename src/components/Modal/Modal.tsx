import { useEffect, useId, useRef } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/cn';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useScrollLock } from '../../hooks/useScrollLock';

export interface ModalProps {
  /** Whether the modal is visible. */
  isOpen: boolean;
  /** Called when the modal requests to close (overlay, Escape, or close button). */
  onClose: () => void;
  /** Title rendered as a heading and used for `aria-labelledby`. */
  title?: string;
  /** Modal body content. */
  children: ReactNode;
  /** Close when the overlay (backdrop) is clicked. @default true */
  closeOnOverlayClick?: boolean;
  /** Close when the Escape key is pressed. @default true */
  closeOnEscape?: boolean;
  /** Render the built-in close (×) button. @default true */
  showCloseButton?: boolean;
  /** Class applied to the overlay/backdrop. */
  overlayClassName?: string;
  /** Class applied to the dialog panel. */
  className?: string;
  /** Accessible label, used when no `title` is provided. */
  'aria-label'?: string;
  /** Id of an element describing the dialog. */
  'aria-describedby'?: string;
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/**
 * Accessible modal dialog rendered in a portal on `document.body`.
 *
 * Handles focus trapping + restoration, body scroll locking, Escape-to-close,
 * and overlay-click-to-close, and exposes `role="dialog"` with `aria-modal`.
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  overlayClassName,
  className,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useScrollLock(isOpen);
  useFocusTrap(isOpen, panelRef);

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;
  /* c8 ignore next -- document is defined in every supported (browser/jsdom) runtime */
  if (typeof document === 'undefined') return null;

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4',
        overlayClassName,
      )}
      onClick={handleOverlayClick}
      data-testid="modal-overlay"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : ariaLabel}
        aria-describedby={ariaDescribedBy}
        tabIndex={-1}
        className={cn(
          'relative w-full max-w-lg rounded-rgt-lg bg-rgt-bg text-rgt-fg shadow-xl outline-none',
          className,
        )}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-rgt-sm text-rgt-secondary hover:bg-rgt-muted hover:text-rgt-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rgt-ring"
          >
            <CloseIcon />
          </button>
        )}
        {title && (
          <h2 id={titleId} className="px-6 pt-6 pr-12 text-lg font-semibold">
            {title}
          </h2>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

import { forwardRef } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type CardShadow = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Content rendered in the header region, above a divider. */
  header?: ReactNode;
  /** Content rendered in the footer region, below a divider. */
  footer?: ReactNode;
  /** Body content. */
  children?: ReactNode;
  /** Drop shadow depth. @default 'sm' */
  shadow?: CardShadow;
  /**
   * Makes the whole card activatable: adds hover/focus affordances, exposes
   * `role="button"`, and activates `onClick` with Enter or Space.
   *
   * Avoid placing other interactive elements inside a clickable card.
   */
  clickable?: boolean;
  /** Class applied to the body wrapper. */
  bodyClassName?: string;
}

const shadowClasses: Record<CardShadow, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

/**
 * Surface container with optional header and footer regions.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    header,
    footer,
    children,
    shadow = 'sm',
    clickable = false,
    className,
    bodyClassName,
    onKeyDown,
    ...rest
  },
  ref,
) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (clickable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      event.currentTarget.click();
    }
    onKeyDown?.(event);
  }

  return (
    <div
      ref={ref}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        'overflow-hidden rounded-rgt-lg border border-rgt-border bg-rgt-bg text-rgt-fg',
        shadowClasses[shadow],
        clickable &&
          'cursor-pointer transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rgt-ring',
        className,
      )}
      {...rest}
    >
      {header && (
        <div className="border-b border-rgt-border px-6 py-4 font-semibold">{header}</div>
      )}
      <div className={cn('px-6 py-4', bodyClassName)}>{children}</div>
      {footer && <div className="border-t border-rgt-border px-6 py-4">{footer}</div>}
    </div>
  );
});

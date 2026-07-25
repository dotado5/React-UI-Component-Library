import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Colour scheme and default icon. @default 'info' */
  variant?: AlertVariant;
  /** Optional bold heading above the content. */
  title?: string;
  /** Alert body content. */
  children?: ReactNode;
  /** When provided, renders a dismiss button that calls this handler. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. @default 'Dismiss' */
  dismissLabel?: string;
  /** Custom icon, replacing the variant default. */
  icon?: ReactNode;
  /** Render an icon at all. @default true */
  showIcon?: boolean;
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'bg-rgt-info-subtle text-rgt-info border-rgt-info',
  success: 'bg-rgt-success-subtle text-rgt-success border-rgt-success',
  warning: 'bg-rgt-warning-subtle text-rgt-warning border-rgt-warning',
  error: 'bg-rgt-danger-subtle text-rgt-danger-hover border-rgt-danger',
};

const iconPaths: Record<AlertVariant, ReactNode> = {
  info: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </>
  ),
  success: (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </>
  ),
  warning: (
    <>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </>
  ),
};

function AlertIcon({ variant }: { variant: AlertVariant }) {
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
      data-testid="alert-icon"
      className="mt-0.5 shrink-0"
    >
      {iconPaths[variant]}
    </svg>
  );
}

/**
 * Contextual feedback message.
 *
 * Errors default to `role="alert"` (announced assertively); the other variants
 * use `role="status"`. Pass `role` explicitly to override.
 */
export function Alert({
  variant = 'info',
  title,
  children,
  onDismiss,
  dismissLabel = 'Dismiss',
  icon,
  showIcon = true,
  className,
  role,
  ...rest
}: AlertProps) {
  const resolvedRole = role ?? (variant === 'error' ? 'alert' : 'status');

  return (
    <div
      role={resolvedRole}
      className={cn(
        'flex items-start gap-3 rounded-rgt-md border-l-4 p-4 text-sm',
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {showIcon && (icon ?? <AlertIcon variant={variant} />)}
      <div className="flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className="-mr-1 -mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-rgt-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}

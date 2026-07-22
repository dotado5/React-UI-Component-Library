import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style of the button. @default 'primary' */
  variant?: ButtonVariant;
  /** Size of the button. @default 'md' */
  size?: ButtonSize;
  /** Show a loading spinner and prevent interaction. @default false */
  isLoading?: boolean;
  /** Accessible label announced while loading. @default 'Loading' */
  loadingLabel?: string;
  /** Icon rendered before the label. */
  leftIcon?: ReactNode;
  /** Icon rendered after the label. */
  rightIcon?: ReactNode;
  /** Stretch the button to fill its container. @default false */
  fullWidth?: boolean;
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap ' +
  'rounded-rgt-md transition-colors select-none ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rgt-ring ' +
  'disabled:opacity-50 disabled:pointer-events-none';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-rgt-primary text-white hover:bg-rgt-primary-hover',
  secondary: 'bg-rgt-secondary text-white hover:bg-rgt-secondary-hover',
  danger: 'bg-rgt-danger text-white hover:bg-rgt-danger-hover',
  outline: 'bg-transparent text-rgt-fg border border-rgt-border hover:bg-rgt-muted',
  ghost: 'bg-transparent text-rgt-fg hover:bg-rgt-muted',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
      data-testid="button-spinner"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/**
 * Accessible, themeable button.
 *
 * Forwards its ref to the underlying `<button>` and spreads all native button
 * props. While `isLoading`, the button is disabled and exposes `aria-busy`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    loadingLabel = 'Loading',
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      {...rest}
    >
      {isLoading ? (
        <>
          <LoadingSpinner />
          <span className="sr-only">{loadingLabel}</span>
        </>
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
});

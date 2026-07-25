import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type SpinnerSize = 'sm' | 'md' | 'lg';
export type SpinnerVariant = 'primary' | 'secondary' | 'danger' | 'current';

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Spinner size. @default 'md' */
  size?: SpinnerSize;
  /** Colour scheme. `current` inherits the surrounding text colour. @default 'primary' */
  variant?: SpinnerVariant;
  /** Accessible label announced to screen readers. @default 'Loading' */
  label?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const variantClasses: Record<SpinnerVariant, string> = {
  primary: 'text-rgt-primary',
  secondary: 'text-rgt-secondary',
  danger: 'text-rgt-danger',
  current: 'text-current',
};

/**
 * Indeterminate loading indicator. Exposes `role="status"` with a visually
 * hidden label so assistive technology announces the loading state.
 */
export function Spinner({
  size = 'md',
  variant = 'primary',
  label = 'Loading',
  className,
  ...rest
}: SpinnerProps) {
  return (
    <span role="status" className={cn('inline-flex items-center', className)} {...rest}>
      <svg
        aria-hidden="true"
        data-testid="spinner-icon"
        className={cn('animate-spin', sizeClasses[size], variantClasses[variant])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

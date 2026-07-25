import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Colour scheme. @default 'neutral' */
  variant?: BadgeVariant;
  /** Badge size. @default 'md' */
  size?: BadgeSize;
  /** Use a fully rounded (pill) shape. @default false */
  rounded?: boolean;
  /** Show a leading dot indicator. @default false */
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-rgt-muted text-rgt-fg',
  primary: 'bg-rgt-primary-subtle text-rgt-primary',
  success: 'bg-rgt-success-subtle text-rgt-success',
  warning: 'bg-rgt-warning-subtle text-rgt-warning',
  danger: 'bg-rgt-danger-subtle text-rgt-danger-hover',
  info: 'bg-rgt-info-subtle text-rgt-info',
};

const dotClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-rgt-fg',
  primary: 'bg-rgt-primary',
  success: 'bg-rgt-success',
  warning: 'bg-rgt-warning',
  danger: 'bg-rgt-danger',
  info: 'bg-rgt-info',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1 gap-1.5',
};

/**
 * Small status/label indicator. Purely presentational — it renders a `<span>`
 * and spreads native span props.
 */
export function Badge({
  variant = 'neutral',
  size = 'md',
  rounded = false,
  dot = false,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium whitespace-nowrap',
        rounded ? 'rounded-full' : 'rounded-rgt-sm',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    >
      {dot && (
        <span
          aria-hidden="true"
          data-testid="badge-dot"
          className={cn('inline-block h-1.5 w-1.5 shrink-0 rounded-full', dotClasses[variant])}
        />
      )}
      {children}
    </span>
  );
}

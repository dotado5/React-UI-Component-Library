import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Visible label associated with the switch. */
  label?: string;
  /** Class applied to the outer wrapper element. */
  containerClassName?: string;
}

/**
 * Accessible on/off switch. Built on a native checkbox with `role="switch"`, so
 * it is keyboard operable (Space), participates in forms, and supports both
 * controlled and uncontrolled usage natively.
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, containerClassName, className, id, disabled, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;

  return (
    <div className={cn('flex items-center gap-2', containerClassName)}>
      <span className={cn('relative inline-block h-6 w-11 shrink-0', disabled && 'opacity-50')}>
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          disabled={disabled}
          className={cn(
            'peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed',
            className,
          )}
          {...rest}
        />
        {/* Track */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-rgt-border transition-colors peer-checked:bg-rgt-primary peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-rgt-ring"
        />
        {/* Thumb */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5"
        />
      </span>
      {label && (
        <label htmlFor={inputId} className={cn('text-sm text-rgt-fg', disabled && 'opacity-50')}>
          {label}
        </label>
      )}
    </div>
  );
});

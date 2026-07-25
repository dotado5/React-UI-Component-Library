import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Visible label associated with the checkbox. */
  label?: string;
  /**
   * Renders the mixed/indeterminate state. Purely visual + assistive — it does
   * not change the `checked` value.
   */
  indeterminate?: boolean;
  /** Class applied to the outer wrapper element. */
  containerClassName?: string;
}

/**
 * Accessible checkbox built on a native `<input type="checkbox">`, so
 * controlled/uncontrolled behavior and form participation work natively.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, indeterminate = false, containerClassName, className, id, disabled, ...rest },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const innerRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, []);

  // `indeterminate` is a DOM property, not an attribute, so it must be set here.
  useEffect(() => {
    const node = innerRef.current;
    /* c8 ignore next -- the ref is always attached after mount */
    if (!node) return;
    node.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={cn('flex items-center gap-2', containerClassName)}>
      <input
        ref={innerRef}
        id={inputId}
        type="checkbox"
        disabled={disabled}
        className={cn(
          'h-4 w-4 shrink-0 rounded-rgt-sm border border-rgt-border accent-rgt-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rgt-ring',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className,
        )}
        {...rest}
      />
      {label && (
        <label htmlFor={inputId} className={cn('text-sm text-rgt-fg', disabled && 'opacity-50')}>
          {label}
        </label>
      )}
    </div>
  );
});

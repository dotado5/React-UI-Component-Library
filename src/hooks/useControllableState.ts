import { useCallback, useState } from 'react';

export interface UseControllableStateOptions<T> {
  /** Controlled value. When `undefined`, the hook manages state internally. */
  value?: T;
  /** Initial value used in uncontrolled mode. */
  defaultValue: T;
  /** Called whenever the value changes, in both modes. */
  onChange?: (value: T) => void;
}

/**
 * Supports components that may be either controlled or uncontrolled.
 *
 * Returns the current value and a setter. When `value` is provided the
 * component is controlled and the setter only notifies `onChange`; otherwise
 * state is held internally.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const isControlled = value !== undefined;
  const state = isControlled ? value : internalValue;

  const setState = useCallback(
    (next: T) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  return [state, setState];
}

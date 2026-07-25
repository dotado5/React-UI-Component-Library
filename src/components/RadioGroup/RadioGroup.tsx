import { useId } from 'react';
import { cn } from '../../utils/cn';
import { useControllableState } from '../../hooks/useControllableState';

export interface RadioOption {
  /** Visible label for the option. */
  label: string;
  /** Value submitted/reported when the option is selected. */
  value: string;
  /** Disables this option only. */
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** The selectable options. */
  options: RadioOption[];
  /** Group label, rendered as a `<legend>`. */
  label?: string;
  /** Shared `name` for the radios. Generated when omitted. */
  name?: string;
  /** Controlled selected value. */
  value?: string;
  /** Initial value in uncontrolled mode. @default '' */
  defaultValue?: string;
  /** Called with the newly selected value. */
  onChange?: (value: string) => void;
  /** Disables every option in the group. @default false */
  disabled?: boolean;
  /** Layout direction. @default 'vertical' */
  orientation?: 'vertical' | 'horizontal';
  /** Class applied to the wrapping fieldset. */
  className?: string;
}

/**
 * Accessible group of radio buttons. Rendered as a `<fieldset>`/`<legend>` so
 * assistive tech announces the group name, with native radios inside.
 */
export function RadioGroup({
  options,
  label,
  name,
  value,
  defaultValue = '',
  onChange,
  disabled = false,
  orientation = 'vertical',
  className,
}: RadioGroupProps) {
  const reactId = useId();
  const groupName = name ?? reactId;
  const [selected, setSelected] = useControllableState<string>({ value, defaultValue, onChange });

  return (
    <fieldset disabled={disabled} className={cn('m-0 border-0 p-0', className)}>
      {label && <legend className="mb-2 text-sm font-medium text-rgt-fg">{label}</legend>}
      <div
        className={cn(
          'flex gap-3',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap items-center',
        )}
      >
        {options.map((option) => {
          const optionId = `${groupName}-${option.value}`;
          return (
            <div key={option.value} className="flex items-center gap-2">
              <input
                type="radio"
                id={optionId}
                name={groupName}
                value={option.value}
                checked={selected === option.value}
                disabled={option.disabled}
                onChange={() => setSelected(option.value)}
                className="h-4 w-4 shrink-0 border-rgt-border accent-rgt-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-rgt-ring disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label
                htmlFor={optionId}
                className={cn('text-sm text-rgt-fg', option.disabled && 'opacity-50')}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}

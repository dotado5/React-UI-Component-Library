import { forwardRef, useId, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visible label associated with the input. */
  label?: string;
  /** Helper text shown below the input (hidden when an error is present). */
  helperText?: string;
  /** Error message shown below the input; also marks the input invalid. */
  error?: string;
  /** Icon rendered inside the input, before the text. */
  prefixIcon?: ReactNode;
  /**
   * Icon rendered inside the input, after the text. Ignored when the password
   * visibility toggle is active (the toggle takes the trailing slot).
   */
  suffixIcon?: ReactNode;
  /**
   * Show a password visibility toggle. Defaults to `true` for
   * `type="password"`, `false` otherwise.
   */
  showPasswordToggle?: boolean;
  /** Class applied to the outer wrapper element. */
  containerClassName?: string;
}

function EyeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.53 13.53 0 0 0 2 12s3.5 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

const inputBase =
  'w-full h-10 rounded-rgt-md border bg-rgt-bg px-3 text-sm text-rgt-fg ' +
  'placeholder:text-rgt-secondary transition-colors ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0 ' +
  'disabled:opacity-50 disabled:pointer-events-none';

/**
 * Accessible text input with label, helper/error text, optional icons and a
 * password visibility toggle. Forwards its ref to the underlying `<input>`.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error,
    prefixIcon,
    suffixIcon,
    showPasswordToggle,
    containerClassName,
    className,
    id,
    type = 'text',
    required,
    disabled,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const reactId = useId();
  const inputId = id ?? reactId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const [passwordVisible, setPasswordVisible] = useState(false);

  const isPassword = type === 'password';
  const toggleEnabled = showPasswordToggle ?? isPassword;
  const resolvedType = isPassword && passwordVisible ? 'text' : type;

  const hasError = Boolean(error);
  const showHelper = !hasError && Boolean(helperText);

  const describedBy =
    cn(hasError ? errorId : undefined, showHelper ? helperId : undefined, ariaDescribedBy) ||
    undefined;

  const hasTrailing = toggleEnabled || Boolean(suffixIcon);

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-rgt-fg">
          {label}
          {required && (
            <span className="text-rgt-danger" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}

      <div className="relative flex items-center">
        {prefixIcon && (
          <span className="absolute left-3 inline-flex text-rgt-secondary pointer-events-none">
            {prefixIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          required={required}
          disabled={disabled}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={cn(
            inputBase,
            hasError
              ? 'border-rgt-danger focus-visible:ring-rgt-danger'
              : 'border-rgt-border focus-visible:ring-rgt-ring focus-visible:border-rgt-ring',
            prefixIcon ? 'pl-10' : undefined,
            hasTrailing && 'pr-10',
            className,
          )}
          {...rest}
        />

        {toggleEnabled ? (
          <button
            type="button"
            onClick={() => setPasswordVisible((v) => !v)}
            className="absolute right-2 inline-flex h-7 w-7 items-center justify-center rounded-rgt-sm text-rgt-secondary hover:text-rgt-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rgt-ring"
            aria-label={passwordVisible ? 'Hide password' : 'Show password'}
            aria-pressed={passwordVisible}
            tabIndex={disabled ? -1 : 0}
          >
            {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        ) : (
          suffixIcon && (
            <span className="absolute right-3 inline-flex text-rgt-secondary pointer-events-none">
              {suffixIcon}
            </span>
          )
        )}
      </div>

      {hasError ? (
        <p id={errorId} className="text-sm text-rgt-danger" role="alert">
          {error}
        </p>
      ) : (
        showHelper && (
          <p id={helperId} className="text-sm text-rgt-secondary">
            {helperText}
          </p>
        )
      )}
    </div>
  );
});

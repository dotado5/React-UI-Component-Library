/**
 * Tiny className combiner — joins truthy class values with a single space.
 *
 * Zero-dependency by design (see coding standards: minimize runtime deps).
 * Accepts strings and falsy values so conditional classes read cleanly:
 *
 *   cn('btn', isActive && 'btn--active', disabled ? 'is-disabled' : null)
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}

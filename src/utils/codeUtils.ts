/**
 * Utility functions to improve code quality and handle common issues
 */

/**
 * Utility function to mark variables as deliberately unused
 * while avoiding ESLint warnings.
 * 
 * Use this when a variable is required by a type signature or API
 * but isn't needed in the implementation.
 * 
 * @example
 * function Component({ unused, ...props }: Props) {
 *   markAsUnused(unused);
 *   // rest of component
 * }
 */
export const markAsUnused = (..._args: any[]): void => {
  // This function intentionally does nothing.
  // It's just a way to tell ESLint that we know this variable is unused.
};

/**
 * Type guard to assert that a value is not null or undefined
 * 
 * @example
 * const value = maybeNull();
 * if (isPresent(value)) {
 *   // TypeScript knows value is not null/undefined here
 *   doSomething(value);
 * }
 */
export function isPresent<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}
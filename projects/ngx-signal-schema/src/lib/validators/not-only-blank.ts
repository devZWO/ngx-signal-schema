import { SchemaPath, validate } from '@angular/forms/signals';
import { ErrorOption, ValidationErrorWith } from './error-options';

/**
 * Options for configuring the `notOnlyBlank` validator.
 */
export interface NotOnlyBlankOptions extends ErrorOption {
  /**
   * Whether to treat control characters (e.g. \x00-\x1F, \x7F, and Unicode control characters)
   * as invalid/blank characters.
   *
   * @default false (only standard whitespaces are treated as blank)
   */
  includeControlCharacters?: boolean;

  /**
   * Minimum number of consecutive valid (non-blank, non-control) characters required.
   *
   * @default 1 (requires at least one valid character in the string)
   */
  minConsecutive?: number;

  /**
   * Whether `null`, `undefined`, or an empty string `""` is considered valid.
   *
   * Set this to `false` if empty values should also be rejected by this validator.
   *
   * @default true (allows optional fields; use alongside `required` or `requiredTrimmed` if mandatory)
   */
  allowEmpty?: boolean;
}

/**
 * Validates that a string field does not consist exclusively of whitespaces (or control characters),
 * and optionally requires a minimum number of consecutive valid characters.
 *
 * By default:
 * - Empty values (`null`, `undefined`, `""`) are considered valid (use with `required` or `allowEmpty: false` if mandatory).
 * - Strings containing only whitespace characters (e.g., `"   "`, `"\t\n"`) are invalid.
 * - When `includeControlCharacters: true` is set, control characters are treated as blank characters.
 * - When `minConsecutive` is set to `N`, the string must contain at least one contiguous block of `N` valid characters.
 *
 * @param path The schema path to validate.
 * @param options Optional configuration for the validator.
 *
 * @example
 * ```typescript
 * const userSchema = schema<User>((s) => {
 *   // Ensure name is not only whitespace if provided (optional field)
 *   notOnlyBlank(s.name);
 *
 *   // Reject control characters and require at least 3 consecutive valid characters
 *   notOnlyBlank(s.comment, {
 *     includeControlCharacters: true,
 *     minConsecutive: 3,
 *     error: { message: 'Comment must contain meaningful text (at least 3 consecutive characters).' }
 *   });
 * });
 * ```
 */
export function notOnlyBlank(
  path: SchemaPath<string | null | undefined>,
  options?: NotOnlyBlankOptions
): void {
  validate(path, (ctx) => {
    const val = ctx.value();

    if (val === null || val === undefined || val === '') {
      if (options?.allowEmpty === false) {
        return {
          kind: options?.error?.kind ?? 'notOnlyBlank',
          message: options?.error?.message,
          options: options ?? {},
        } satisfies ValidationErrorWith<NotOnlyBlankOptions>;
      }
      return null;
    }

    const minConsecutive = Math.max(1, options?.minConsecutive ?? 1);
    const pattern = options?.includeControlCharacters
      ? new RegExp(`[^\\s\\p{C}]{${minConsecutive},}`, 'u')
      : new RegExp(`\\S{${minConsecutive},}`);

    if (!pattern.test(val)) {
      return {
        kind: options?.error?.kind ?? 'notOnlyBlank',
        message: options?.error?.message,
        options: options ?? {},
      } satisfies ValidationErrorWith<NotOnlyBlankOptions>;
    }

    return null;
  });
}

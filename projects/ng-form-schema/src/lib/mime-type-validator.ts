import {pattern, SchemaPath} from "@angular/forms/signals";

/**
 * Validator that checks if the field value matches one of the allowed MIME types.
 * Supports static values, arrays of strings, or a function (e.g., a signal getter) that returns them.
 *
 * @example
 * // Static usage
 * isMimeType(ctx.fileType, ['image/png', 'application/pdf']);
 *
 * @example
 * // Functional/Signal usage
 * isMimeType(ctx.fileType, () => this.mimeTypesAllowed());
 *
 * @param fieldPath - The path to the field in the form schema.
 * @param mimeType - The allowed MIME type(s). Can be a string, an array, or a function returning either.
 * @param config - Optional configuration for the validator, such as a custom error message.
 */
export function isMimeType<T extends string>(
  fieldPath: SchemaPath<T>,
  mimeType: string | readonly string[] | (() => string | readonly string[]),
  config?: { message: string }
): void {
  const patternArg = typeof mimeType === 'function'
    ? () => mimeTypePattern(mimeType())
    : mimeTypePattern(mimeType);

  pattern(fieldPath, patternArg, config)
}


/**
 * Escapes special characters in a string to make it safe for use within a Regular Expression.
 *
 * @param value - The raw string to be escaped.
 * @returns The escaped string.
 */
function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Creates a Regular Expression that matches any of the provided values.
 *
 * @param values - A single string or an array of strings to match against.
 * @param options - Configuration options for the pattern generation.
 * @param options.exact - If true (default), the pattern will match the entire string.
 * @param options.caseInsensitive - If true (default), the pattern will ignore case.
 * @param options.wildcard - If true, '*' in values will be treated as '.*' (e.g., 'image/*' becomes 'image/.*').
 * @returns A RegExp object representing the combined pattern.
 */
export function oneOfPattern(
  values: string | readonly string[],
  options?: {
    exact?: boolean;
    caseInsensitive?: boolean;
    wildcard?: boolean;
  },
): RegExp {
  const {
    exact = true,
    caseInsensitive = true,
    wildcard = false,
  } = options ?? {};

  const patterns = [values]
    .flat()
    .map(value => {
      const escaped = escapeRegExp(value);

      return wildcard
        ? escaped.replaceAll('\\*', '.*')
        : escaped;
    });

  const body = patterns.join('|');

  return new RegExp(
    exact ? `^(?:${body})$` : `(?:${body})`,
    caseInsensitive ? 'i' : undefined,
  );
}


/**
 * Generates a Regular Expression specifically for MIME type validation.
 * It uses exact matching, case insensitivity, and supports wildcards (e.g., 'application/*').
 *
 * @param mimeTypes - The allowed MIME type(s) or wildcard patterns.
 * @returns A RegExp object for validating MIME types.
 */
export function mimeTypePattern(
  mimeTypes: string | readonly string[],
): RegExp {
  return oneOfPattern(mimeTypes, {
    exact: true,
    caseInsensitive: true,
    wildcard: true,
  });
}

import {pattern, SchemaPath} from "@angular/forms/signals";
import {oneOfPattern} from "./one-of-pattern";
import {ErrorOption} from './error-options';

/**
 * Validator that checks if the field value matches one of the allowed MIME types.
 * Supports static values, arrays of strings, or a function (e.g., a signal getter) that returns them.
 *
 * @example
 * // Static usage
 * mimeType(ctx.fileType, ['image/png', 'application/pdf']);
 *
 * @example
 * // Functional/Signal usage
 * mimeType(ctx.fileType, () => this.mimeTypesAllowed());
 *
 * @param fieldPath - The path to the field in the form schema.
 * @param mimeType - The allowed MIME type(s). Can be a string, an array, or a function returning either.
 * @param config - Optional configuration for the validator, such as a custom error message.
 *
 * @category Validators
 */
export function mimeType<T extends string>(
  fieldPath: SchemaPath<T>,
  mimeType: string | readonly string[] | (() => string | readonly string[]),
  config?: {
    /**
     * Optional custom validation error message.
     * @deprecated Use `error.message` from `ErrorOption` instead.
     */
    message?: string
  } & ErrorOption
): void {
  const patternArg = typeof mimeType === 'function'
    ? () => mimeTypePattern(mimeType())
    : mimeTypePattern(mimeType);

  pattern(fieldPath as SchemaPath<string>, patternArg, {
    error: {
        kind: config?.error?.kind ?? 'mimeType',
        message: config?.error?.message ?? config?.message
    }
  })
}



/**
 * Generates a Regular Expression specifically for MIME type validation.
 * It uses exact matching, case insensitivity, and supports wildcards (e.g., 'application/*').
 *
 * @example
 * mimeTypePattern(['image/*', 'application/pdf']);
 *
 * @param mimeTypes - The allowed MIME type(s) or wildcard patterns.
 * @returns A RegExp object for validating MIME types.
 *
 * @deprecated will be become internal in a future version. Use `mimeTypePattern` directly.
 * @category deprecated
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

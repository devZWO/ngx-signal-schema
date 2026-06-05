import {pattern, SchemaPath} from "@angular/forms/signals";
import {oneOfPattern} from "./one-of-pattern";

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
 */
export function mimeType<T extends string>(
  fieldPath: SchemaPath<T>,
  mimeType: string | readonly string[] | (() => string | readonly string[]),
  config?: {
    /**
     * Optional custom validation error message.
     */
    message: string
  }
): void {
  const patternArg = typeof mimeType === 'function'
    ? () => mimeTypePattern(mimeType())
    : mimeTypePattern(mimeType);

  pattern(fieldPath as SchemaPath<string>, patternArg, {
    error: {
      kind: 'mimeType',
      message: config?.message
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

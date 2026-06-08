import {metadata, REQUIRED, SchemaPath, validate, ValidationError} from "@angular/forms/signals";
import {ErrorOption} from './options';

/**
 * Validator that ensures a value is defined (not null or undefined).
 *
 * **Important:** Use this validator primarily for non-string types where `false`, `0`, or empty arrays
 * are valid and intentional selections. For string/text inputs, use `requiredTrimmed` instead.
 *
 * This is particularly useful for boolean fields (checkboxes, toggles) where the standard `required`
 * validator might treat `false` as a missing value (falsy). This validator explicitly checks that
 * a value is present, regardless of whether it is `true` or `false`.
 *
 * @param path - The schema path to the field to validate.
 *
 * @param option - Optional configuration for the validator.
 *
 * @example
 * // Correct use for mandatory boolean
 * requiredDefined(path.agreedToTerms);
 *
 * @see requiredTrimmed - Use this for string/text fields.
 */
export function requiredDefined<T>(path: SchemaPath<T>, option?: ErrorOption) {
    metadata(path, REQUIRED, () => true);
  validate(path, (ctx): ValidationError | null => {
    const value = ctx.value();

    if (value !== null && value !== undefined) {
      return null;
    }

    return {
        kind: option?.error?.kind ?? 'required',
        message: option?.error?.message
    }
  });
}

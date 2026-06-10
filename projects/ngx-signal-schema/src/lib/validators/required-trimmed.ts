import {metadata, REQUIRED, SchemaPath, validate} from "@angular/forms/signals";
import {ErrorOption} from './error-options';

/**
 * A validator for signal-based forms that checks if a string value is present after trimming whitespace.
 * Returns a 'required' error if the value is null, undefined, or empty after trimming.
 *
 * This is the standard "required" validator for text inputs and textareas.
 *
 * @param path
 * The schema path to the string field to be validated.
 *
 * @param option
 * Optional configuration for the validator.
 *
 * @example
 * requiredTrimmed(path.username);
 *
 * @see requiredDefined - Use this for non-string fields like booleans or numbers.
 *
 * @category Validators
 */
export function requiredTrimmed(path: SchemaPath<string | null | undefined>, option?: ErrorOption): void {
    metadata(path, REQUIRED, () => true);
    validate(path, (ctx) => {
        const trimmed = ctx.value()?.trim();

        if (!trimmed) {
            return {
                kind: option?.error?.kind ?? 'required',
                message: option?.error?.message
            }
        }

        return null;
    })
}

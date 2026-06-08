import {maxLength, minLength, pattern, SchemaPath} from "@angular/forms/signals";
import {ErrorOption} from './options';

const isIntegerTextRegex = /^\d*$/

/**
 * Validates a year text field (exactly 4 digits, e.g., "2023").
 *
 * It ensures the value:
 * 1. Has a maximum length of 4 characters.
 * 2. Has a minimum length of 4 characters.
 * 3. Consists only of digits.
 *
 * @param fieldPath - The schema path to the year field to validate.
 *
 * @param config - Provides custom error options for validation errors.
 *
 * @important
 * **Unexpectedly the custom error kind will NOT override the default error kind for minLength and maxLength, only the error kind for the pattern.**
 *
 *
 * @example
 * year(path.birthYear);
 */
export function year<T extends string>(fieldPath: SchemaPath<T>, config?: ErrorOption): void {
    if (config?.error?.kind) {
        maxLength(fieldPath, 4, {error: {kind: config.error.kind, message: config?.error?.message}})
        minLength(fieldPath, 4, {error: {kind: config.error.kind, message: config?.error?.message}})
    } else {
        maxLength(fieldPath, 4, {message: config?.error?.message})
        minLength(fieldPath, 4, {message: config?.error?.message})
    }
    pattern(
        fieldPath,
        isIntegerTextRegex,
        {error: {kind: config?.error?.kind ?? 'year', message: config?.error?.message}}
    )
}

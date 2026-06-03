import {maxLength, minLength, pattern, SchemaPath} from "@angular/forms/signals";

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
 * @example
 * yearText(path.birthYear);
 */
export function yearText<T extends string>(fieldPath: SchemaPath<T>): void {
  maxLength(fieldPath, 4)
  minLength(fieldPath, 4)
  pattern(fieldPath, isIntegerTextRegex, {error: {kind: 'pattern.isInteger'}})
}

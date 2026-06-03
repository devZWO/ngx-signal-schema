import {maxLength, minLength, pattern, SchemaPath} from "@angular/forms/signals";

const isIntegerTextRegex = /^\d*$/

/**
 * Validates a year text field (exactly 4 digits, e.g., "2023").
 *
 * @param fieldPath The schema path to validate.
 */
export function yearText<T extends string>(fieldPath: SchemaPath<T>): void {
  maxLength(fieldPath, 4)
  minLength(fieldPath, 4)
  pattern(fieldPath, isIntegerTextRegex, {error: {kind: 'pattern.isInteger'}})
}

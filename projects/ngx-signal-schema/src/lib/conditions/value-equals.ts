import {SchemaPath} from "@angular/forms/signals";
import {SchemaRule} from "./schema-rule";

/**
 * Checks if a field's value equals a specific expected value.
 * Useful for conditional conditions (e.g., in `when` conditions).
 *
 * @example
 * applyWhen(path.field, valueEquals(path.other, 'some-value'), required);
 *
 * @param path - The path to the field to check.
 * @param expected - The value to compare against.
 * @returns A rule function that returns true if the value matches.
 */
export function valueEquals<T>(
  path: SchemaPath<T>,
  expected: T
): SchemaRule {
  return (ctx) => ctx.valueOf(path) === expected;
}

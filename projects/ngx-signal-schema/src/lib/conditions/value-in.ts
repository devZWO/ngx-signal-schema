import {SchemaPath} from "@angular/forms/signals";
import {SchemaRule} from "./schema-rule";

/**
 * Checks if a field's value is contained within a list of expected values.
 * Useful for conditional conditions (e.g., in `when` conditions).
 *
 * @example
 * applyWhen(path.field, valueIn(path.other, ['val1', 'val2']), required);
 *
 * @param path - The path to the field to check.
 * @param values - The array of values to compare against.
 * @returns A rule function that returns true if the value is in the set.
 */
export function valueIn<T>(
  path: SchemaPath<T>,
  values: readonly T[],
): SchemaRule {
  return (ctx) =>  (new Set(values)).has(ctx.valueOf(path));
}

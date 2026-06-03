import {SchemaPath} from "@angular/forms/signals";

export type SchemaRuleContext = {
  valueOf<T>(path: SchemaPath<T>): T;
};

export type SchemaRule = (ctx: SchemaRuleContext) => boolean;

/**
 * Checks if a field's value equals a specific expected value.
 * Useful for conditional rules (e.g., in `when` conditions).
 *
 * @param path The path to the field to check.
 * @param expected The value to compare against.
 * @returns A rule function that returns true if the value matches.
 */
export function valueEquals<T>(
  path: SchemaPath<T>,
  expected: T
): SchemaRule {
  return (ctx) => ctx.valueOf(path) === expected;
}

/**
 * Checks if a field's value is contained within a list of expected values.
 * Useful for conditional rules (e.g., in `when` conditions).
 *
 * @param path The path to the field to check.
 * @param values The array of values to compare against.
 * @returns A rule function that returns true if the value is in the set.
 */
export function valueIn<T>(
  path: SchemaPath<T>,
  values: readonly T[],
): SchemaRule {
  return (ctx) =>  (new Set(values)).has(ctx.valueOf(path));
}

/**
 * Negates a given schema rule.
 *
 * @param rule The rule to negate.
 * @returns A rule function that returns the inverse of the input rule.
 */
export function not(rule: SchemaRule): SchemaRule {
  return (ctx) => !rule(ctx);
}

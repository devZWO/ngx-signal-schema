import {SchemaRule} from "./schema-rule";

/**
 * Negates a given schema rule.
 *
 * __`not`__ _is a semantic shortcut for:_
 *
 * ```ts
 * (ctx) => !rule(ctx)
 * ```
 *
 * @example
 * applyWhen(path.field, not(valueEquals(path.other, 'some-value')), required);
 *
 * @param rule - The rule to negate.
 * @returns A rule function that returns the inverse of the input rule.
 *
 * @category Conditions
 */
export function not(rule: SchemaRule): SchemaRule {
  return (ctx) => !rule(ctx);
}

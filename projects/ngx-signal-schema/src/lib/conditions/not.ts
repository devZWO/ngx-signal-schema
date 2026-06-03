import {SchemaRule} from "./schema-rule";

/**
 * Negates a given schema rule.
 *
 * @example
 * applyWhen(path.field, not(valueEquals(path.other, 'some-value')), required);
 *
 * @param rule - The rule to negate.
 * @returns A rule function that returns the inverse of the input rule.
 */
export function not(rule: SchemaRule): SchemaRule {
  return (ctx) => !rule(ctx);
}

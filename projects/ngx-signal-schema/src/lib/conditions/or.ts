import {SchemaRule} from '@devzwo/ngx-signal-schema';

/**
 * Combines multiple schema rules with OR logic.
 *
 * @param rules The rules to combine.
 * @returns A rule function that returns true if at least one rule returns true.
 *
 * @example
 *    applyIf(
 *       fieldPath, // the field path to apply a schema to
 *       // the conditions concatenated with `or`
 *       or(valueEquals(fieldPath.type, 'A'), valueEquals(fieldPath.aknowladged, true)),
 *       AllowSchema, // applyes the Allow Schema, when the condition above is true
 *       inactive // hides the complete fieldPath and subpath
 *     )
 *
 * @category Conditions
 */
export function or(...rules: SchemaRule[]): SchemaRule {
    return (ctx) => rules.some(rule => rule(ctx));
}

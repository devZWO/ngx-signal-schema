import {SchemaPath} from "@angular/forms/signals";
import {SchemaRule} from "./schema-rule";

/**
 * Checks if a field's value is contained within a list of expected values.
 * Useful for conditional conditions (e.g., in `when` conditions).
 *
 * __`valueIn`__ _is a semantic shortcut for:_
 *
 * ```ts
 * (ctx) => ctx.valueOf(path.someField) in ['val1', 'val2']
 * ```
 *
 * @example
 * applyWhen(path.field, valueIn(path.other, ['val1', 'val2']), required);
 *
 * @param path - The path to the field to check.
 * @param values - The array of values to compare against, or a function returning them.
 * @returns A rule function that returns true if the value is in the set.
 *
 * @category Conditions
 */
export function valueIn<T>(
    path: SchemaPath<T>,
    values: readonly T[] | (() => readonly T[]),
): SchemaRule {
    return (ctx) => {
        const currentValues = typeof values === 'function' ? values() : values;
        return new Set(currentValues).has(ctx.valueOf(path));
    };
}

import {SchemaPath} from '@angular/forms/signals';
import {SchemaRule} from './schema-rule';

/**
 * Checks if a list field contains a specific value.
 * If you need the other way round, use {@link valueIn}
 *
 * @param path The path to the list field.
 * @param value The value to look for.
 *
 * @returns A rule function that returns true if the list contains the value.
 *
 * @category Conditions
 */
export function includes<T>(
    path: SchemaPath<T[]>,
    value: T,
): SchemaRule {
    return (ctx) => (ctx.valueOf(path) || []).includes(value);
}

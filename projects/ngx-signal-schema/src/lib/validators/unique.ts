import {ArrayBlock, ErrorOption} from '@devzwo/ngx-signal-schema';
import {SchemaPath, SchemaPathTree, validateTree, ValidationError, ReadonlyFieldTree} from '@angular/forms/signals';

/**
 * The `unique` validator checks if all items within an {@link ArrayBlock} are unique.
 * If duplicates are found, it generates validation errors.
 *
 * This validator must be used with {@link ArrayBlock} because Angular Signal Forms
 * validators cannot be applied directly to raw arrays.
 *
 * ### Default behavior
 * - **Strings**: Trimmed and compared case-insensitively.
 * - **Other types**: Compared using strict equality (`===`).
 *
 * ### Error reporting
 * By default, errors are attached to both the {@link ArrayBlock} container and each individual
 * item that is part of a duplicate set. This can be configured using the `destination` option.
 *
 * @typeParam S - The type of the schema path, extending {@link ArrayBlock} or being null/undefined.
 * @typeParam T - The type of the elements in the array.
 *
 * @param fieldPath - The {@link SchemaPath} to the {@link ArrayBlock} containing the items to validate.
 * @param options - Configuration options for the validator.
 * @param options.error - Custom error configuration (kind and message). Defaults to `{ kind: 'unique' }`.
 * @param options.equalFn - A custom function to determine equality between two items.
 * @param options.destination - Determines where the validation errors should be attached.
 *   - `'leaf'`: (Default) The error is attached only to the individual items that are duplicated. Useful for highlighting the specific problematic fields.
 *   - `'node'`: The error is attached only to the {@link ArrayBlock} itself. Useful for showing a single summary error.
 *   - `'both'`: The error is attached to both the {@link ArrayBlock} and the duplicated items.
 *
 * @example
 * ```ts
 * // Basic usage with strings (case-insensitive, trimmed by default)
 * schema<ArrayBlock<string>>(path => {
 *   unique(path);
 * });
 * ```
 *
 * @example
 * ```ts
 * // Custom equality function and error message
 * interface User { id: number; name: string; }
 * schema<ArrayBlock<User>>(path => {
 *   unique(path, {
 *     equalFn: (a, b) => a.id === b.id,
 *     error: { message: 'User IDs must be unique' }
 *   });
 * });
 * ```
 *
 * @example
 * ```ts
 * // Attach errors only to items node (leaf nodes)
 * schema<ArrayBlock<string>>(path => {
 *   unique(path, { destination: 'node' });
 * });
 * ```
 *
 * @category Validators
 */
export function unique<S extends ArrayBlock<T> | null | undefined, T>(
    fieldPath: SchemaPath<S>,
    options?: ErrorOption & { equalFn?: (a: T, b: T) => boolean } & { destination?: 'node' | 'leaf' | 'both' }
): void {
    const eqFn = options?.equalFn ?? ((a: unknown, b: unknown) => {
        if (typeof a === 'string' && typeof b === 'string') {
            return a.trim().toLowerCase() === b.trim().toLowerCase();
        }
        return a === b;
    });

    if (!isArrayBlockPath<T>(fieldPath)) {
        return;
    }

    validateTree(fieldPath, (ctx) => {
        // return without error if there is no value to validate
        const value = ctx.value();
        if (!value || !value.items) {
            return null;
        }

        // collect duplicate indices
        const items = value.items;

        const duplicateIndices = new Set<number>();
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                if (eqFn(items[i], items[j])) {
                    duplicateIndices.add(i);
                    duplicateIndices.add(j);
                }
            }
        }

        // return without error if there are no duplicates
        if (duplicateIndices.size === 0) {
            return null;
        }

        const kind = options?.error?.kind ?? 'unique';
        const message = options?.error?.message;
        const destination = options?.destination ?? 'leaf';

        const errors: (ValidationError & { fieldTree?: ReadonlyFieldTree<unknown> })[] = [];

        // Add error to each duplicate item if destination is 'leaf' or 'both'
        if (destination === 'leaf' || destination === 'both') {
            for (const index of duplicateIndices) {
                errors.push({
                    kind,
                    message,
                    fieldTree: ctx.fieldTreeOf(fieldPath.items[index])
                });
            }
        }

        // Add error to the ArrayBlock itself if destination is 'node' or 'both'
        if (destination === 'node' || destination === 'both') {
            errors.push({
                kind,
                message,
                fieldTree: ctx.fieldTreeOf(fieldPath)
            });
        }

        return errors;
    });
}

function isArrayBlockPath<T>(path: unknown): path is SchemaPathTree<ArrayBlock<T>> & { items: Record<number, SchemaPathTree<T>> } {
    return !!path && typeof path === 'object' && (path as { items?: unknown }).items !== undefined;
}

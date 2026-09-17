import {ErrorOption} from './error-options';
import {SchemaPath, SchemaPathTree, validateTree, ValidationError, ReadonlyFieldTree} from '@angular/forms/signals';
import {isSignal, Signal} from '@angular/core';

/**
 * Options for where to attach validation errors.
 *
 * @category Other
 */
export type ValidationDestination = 'container' | 'items' | 'both';

/**
 * The `unique` validator checks if all items within an array are unique.
 * If duplicates are found, it generates validation errors.
 *
 * ### Default behavior
 * - **Strings**: Trimmed and compared case-insensitively.
 * - **Other types**: Compared using strict equality (`===`).
 *
 * ### Error reporting
 * By default, errors are attached to each individual item that is part of a duplicate set.
 * This can be configured using the `destination` option.
 *
 * @typeParam S - The type of the schema path, extending `T[]`, or being null/undefined.
 * @typeParam T - The type of the elements in the array.
 *
 * @param fieldPath - The {@link SchemaPath} to the raw array containing the items to validate.
 * @param options - Configuration options for the validator.
 * @param options.error - Custom error configuration (kind and message). Defaults to `{ kind: 'unique' }`.
 * @param options.equalFn - A custom function to determine equality between two items.
 * @param options.destination - Determines where the validation errors should be attached.
 *   - `'items'`: (Default) The error is attached only to the individual items that are duplicated. Useful for highlighting the specific problematic fields.
 *   - `'container'`: The error is attached only to the array itself. Useful for showing a single summary error.
 *   - `'both'`: The error is attached to both the array and the duplicated items.
 *   - `() => 'container' | 'items' | 'both'`: A function that returns the destination.
 *   - `Signal<'container' | 'items' | 'both'>`: A signal that provides the destination.
 *
 * @example
 * ```ts
 * // Basic usage with strings (case-insensitive, trimmed by default)
 * schema<string[]>(path => {
 *   unique(path);
 * });
 * ```
 *
 * @example
 * ```ts
 * // Custom equality function and error message
 * interface User { id: number; name: string; }
 * schema<User[]>(path => {
 *   unique(path, {
 *     equalFn: (a, b) => a.id === b.id,
 *     error: { message: 'User IDs must be unique' }
 *   });
 * });
 * ```
 *
 * @example
 * ```ts
 * // Attach errors only to the array container
 * schema<string[]>(path => {
 *   unique(path, { destination: 'container' });
 * });
 * ```
 *
 * @example
 * ```ts
 * // Using a signal for dynamic destination
 * const dest = signal<'container' | 'items'>('items');
 * schema<string[]>(path => {
 *   unique(path, { destination: dest });
 * });
 * ```
 *
 * @category Validators
 */
export function unique<S extends T[] | null | undefined, T>(
    fieldPath: SchemaPath<S>,
    options?: ErrorOption
        & { equalFn?: (a: T, b: T) => boolean }
        & { destination?: ValidationDestination | (() => ValidationDestination) | Signal<ValidationDestination> }
): void {
    const eqFn = options?.equalFn ?? ((a: unknown, b: unknown) => {
        if (typeof a === 'string' && typeof b === 'string') {
            return a.trim().toLowerCase() === b.trim().toLowerCase();
        }
        return a === b;
    });

    if (!fieldPath) {
        return;
    }

    validateTree(fieldPath, (ctx) => {
        const value = ctx.value();
        if (!value || !Array.isArray(value)) {
            return null;
        }

        const items: T[] = value;
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

        const destination = (isSignal(options?.destination) || (typeof options?.destination === 'function'))
            ? options.destination()
            : options?.destination ?? 'items';

        const errors: (ValidationError & { fieldTree?: ReadonlyFieldTree<unknown> })[] = [];

        // Add error to each duplicate item if destination is 'items' or 'both'
        if (destination === 'items' || destination === 'both') {
            for (const index of duplicateIndices) {
                // eslint-disable-next-line
                const itemPath = (fieldPath as any)[index];
                errors.push({
                    kind,
                    message,
                    fieldTree: ctx.fieldTreeOf(itemPath)
                });
            }
        }

        // Add error to the array itself if destination is 'container' or 'both'
        if (destination === 'container' || destination === 'both') {
            errors.push({
                kind,
                message,
                fieldTree: ctx.fieldTreeOf(fieldPath as unknown as SchemaPathTree<unknown>)
            });
        }

        return errors;
    });
}


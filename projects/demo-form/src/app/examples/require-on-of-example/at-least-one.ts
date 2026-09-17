import {SchemaPath, SchemaPathTree, validateTree} from "@angular/forms/signals";

/**
 * Demonstrates a minimal cross-field validator that requires at least one of the
 * explicitly selected fields to be filled.
 *
 * This helper is intentionally kept small for demo purposes. It shows how an
 * "at least one field is required" rule can be implemented with `validateTree`,
 * without exposing the full configuration surface of the reusable
 * `requiredAtLeastOne` validator from `@devzwo/ngx-signal-schema`.
 *
 * Use `requiredAtLeastOne` for production-style validation rules. Compared to
 * this demo helper, `requiredAtLeastOne` supports additional options such as
 * recursive field discovery, excluded fields, custom fill logic, configurable
 * error attachment, and error options.
 *
 * This simplified variant only:
 * - checks the fields returned by the provided selectors
 * - ignores currently disabled or hidden fields
 * - treats values as filled when they are neither `null` nor an empty string
 * - attaches the validation error to exactly one explicitly selected target field
 * - uses the fixed error kind `requiredAtLeastOne`
 * - uses the fixed message `At least one field is required`
 *
 * If all selected fields are currently disabled or hidden, the validation passes.
 * Otherwise, the validator returns an error when none of the active selected
 * fields is filled.
 *
 * @typeParam T
 * The object type represented by the schema path on which the validator is
 * registered.
 *
 * @param path
 * The object schema path on which the cross-field validation should be applied.
 * Usually this is the root object or a nested object containing all selected
 * fields.
 *
 * @param selectors
 * A readonly tuple of at least two selector functions. Each selector receives
 * the current `SchemaPathTree<T>` and returns one field path that participates
 * in the check.
 *
 * @param attachTo
 * Selector for the field that should receive the validation error if none of
 * the active selected fields is filled.
 *
 * @example
 * ```ts
 * atLeastOne(
 *   path,
 *   [
 *     p => p.email,
 *     p => p.phone,
 *     p => p.mobile,
 *   ],
 *   p => p.email,
 * );
 * ```
 *
 * @remarks
 * This function is meant to make the core idea behind a cross-field validator
 * easy to understand. Prefer `requiredAtLeastOne` when you need a reusable,
 * configurable validator.
 *
 */
export function atLeastOne<
    T extends object
>(
    path: SchemaPath<T>,
    selectors: readonly [
        (p: SchemaPathTree<T>) => SchemaPathTree<unknown>,
        (p: SchemaPathTree<T>) => SchemaPathTree<unknown>,
        ...((p: SchemaPathTree<T>) => SchemaPathTree<unknown>)[]
    ],
    attachTo: (p: SchemaPathTree<T>) => SchemaPathTree<unknown>
): void {
    // Use custom "isFilled" logic if provided, otherwise fall back to a simple default
    // (non-null and non-empty string counts as filled)
    const isFilled = ((value: unknown) => value != null && value !== '');


    // Use provided message or fall back to a generic default
    const message = 'At least one field is required';
    const kind = 'requiredAtLeastOne';

    validateTree(path, (ctx) => {
        const pathTree = path as SchemaPathTree<T>;

        // Resolve selector functions into concrete, root-bound schema paths.
        // After this line, we have the actual paths we want to validate.
        const selectedPaths = selectors.map((select) => select(pathTree));

        // Filter out currently disabled or hidden fields.
        const activePaths = selectedPaths.filter((p) => {
            const state = ctx.stateOf(p);
            return !state.disabled() && !state.hidden();
        });

        // If no participating fields are currently active, validation passes.
        if (activePaths.length === 0) {
            return null;
        }

        // Check if at least one of the active fields is "filled".
        // We read each value via ctx.valueOf(...) and apply the isFilled logic.
        const anyFilled = activePaths.some((selectedPath) => {
            const value = ctx.valueOf(selectedPath);
            return isFilled(value);
        });

        // If at least one field is filled, validation passes → no error
        if (anyFilled) {
            return null;
        }

        // If a specific target field is configured, attach the error only there
        return {
            kind: kind,
            message: message,
            // Resolve the target field path and attach the error to its FieldTree
            fieldTree: ctx.fieldTreeOf(attachTo(pathTree)),
        };

    });
}

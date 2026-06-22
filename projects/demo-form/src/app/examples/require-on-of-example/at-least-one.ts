import {SchemaPath, SchemaPathTree, validateTree} from "@angular/forms/signals";

/**
 * Adds a cross-field validation rule to the given schema path that requires
 * at least one of multiple selected fields to be filled.
 *
 * This helper is useful for cases where several alternative inputs are allowed,
 * but at least one of them must contain a value.
 *
 * Typical examples:
 * - at least one of several contact channels must be filled
 * - either email or phone number must be provided
 *
 * **Disabled and Hidden fields:**
 * Fields that are currently disabled or hidden do not participate in the
 * validation. If all selected fields are disabled or hidden, the validation
 * passes (returns `null`).
 *
 * The Validator returns an error if none of the active participating fields is filled.
 * The Error kind is `requiredAtLeastOne`.
 *
 * @typeParam T
 * The object type represented by the schema path on which the validator is registered.
 *
 * @typeParam V
 * The value type of the selected fields. This defaults to `unknown`, but can
 * be narrowed implicitly by the selectors you pass in.
 *
 * @param path
 * The schema path of the object on which the cross-field validation should be applied.
 * Usually this is the root object or a nested object containing all relevant fields.
 *
 * @param selectors
 * A readonly tuple of at least two selector functions.
 * Each selector receives the current `SchemaPathTree<T>` and must return the
 * path of a field that should participate in the "at least one required" check.
 *
 * @param attachTo
 * Optional configuration for the validator.
 *
 * @example
 * ```ts
 * requiredAtLeastOne(
 *   path,
 *   [
 *     p => p.email,
 *     p => p.telefonnummer,
 *     p => p.mobilnummer,
 *   ],
 *   {
 *     message: 'Mindestens ein Kontaktweg muss angegeben werden.',
 *     attachTo: p => p.email,
 *     isFilled: (value) =>
 *       typeof value === 'string' ? value.trim() !== '' : value != null,
 *   },
 * );
 * ```
 *
 * @example
 * Using the rercusive flag, the validator will also check nested objects.
 *
 * ```ts
 * requiredAtLeastOne(path, {recursive: true});
 * ```
 *
 * @remarks
 * This helper models a real cross-field rule. That makes it preferable to
 * expressing the same behavior through multiple mirrored `required(..., { when })`
 * conditions, especially when more than two fields are involved.
 *
 * @category Validators
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

import {SchemaPath, SchemaPathTree, validateTree} from "@angular/forms/signals";
import {ErrorOption} from "./error-options";


export interface RequiredAtLeastOneOptions<T extends object> {

    /**
     * Optional selector to determine which field should receive the validation error.
     * If omitted, the error is attached to all participating fields.
     */
    attachTo?: (p: SchemaPathTree<T>) => SchemaPathTree<unknown>;

    /**
     * Optional function to define what should count as "filled".
     * By default, a value is considered filled if it is neither `null` nor an empty string (`''`).
     */
    isFilled?: (value: unknown) => boolean;

    /**
     * Optional custom validation error message.
     * @deprecated Use `error.message` from `ErrorOption` instead.
     */
    message?: string;

    /**
     * Optional flag to enable recursive validation of nested objects.
     *
     * If enabled, the validation will traverse nested objects and validate their properties as well.
     * Otherwise, nested objects themselves are ignored and only direct leaf fields participate.
     *
     * Defaults to `true` if no selectors are provided, and `false` otherwise.
     */
    recursive?: boolean;

    /**
     * Optional list of fields to exclude from the "at least one" check.
     *
     * This is useful in recursive mode to skip structural or metadata fields (like a discriminator field).
     */
    exclude?: ((p: SchemaPathTree<T>) => SchemaPathTree<unknown>)[];
}

/**
 * Each selector receives the current `SchemaPathTree<T>` and must return the
 * path of a field that should participate in the "at least one required" check.
 */
export type RequiredAtLeastOneSelector<T extends object> =
    (p: SchemaPathTree<T>) => SchemaPathTree<unknown>;

/**
 * Adds a cross-field validation rule to the given schema path that requires
 * at least one of multiple fields to be filled.
 *
 * This helper is useful for cases where several alternative inputs are allowed,
 * but at least one of them must contain a value.
 *
 * It supports two modes:
 * 1. **Selector-based**: Specify a list of fields to check.
 * 2. **Recursive root**: Check all leaf fields of the object at `path`.
 *
 * Typical examples:
 * - At least one of several contact channels must be filled.
 * - Either email or phone number must be provided.
 * - At least one field in a complex search/filter form must be filled.
 *
 * **Disabled and Hidden fields:**
 * Fields that are currently disabled or hidden (including entire subtrees) do not
 * participate in the validation. The validator only considers fields that are
 * currently "active" in the UI. If all selected fields are disabled or hidden,
 * the validation passes (returns `null`).
 *
 * The Validator returns an error if none of the active participating fields is filled.
 * The Error kind is `requiredAtLeastOne`.
 *
 * @typeParam T
 * The object type represented by the schema path on which the validator is registered.
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
 * @param options
 * Optional configuration for the validator.
 *
 * @param options.recursive
 * If `true`, the validator will traverse nested objects to find leaf fields.
 * If `false`, nested objects themselves are ignored.
 * Defaults to `true` when no selectors are provided, and `false` otherwise.
 *
 * @param options.message
 * The validation error message that is returned when none of the selected
 * fields is filled.
 *
 * @param options.attachTo
 * Optional selector that determines which field should receive the validation
 * error in the UI. If omitted, the error is attached to all participating fields.
 *
 * @param options.isFilled
 * Optional function that defines what should count as "filled".
 * By default, a value is considered filled when it is neither `null` nor `''`.
 *
 * @example
 * **Selector-based usage:**
 * ```ts
 * requiredAtLeastOne(
 *   path,
 *   [
 *     p => p.email,
 *     p => p.phone,
 *   ],
 *   { message: 'Please provide either email or phone.' }
 * );
 * ```
 *
 * @example
 * **Recursive root usage:**
 * ```ts
 * // Validates that at least one leaf field in the entire 'contact' object is filled.
 * requiredAtLeastOne(path.contact);
 * ```
 *
 * @example
 * **Recursive selectors:**
 * ```ts
 * // Validates that at least one field in 'address' OR the 'email' field is filled.
 * requiredAtLeastOne(path, [p => p.address, p => p.email], { recursive: true });
 * ```
 *
 * @example
 * **Excluding fields:**
 * ```ts
 * // Validates that at least one field is filled, but ignores the 'type' discriminator.
 * // which probably only decides if eg. a contact form should validate the
 * // `naturalPerson.firstname` field or the `legalPerson.companyName` field.
 * requiredAtLeastOne(path, { exclude: [p => p.type] });
 * ```
 *
 * @remarks
 * This helper models a real cross-field rule. That makes it preferable to
 * expressing the same behavior through multiple mirrored `required(..., { when })`
 * conditions, especially when more than two fields are involved.
 *
 * @category Validators
 */
export function requiredAtLeastOne<T extends object>(
    path: SchemaPath<T>,
    selectors: readonly [
        RequiredAtLeastOneSelector<T>,
        RequiredAtLeastOneSelector<T>,
        ...RequiredAtLeastOneSelector<T>[]
    ],
    options?: RequiredAtLeastOneOptions<T> & ErrorOption
): void;

export function requiredAtLeastOne<T extends object>(
    path: SchemaPath<T>,
    options?: RequiredAtLeastOneOptions<T> & ErrorOption
): void;


export function requiredAtLeastOne<T extends object>(
    path: SchemaPath<T>,
    selectorsOrOptions?:
        | readonly RequiredAtLeastOneSelector<T>[]
        | RequiredAtLeastOneOptions<T> & ErrorOption,
    maybeOptions?: RequiredAtLeastOneOptions<T> & ErrorOption,
): void {

    // Support both overloads:
    //   requiredAtLeastOne(path, selectors, options)
    //   requiredAtLeastOne(path, options)
    const hasSelectors = Array.isArray(selectorsOrOptions);

    const selectors = hasSelectors ? selectorsOrOptions : undefined;

    const options = hasSelectors ? maybeOptions : (selectorsOrOptions as RequiredAtLeastOneOptions<T> & ErrorOption);

    // Use custom "isFilled" logic if provided, otherwise fall back to a simple default
    // (non-null and non-empty string counts as filled)
    const isFilled = options?.isFilled ?? ((value: unknown) => value != null && value !== '');


    // Use provided message or fall back to a generic default
    const message = options?.error?.message ?? options?.message ?? undefined;

    const kind = options?.error?.kind ?? 'requiredAtLeastOne';

    // `requiredAtLeastOne(root)` means recursive root mode.
    const recursive = options?.recursive ?? !selectors;

    const excludedPaths = options?.exclude?.map(select => select(path as SchemaPathTree<T>)) ?? [];

    validateTree(path, (ctx) => {
        const pathTree = path as SchemaPathTree<T>;

        // Each selector may point either to:
        //  - a leaf field (e.g. p.email)
        //  - an object node (e.g. p.contact)
        //
        // When no selectors are supplied, the root object is used.
        const selectedRoots =
            selectors?.map((select) => select(pathTree)) ??
            [pathTree as SchemaPathTree<unknown>];

        // Expand every selected node into the actual fields that participate
        // in the validation.
        //
        // Examples:
        //   p.email           -> [email]
        //   p.contact         -> [phone, email]
        //   root              -> every leaf in the form
        const collected = selectedRoots.map((selectedRoot) =>
            collectLeafPaths(
                selectedRoot,
                ctx.valueOf(selectedRoot),
                recursive,
                ctx,
                false,
                excludedPaths
            ),
        );

        const selectedPaths = collected.flatMap((c) => c.active);
        const totalPaths = collected.flatMap((c) => c.total);

        // Validation succeeds as soon as any participating field is filled.
        const anyFilled = selectedPaths.some((selectedPath) =>
            isFilled(ctx.valueOf(selectedPath)),
        );

        if (anyFilled) {
            return null;
        }

        // If no fields are currently active/relevant, the validator passes.
        // We only do this if we actually HAD potential participating fields.
        if (selectedPaths.length === 0 && totalPaths.length > 0) {
            return null;
        }

        const targets = selectedPaths.length > 0 ? selectedPaths : selectedRoots;

        // Attach the error either to a dedicated container...
        if (options?.attachTo) {
            return {
                kind,
                message,
                fieldTree: ctx.fieldTreeOf(options.attachTo(pathTree)),
            };
        }

        // ...or to every participating field.
        return targets.map((selectedPath) => ({
            kind,
            message,
            fieldTree: ctx.fieldTreeOf(selectedPath),
        }));
    });

    /**
     * Expands a selected node into the leaf fields that should participate
     * in the validation.
     *
     * Examples:
     *
     *   email                  -> [email]
     *
     *   contact
     *     phone
     *     email                -> [phone, email]
     *
     *   address
     *     street
     *     city
     *     country.code         -> [street, city, code] (recursive mode)
     *
     * Objects are traversed recursively. Primitive values, arrays and Date
     * instances are treated as leaf values.
     */
    function collectLeafPaths(
        path: SchemaPathTree<unknown>,
        value: unknown,
        recursive: boolean,
        ctx: Parameters<Parameters<typeof validateTree>[1]>[0],
        parentInactive = false,
        excludedPaths: SchemaPathTree<unknown>[] = [],
    ): { active: SchemaPathTree<unknown>[]; total: SchemaPathTree<unknown>[] } {
        if (excludedPaths.includes(path)) {
            return { active: [], total: [] };
        }

        const state = ctx.stateOf(path);
        const isCurrentlyInactive = parentInactive || state.disabled() || state.hidden();

        // Primitive values already represent a leaf field.
        if (!isTraversableObject(value)) {
            return {
                active: isCurrentlyInactive ? [] : [path],
                total: [path],
            };
        }

        const active: SchemaPathTree<unknown>[] = [];
        const total: SchemaPathTree<unknown>[] = [];

        for (const key of Object.keys(value)) {
            const childValue = (value as Record<string, unknown>)[key];
            const childPath = (path as Record<string, SchemaPathTree<unknown>>)[key];

            if (isTraversableObject(childValue)) {
                // Nested objects only participate recursively when enabled.
                if (recursive) {
                    const childResult = collectLeafPaths(childPath, childValue, true, ctx, isCurrentlyInactive, excludedPaths);
                    active.push(...childResult.active);
                    total.push(...childResult.total);
                }
                continue;
            }

            // Primitive child → validation target.
            if (!excludedPaths.includes(childPath)) {
                total.push(childPath);
                if (!isCurrentlyInactive) {
                    const childState = ctx.stateOf(childPath);
                    if (!childState.disabled() && !childState.hidden()) {
                        active.push(childPath);
                    }
                }
            }
        }

        return { active, total };
    }

    /**
     * Returns whether a value should be traversed as an object.
     *
     * Arrays and Date objects are intentionally treated as leaf values,
     * since this validator validates fields, not collection contents.
     */
    function isTraversableObject(value: unknown): value is Record<string, unknown> {
        return (
            typeof value === 'object' &&
            value !== null &&
            !Array.isArray(value) &&
            !(value instanceof Date)
        );
    }

}

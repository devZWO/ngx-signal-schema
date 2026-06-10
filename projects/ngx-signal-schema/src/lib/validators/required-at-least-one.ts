import {SchemaPath, SchemaPathTree, validateTree} from "@angular/forms/signals";
import {ErrorOption} from "./error-options";

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
 * The Validator returns an error if none of the selected fields is filled.
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
 * @param options
 * Optional configuration for the validator.
 *
 * @param options.message
 * The validation error message that is returned when none of the selected
 * fields is filled.
 *
 * @param options.attachTo
 * Optional selector that determines which field should receive the validation
 * error in the UI. If omitted, the error is attached to the first selector.
 *
 * @param options.isFilled
 * Optional function that defines what should count as "filled".
 * By default, a value is considered filled when it is neither `null` nor `''`.
 * This can be overridden, for example, to treat whitespace-only strings as empty.

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
 * @remarks
 * This helper models a real cross-field rule. That makes it preferable to
 * expressing the same behavior through multiple mirrored `required(..., { when })`
 * conditions, especially when more than two fields are involved.
 *
 * @category Validators
 */
export function requiredAtLeastOne<
  T extends object
>(
  path: SchemaPath<T>,
  selectors: readonly [
    (p: SchemaPathTree<T>) => SchemaPathTree<unknown>,
    (p: SchemaPathTree<T>) => SchemaPathTree<unknown>,
    ...((p: SchemaPathTree<T>) => SchemaPathTree<unknown>)[]
  ],
  options?: {
    /**
     * Optional selector to determine which field should receive the validation error.
     * If omitted, the error is attached to all selected fields.
     */
    attachTo?: (p: SchemaPathTree<T>) => SchemaPathTree<unknown>;
    /**
     * Optional function to define what should count as "filled".
     */
    isFilled?: (value: unknown) => boolean;
    /**
     * Optional custom validation error message.
     * @deprecated Use `error.message` from `ErrorOption` instead.
     */
    message?: string,
  } & ErrorOption
): void {
  // Use custom "isFilled" logic if provided, otherwise fall back to a simple default
  // (non-null and non-empty string counts as filled)
  const isFilled = options?.isFilled ?? ((value: unknown) => value != null && value !== '');

  // Use provided message or fall back to a generic default
    const message = options?.error?.message ?? options?.message ?? undefined;
    const kind = options?.error?.kind ?? 'group.requiredAtLeastOne';

  validateTree(path, (ctx) => {
    const pathTree = path as SchemaPathTree<T>;

    // Resolve selector functions into concrete, root-bound schema paths.
    // After this line, we have the actual paths we want to validate.
    const selectedPaths = selectors.map((select) => select(pathTree));

    // Check if at least one of the selected fields is "filled".
    // We read each value via ctx.valueOf(...) and apply the isFilled logic.
    const anyFilled = selectedPaths.some((selectedPath) => {
      const value = ctx.valueOf(selectedPath);
      return isFilled(value);
    });

    // If at least one field is filled, validation passes → no error
    if (anyFilled) {
      return null;
    }

    // If a specific target field is configured, attach the error only there
    if (options?.attachTo) {
      return {
          kind: kind,
        message: message,
        // Resolve the target field path and attach the error to its FieldTree
        fieldTree: ctx.fieldTreeOf(options.attachTo(pathTree)),
      };
    }

    // Otherwise attach the same validation error to ALL selected fields.
    // This ensures each field shows the error in the UI.
    return selectedPaths.map((selectedPath) => ({
        kind: kind,
      message: message,
      // Convert SchemaPath -> FieldTree so Angular knows where to display the error
      fieldTree: ctx.fieldTreeOf(selectedPath),
    }));
  });
}

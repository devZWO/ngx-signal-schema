import {disabled, hidden, SchemaPath} from "@angular/forms/signals";
import {inactive} from './inactive';

/**
 * Options for configuring the disabled and hidden states.
 */
type LogicOptions = Parameters<typeof disabled>[1] & Parameters<typeof hidden>[1];

/**
 * Applies a combined "inactive UI" state by both disabling and hiding a field.
 *
 * Use this when a field should not be visible and should also be non-interactive
 * at the control level while hidden. Note that `hidden()` alone already excludes
 * the field from validation / parent form state; this helper additionally applies
 * the disabled state so bound controls reflect disabled semantics as well.
 *
 * This is fully type-agnostic and can be used for any field shape.
 *
 * @param fieldPath - The schema path to the field.
 * @param options - Configuration for the disabled/hidden states. Can be a boolean, a function returning boolean, or an Observable/Signal.
 *
 * @example
 * disabledHidden(path.secretCode, not(valueEquals(path.isAdmin, true)));
 *
 * @deprecated
 * The name disabledHidden was technically correct, but it does not show its purpose. so it was renamed to `inactive`.
 * Use `inactive` instead.
 */
export function disabledHidden<T>(fieldPath: SchemaPath<T>, options?: LogicOptions): void {
  inactive(fieldPath, options);
}

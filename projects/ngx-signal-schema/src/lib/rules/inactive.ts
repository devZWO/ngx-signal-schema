import {disabled, hidden, SchemaPath} from '@angular/forms/signals';

/**
 * Options for configuring the disabled and hidden states.
 */
type LogicOptions = Parameters<typeof disabled>[1] & Parameters<typeof hidden>[1];

/**
 * Marks a field as inactive in the current UI branch.
 *
 * This is useful for conditional form branches where a field is currently not
 * applicable, for example, switching between natural person and legal entity.
 *
 * `hidden()` removes the field from the visible/active form state and validation.
 * `disabled()` additionally propagates disabled semantics to bound controls,
 * making the inactive branch explicit at both schema and control level.
 *
 * This is fully type-agnostic and can be used for any field shape.
 *
 * @param fieldPath - The schema path to the field.
 * @param options - Configuration for the disabled/hidden states. Can be a boolean, a function returning boolean, or an Observable/Signal.
 *
 * @example
 * inactive(path.secretCode, not(valueEquals(path.isAdmin, true)));
 */
export function inactive<T>(fieldPath: SchemaPath<T>, options?: LogicOptions): void {
  disabled(fieldPath, options);
  hidden(fieldPath, options ?? (() => true));
}

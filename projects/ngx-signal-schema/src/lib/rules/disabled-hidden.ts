import {disabled, hidden, SchemaPath} from "@angular/forms/signals";

/**
 * Options for configuring the disabled and hidden states.
 */
type LogicOptions = Parameters<typeof disabled>[1] & Parameters<typeof hidden>[1];

/**
 * Applies a generic "inactive UI" state by both disabling and hiding a field.
 *
 * This is a structural helper that simplifies common UI requirements where
 * a field that is not relevant should be both non-editable and invisible.
 * This is useful because disabled fields are not validated and not respected when submitting forms.
 *
 * This is fully type-agnostic and can be used for any field shape.
 *
 * @param fieldPath - The schema path to the field.
 * @param options - Configuration for the disabled/hidden states. Can be a boolean, a function returning boolean, or an Observable/Signal.
 *
 * @example
 * disabledHidden(path.secretCode, (ctx) => !ctx.valueOf(path.isAdmin));
 */
export function disabledHidden<T>(fieldPath: SchemaPath<T>, options?: LogicOptions): void {
  disabled(fieldPath, options);
  hidden(fieldPath, options ?? (() => true));
}

import {disabled, hidden, SchemaPath} from "@angular/forms/signals";

type LogicOptions = Parameters<typeof disabled>[1] & Parameters<typeof hidden>[1];

/**
 * Applies a generic "inactive UI" state:
 * - readonly
 * - hidden
 *
 * This is fully type-agnostic and can be used for any field shape.
 */
export function disabledHidden<T>(fieldPath: SchemaPath<T>, options?: LogicOptions): void {
  disabled(fieldPath, options);
  hidden(fieldPath, options ?? (() => true));
}

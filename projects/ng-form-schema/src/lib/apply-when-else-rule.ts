import {applyWhen, LogicFn, SchemaOrSchemaFn, type SchemaPath} from '@angular/forms/signals';

/**
 * Applies `thenSchema` when `when` evaluates to true,
 * otherwise applies `elseSchema`.
 */
export function applyIf<T>(
  path: SchemaPath<T>,
  when: LogicFn<T, boolean>,
  thenSchema: SchemaOrSchemaFn<T>,
  elseSchema: SchemaOrSchemaFn<T>,
): void {
  applyWhen(path, when, thenSchema);
  applyWhen(path, (ctx) => !when(ctx), elseSchema);
}

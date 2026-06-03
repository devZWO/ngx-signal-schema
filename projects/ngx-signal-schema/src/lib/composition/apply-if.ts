import {applyWhen, LogicFn, SchemaOrSchemaFn, type SchemaPath} from '@angular/forms/signals';

/**
 * Conditionally applies one of two schemas based on a predicate.
 *
 * This is a structural helper that allows branching validation logic.
 *
 * @param path - The schema path to apply the conditions to.
 * @param when - A predicate function that receives the validation context and returns a boolean.
 * @param thenSchema - The schema or conditions to apply if the predicate is true.
 * @param elseSchema - The schema or conditions to apply if the predicate is false.
 *
 * @example
 * applyIf(
 *   path,
 *   (ctx) => ctx.valueOf(path.isCompany),
 *   CompanySchema,
 *   PersonSchema
 * );
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

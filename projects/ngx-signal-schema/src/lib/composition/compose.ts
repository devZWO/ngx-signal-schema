import {apply, Schema, schema, type SchemaOrSchemaFn, SchemaPath} from '@angular/forms/signals';


/**
 * Combines multiple schemas into a single schema.
 *
 * The `compose` function allows extending a base schema with additional schemas or conditions.
 * This is particularly useful for reusing existing validation logic and augmenting it with
 * context-specific conditions (e.g., disabling fields).
 *
 * @param base - The base schema serving as the foundation.
 * @param extension - Additional schemas or conditions to be applied to the base schema.
 * @returns A new `Schema<T>` containing all combined conditions.
 *
 * @example
 * // Combining multiple schemas
 * const combinedSchema = compose(MyDefaultSchema, RequiredFieldsSchema, ExtendedSchema);
 *
 * @example
 * // Extending a schema with a disable rule
 * const combinedSchema = compose(MyDefaultSchema, disabled);
 *
 * @example
 * // Extending a schema with complex conditions
 * const combinedSchema = compose(MyDefaultSchema, (fieldPath) => {
 *   disabled(fieldPath.firstname);
 *   hidden(fieldPath.lastname);
 * });
 */
export function compose<T>(
  base: SchemaOrSchemaFn<T>,
  ...extension: SchemaOrSchemaFn<T>[]
): Schema<T> {
  return schema<T>((fieldPath) => {
    apply(fieldPath as SchemaPath<T>, base)

    extension.forEach(extension =>
      apply(fieldPath as SchemaPath<T>, extension)
    )
  });
}

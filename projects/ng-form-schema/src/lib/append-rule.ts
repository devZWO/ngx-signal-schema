import {apply, Schema, schema, type SchemaOrSchemaFn, SchemaPath} from '@angular/forms/signals';


/**
 * Combines multiple schemas into a single schema.
 *
 * The `append` function allows extending a base schema with additional schemas or rules.
 * This is particularly useful for reusing existing validation logic and augmenting it with
 * context-specific rules (e.g., disabling fields).
 *
 * @param base The base schema serving as the foundation.
 * @param extension Additional schemas or rules to be applied to the base schema.
 * @returns A new `Schema<T>` containing all combined rules.
 *
 * @example
 * // Combining multiple schemas
 * const combinedSchema = append(MyDefaultSchema, RequiredFieldsSchema, ExtendedSchema);
 *
 * @example
 * // Extending a schema with a disable rule
 * const combinedSchema = append(MyDefaultSchema, disabled);
 *
 * @example
 * // Extending a schema with complex rules
 * const combinedSchema = append(MyDefaultSchema, (fieldPath) => {
 *   disabled(fieldPath.firstname);
 *   hidden(fieldPath.lastname);
 * });
 */
export function composeSchema<T>(
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

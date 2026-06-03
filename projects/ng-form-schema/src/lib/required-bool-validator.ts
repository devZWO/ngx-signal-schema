import {SchemaPath, validate, ValidationError} from "@angular/forms/signals";

/**
 * Validator that ensures a value is defined (not null or undefined).
 *
 * This is particularly useful for boolean fields where the standard `required` validator
 * might fail or behave unexpectedly. In many validation systems, `required` treats `false`
 * as a missing value (falsy), which is incorrect for booleans where `false` is a valid
 * and often mandatory selection. This validator explicitly checks that a value is
 * present, regardless of whether it is `true` or `false`.
 */
export function requiredDefined<T>(path: SchemaPath<T>) {
  validate(path, (ctx): ValidationError | null => {
    const value = ctx.value();

    if (value !== null && value !== undefined) {
      return null;
    }

    return {
      kind: 'required',
    }
  });
}

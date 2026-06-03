import {SchemaPath} from "@angular/forms/signals";

/**
 * Context provided to a schema rule, allowing access to form values.
 *
 * @example
 * const value = ctx.valueOf(path.myField);
 */
export type SchemaRuleContext = {
  /**
   * Retrieves the current value of a field at the specified path.
   *
   * @param path - The schema path to the field.
   * @returns The value of the field.
   */
  valueOf<T>(path: SchemaPath<T>): T;
};

/**
 * A rule that evaluates a condition based on the schema context.
 * Used for conditional logic like visibility or enablement.
 *
 * @example
 * const myRule: SchemaRule = (ctx) => ctx.valueOf(path.someField) === 'active';
 *
 * @param ctx - The context providing access to the schema state.
 * @returns True if the condition is met, false otherwise.
 */
export type SchemaRule = (ctx: SchemaRuleContext) => boolean;

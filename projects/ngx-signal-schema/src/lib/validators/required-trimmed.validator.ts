import {SchemaPath, validate} from "@angular/forms/signals";

/**
 * A validator for signal-based forms that checks if a string value is present after trimming whitespace.
 * Returns a 'required' error if the value is null, undefined, or empty after trimming.
 *
 * @param path - The schema path to the string field to be validated.
 * 
 * @example
 * requiredTrimmed(path.username);
 */
export function requiredTrimmed(path: SchemaPath<string | null | undefined>): void {
 validate(path, (ctx) => {
   const trimmed = ctx.value()?.trim();

   if(!trimmed) {
     return {
       kind: 'required'
     }
   }

   return null;
 })
}

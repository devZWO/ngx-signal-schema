import {SchemaPath, SchemaPathTree, validateTree} from "@angular/forms/signals";

/**
 * Cross-field validator:
 * Makes the target field required if the source field is filled.
 *
 * This is useful for conditional dependencies where filling out one field
 * requires filling out another.
 *
 * @example
 * requiredIfOtherFilled(
 *   path,
 *   (p) => p.Street, // if this field is filled,
 *   (p) => p.HouseNumber // then this field is required
 * );
 *
 * @param path - The common parent schema path.
 * @param sourceSelector - Function to select the "driving" field from the schema path tree.
 * @param targetSelector - Function to select the field that becomes required from the schema path tree.
 * @param options - Optional configuration for the validator.
 */
export function requiredIfOtherFilled<T>(
  path: SchemaPath<T>,
  sourceSelector: (p: SchemaPathTree<T>) => SchemaPathTree<unknown>,
  targetSelector: (p: SchemaPathTree<T>) => SchemaPathTree<unknown>,
  options?: {
    /**
     * Optional function to determine if a value is considered "filled".
     */
    isFilled?: (value: unknown) => boolean;
    /**
     * Optional custom error message.
     */
    message?: string,
    /**
     * Optional error kind (defaults to 'required').
     */
    kind?: string,
  }
): void {
  validateTree(path, (ctx) => {
    const isFilled = options?.isFilled ?? ((value: unknown) => value != null && value !== '');
    const kind = options?.kind ?? 'required';
    const message = options?.message ?? undefined;

    const pathTree = path as SchemaPathTree<T>;

    const sourceValue = ctx.valueOf(sourceSelector(pathTree));
    const targetValue = ctx.valueOf(targetSelector(pathTree));

    if (!isFilled(sourceValue) || isFilled(targetValue)) {
      return null;
    }

    return {
      kind: kind,
      message: message,
      fieldTree: ctx.fieldTreeOf(targetSelector(pathTree)),
    };
  });
}

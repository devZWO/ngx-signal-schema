import {SchemaPath, SchemaPathTree, validateTree} from "@angular/forms/signals";

/**
 * Cross-field validator:
 * Makes the target field required if the source field is filled.
 *
 * This is useful for conditional dependencies where filling out one field
 * necessitates filling out another.
 *
 * @param path The common parent schema path.
 * @param sourceSelector Function to select the "driving" field.
 * @param targetSelector Function to select the field that becomes required.
 * @param options Validation options.
 */
export function requiredIfOtherFilled<T>(
  path: SchemaPath<T>,
  sourceSelector: (p: SchemaPathTree<T>) => SchemaPathTree<unknown>,
  targetSelector: (p: SchemaPathTree<T>) => SchemaPathTree<unknown>,
  options?: {
    isFilled?: (value: unknown) => boolean;
    message?: string,
    kind?: string,
  }
): void {
  validateTree(path, (ctx) => {
    const isFilled = options?.isFilled ?? ((value: unknown) => value != null && value !== '');
    const kind = options?.kind ?? 'required';
    const message = options?.message ?? undefined;

    // Cast the current schema path to a tree-shaped path object so selectors
    // can access child paths like `p.someField`.
    const pathTree = path as unknown as SchemaPathTree<T>;

    // Resolve selector functions into concrete, root-bound schema paths.
    // And get their field value
    // After this line, we have the actual values we want to validate.
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

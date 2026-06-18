/**
 * ## ArrayBlock<T> – Purpose and Usage
 *
 * ### Why this exists
 *
 * @Deprecated since Angular v22. most use cases can be solved by using plain raw arrays.
 *
 * `ArrayBlock<T>` is a lightweight wrapper around a plain array that enables **type-safe and explicit control** over array-level form state in Angular Signal Forms.
 *
 * While Angular Signal Forms natively support raw arrays (e.g. `T[]`), `ArrayBlock<T>` provides several advantages for developer experience and structural clarity:
 *
 * * **Type-safe addressability**: Items within a raw array are not natively exposed with numeric index signatures in the `FieldTree` or `SchemaPath` types. `ArrayBlock<T>` provides a named `items` property that is fully typed, allowing you to access `form.items[0]` or `path.items[0]` without type casting.
 * * **Explicit Container Node**: It introduces a dedicated container node for the collection itself. This is especially useful for attaching collection-level validation errors (e.g., "minimum 3 items") to a stable, addressable path (`items`) rather than the array root.
 * * **Consistent API Surface**: By using an object wrapper, you ensure that the collection behaves exactly like other object-based form nodes, making state propagation and conditional logic more predictable in complex schemas.
 *
 * `ArrayBlock<T>` solves this by introducing a **dedicated container node** with a named `items` property.
 *
 * ---
 *
 * ### What problem it solves
 *
 * Without `ArrayBlock<T>`:
 *
 * ```ts
 * schema<string[]>(ctx => {
 *   readonly(ctx); // ✅ Marks the array as readonly and propagates to items
 *   // ⚠️ But index access is not type-safe: (myForm as any)[0]
 *
 *   validate(ctx, items => items.length > 0 ? null : { minLength: true });
 *   // ✅ Validation runs and error exists in summary
 *   // ⚠️ But attaching errors to a stable path for the UI is more manual
 * });
 * ```
 *
 * With `ArrayBlock<T>`:
 *
 * ```ts
 * schema<ArrayBlock<string>>(ctx => {
 *   readonly(ctx); // ✅ Works perfectly
 *   // ✅ Item fields are fully addressable: myForm.items[0]
 * });
 * ```
 *
 * This allows you to:
 *
 * * **Type-safe access** to items via `items[0]` on both the form and schema path
 * * **Explicit collection state** (readonly, disabled) with clear structural intent
 * * **Easier UI binding** for collection-level errors via the stable `items` path
 * * **Predictable behavior** for complex nested forms
 *
 * ---
 *
 * ### Design goals
 *
 * * **No parallel state model**
 *   Keeps all state inside the Signal Forms system (no external `locked` flags needed)
 *
 * * **Minimal abstraction**
 *   Adds only a thin wrapper without changing the semantics of your data
 *
 * * **Composable**
 *   Works seamlessly with existing patterns like `OptionalBlock<T>`
 *
 * * **Non-invasive**
 *   Can be introduced only where needed (e.g. for specific form fields)
 *
 * ---
 *
 * ### Usage
 *
 * #### Interface definition
 *
 * ```ts
 * export interface ArrayBlock<T> {
 *   items: T[];
 * }
 * ```
 *
 * #### Mapping helpers
 *
 * ```ts
 * function toArrayBlock<T>(items: T[]): ArrayBlock<T> {
 *   return { items };
 * }
 *
 * function fromArrayBlock<T>(arrayBlock: ArrayBlock<T>): T[] {
 *   return arrayBlock.items;
 * }
 * ```
 *
 * These functions allow you to:
 *
 * * Convert incoming DTOs into a form-compatible structure
 * * Convert back to the original shape when persisting data
 *
 * ---
 *
 * ### Example in a form schema
 *
 * ```ts
 * const schema = schema<ArrayBlock<Datei>>(ctx => {
 *   readonly(ctx); // locks the entire array
 *
 *   applyEach(ctx.items, item => {
 *     readonly(item.id);
 *     readonly(item.originalName);
 *   });
 * });
 * ```
 *
 * ---
 *
 * ### When to use it
 *
 * Use `ArrayBlock<T>` when:
 *
 * * You want **type-safe access** to individual items (e.g. `form.items[0]`) without `as any`
 * * You need to apply **schema rules to specific indices** in a typed way
 * * You have **complex collection-level validation** that should be bound to a named UI path
 * * You want to maintain a **strict, object-oriented form structure**
 *
 * Do **not** use it if:
 *
 * * You are working with a simple list of values and don't need typed index access
 * * You prefer the **cleanest possible JSON model** and handle item-level logic via iteration (e.g. `@for`)
 *
 * ---
 *
 * ### Conceptual summary
 *
 * `ArrayBlock<T>` is not a domain model construct.
 * It is a **form modeling tool** that bridges a gap in how Signal Forms handle arrays.
 *
 * It turns this:
 *
 * ```ts
 * T[]
 * ```
 *
 * into this:
 *
 * ```ts
 * { items: T[] }
 * ```
 *
 * so that the array becomes a **first-class form node** with its own stable, addressable path.
 *
 * ---
 *
 * @category deprecated
 */
export interface ArrayBlock<T> {
    items: T[];
}

/**
 * Helper function to convert an array into an ArrayBlock.
 * @param items The array of items to be wrapped.
 *
 * @Deprecated since Angular v22. most use cases can be solved by using plain raw arrays.
 *
 * @category deprecated
 */
export function toArrayBlock<T>(items: T[] | null): ArrayBlock<T> {
    return {items: items ?? []};
}

/**
 * Helper function to convert an ArrayBlock back to an array.
 * @param arrayBlock The ArrayBlock to extract the items from.
 *
 * @Deprecated since Angular v22. most use cases can be solved by using plain raw arrays.
 *
 * @category deprecated
 */
export function fromArrayBlock<T>(arrayBlock: ArrayBlock<T>): T[] {
    return arrayBlock.items;
}

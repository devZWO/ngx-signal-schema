---
editUrl: false
next: false
prev: false
title: "ArrayBlock"
---

Defined in: projects/ngx-signal-schema/src/lib/structure/array-block.ts:144

## ArrayBlock<T> – Purpose and Usage

### Why this exists

`ArrayBlock<T>` is a lightweight wrapper around a plain array that enables **full compatibility with Angular Signal Forms**, especially when working with array-level form state such as `readonly`, `disabled`, **validation**, or conditional schema logic.

In Angular Signal Forms, many APIs (e.g. `readonly`, `applyWhen`, `disabled`, `validate`) are designed to operate on **addressable field nodes**. While this works well for objects and primitive fields, arrays are a special case:

* Applying `readonly(ctx)` or `validate(ctx, ...)` directly to a `SchemaPath<T[]>` (i.e. a raw array) does **not reliably propagate** to the form state. In fact, **validations on raw arrays are ignored.**
* Arrays lack a natural “container control” in the same way objects do.
* As a result, array-level concerns (like locking the entire collection) cannot be expressed cleanly.

`ArrayBlock<T>` solves this by introducing a **dedicated container node** that Signal Forms can attach state to.

---

### What problem it solves

Without `ArrayBlock<T>`:

```ts
schema<Datei[]>(ctx => {
  readonly(ctx); // ❌ Has no effect on array-level state
  validate(ctx, items => items.length > 0 ? null : { minLength: true }); // ❌ Ignored
});
```

With `ArrayBlock<T>`:

```ts
schema<ArrayBlock<Datei>>(ctx => {
  readonly(ctx); // ✅ Works as expected
});
```

This allows you to:

* Mark the **entire array as readonly**
* Apply **validation logic** at the array level (e.g. min/max length)
* Apply **conditional logic** at the array level
* Use Signal Forms APIs consistently without special-casing arrays

---

### Design goals

* **No parallel state model**
  Keeps all state inside the Signal Forms system (no external `locked` flags needed)

* **Minimal abstraction**
  Adds only a thin wrapper without changing the semantics of your data

* **Composable**
  Works seamlessly with existing patterns like `OptionalBlock<T>`

* **Non-invasive**
  Can be introduced only where needed (e.g. for specific form fields)

---

### Usage

#### Interface definition

```ts
export interface ArrayBlock<T> {
  items: T[];
}
```

#### Mapping helpers

```ts
function toArrayBlock<T>(items: T[]): ArrayBlock<T> {
  return { items };
}

function fromArrayBlock<T>(arrayBlock: ArrayBlock<T>): T[] {
  return arrayBlock.items;
}
```

These functions allow you to:

* Convert incoming DTOs into a form-compatible structure
* Convert back to the original shape when persisting data

---

### Example in a form schema

```ts
const schema = schema<ArrayBlock<Datei>>(ctx => {
  readonly(ctx); // locks the entire array

  applyEach(ctx.items, item => {
    readonly(item.id);
    readonly(item.originalName);
  });
});
```

---

### When to use it

Use `ArrayBlock<T>` when:

* You need **array-level form state** (readonly, disabled, conditional logic)
* You want to stay fully within **Signal Forms APIs**
* You want to avoid introducing **external UI state** (like separate `locked` flags)

Do **not** use it if:

* You only need to display or edit array items individually
* You don’t require any array-level behavior

---

### Conceptual summary

`ArrayBlock<T>` is not a domain model construct.
It is a **form modeling tool** that bridges a gap in how Signal Forms handle arrays.

It turns this:

```ts
T[]
```

into this:

```ts
{ items: T[] }
```

so that the array becomes a **first-class form node** with its own state.

---

## Type Parameters

### T

`T`

## Properties

### items

> **items**: `T`[]

Defined in: projects/ngx-signal-schema/src/lib/structure/array-block.ts:145

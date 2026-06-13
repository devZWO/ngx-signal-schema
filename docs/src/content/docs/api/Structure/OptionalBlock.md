---
editUrl: false
next: false
prev: false
title: "OptionalBlock"
---

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:39

Represents an optional object block in a Signal Form.

Angular Signal Forms can handle `null` values for primitive fields,
but optional object structures (form groups with nested fields) are
harder to model because the form tree requires an object to exist.

`OptionalBlock` solves this by wrapping the actual domain data in a
stable container object. The form always works with a valid object
structure, while the `meta.enabled` flag controls whether the block
should be considered present or absent.

This is especially useful for optional sections such as:

- Billing address
- Alternative contact person
- Company information
- VAT details

During form editing, the object always exists. During serialization,
disabled blocks can be treated as `null` or omitted entirely.

## Example

```ts
interface ContactForm {
  invoiceRecipient: OptionalBlock<InvoiceRecipient>;
}

if (form.invoiceRecipient.meta.enabled) {
  // use invoiceRecipient.data
}
```

## Type Parameters

### T

`T`

The wrapped domain model.

### K

`K` = `boolean`

The type of the enabled flag (defaults to boolean).

## Properties

### data

> **data**: `T`

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:41

***

### meta

> **meta**: `object`

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:40

#### enabled

> **enabled**: `K`

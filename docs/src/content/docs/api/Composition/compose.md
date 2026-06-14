---
editUrl: false
next: false
prev: false
title: "compose"
---

> **compose**\<`T`\>(`base`, ...`extension`): `Schema`\<`T`\>

Defined in: projects/ngx-signal-schema/src/lib/composition/compose.ts:32

Combines multiple schemas into a single schema.

The `compose` function allows extending a base schema with additional schemas or conditions.
This is particularly useful for reusing existing validation logic and augmenting it with
context-specific conditions (e.g., disabling fields).

## Type Parameters

### T

`T`

## Parameters

### base

`SchemaOrSchemaFn`\<`T`\>

The base schema serving as the foundation.

### extension

...`SchemaOrSchemaFn`\<`T`\>[]

Additional schemas or conditions to be applied to the base schema.

## Returns

`Schema`\<`T`\>

A new `Schema<T>` containing all combined conditions.

## Examples

```ts
// Combining multiple schemas
const combinedSchema = compose(MyDefaultSchema, RequiredFieldsSchema, ExtendedSchema);
```

```ts
// Extending a schema with a disable rule
const combinedSchema = compose(MyDefaultSchema, disabled);
```

```ts
// Extending a schema with complex conditions
const combinedSchema = compose(MyDefaultSchema, (fieldPath) => {
  disabled(fieldPath.firstname);
  hidden(fieldPath.lastname);
});
```

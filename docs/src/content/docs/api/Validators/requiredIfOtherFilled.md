---
editUrl: false
next: false
prev: false
title: "requiredIfOtherFilled"
---

> **requiredIfOtherFilled**\<`T`\>(`path`, `sourceSelector`, `targetSelector`, `options?`): `void`

Defined in: projects/ngx-signal-schema/src/lib/validators/required-if-other-filled.ts:25

Cross-field validator:
Makes the target field required if the source field is filled.

This is useful for conditional dependencies where filling out one field
requires filling out another.

## Type Parameters

### T

`T`

## Parameters

### path

`SchemaPath`\<`T`\>

The common parent schema path.

### sourceSelector

(`p`) => `SchemaPath`\<`unknown`\>

Function to select the "driving" field from the schema path tree.

### targetSelector

(`p`) => `SchemaPath`\<`unknown`\>

Function to select the field that becomes required from the schema path tree.

### options?

`object` & [`ErrorOption`](/ngx-signal-schema/api/other/erroroption/)

Optional configuration for the validator.

## Returns

`void`

## Example

```ts
requiredIfOtherFilled(
  path,
  (p) => p.Street, // if this field is filled,
  (p) => p.HouseNumber // then this field is required
);
```

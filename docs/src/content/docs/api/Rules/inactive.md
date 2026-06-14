---
editUrl: false
next: false
prev: false
title: "inactive"
---

> **inactive**\<`T`\>(`fieldPath`, `options?`): `void`

Defined in: projects/ngx-signal-schema/src/lib/rules/inactive.ts:28

Marks a field as inactive in the current UI branch.

This is useful for conditional form branches where a field is currently not
applicable, for example, switching between natural person and legal entity.

`hidden()` removes the field from the visible/active form state and validation.
`disabled()` additionally propagates disabled semantics to bound controls,
making the inactive branch explicit at both schema and control level.

This is fully type-agnostic and can be used for any field shape.

## Type Parameters

### T

`T`

## Parameters

### fieldPath

`SchemaPath`\<`T`\>

The schema path to the field.

### options?

`LogicOptions`

Configuration for the disabled/hidden states. Can be a boolean, a function returning boolean, or an Observable/Signal.

## Returns

`void`

## Example

```ts
inactive(path.secretCode, not(valueEquals(path.isAdmin, true)));
```

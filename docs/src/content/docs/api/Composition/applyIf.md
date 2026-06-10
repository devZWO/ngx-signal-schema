---
editUrl: false
next: false
prev: false
title: "applyIf"
---

> **applyIf**\<`T`\>(`path`, `when`, `thenSchema`, `elseSchema`): `void`

Defined in: projects/ngx-signal-schema/src/lib/composition/apply-if.ts:18

Conditionally applies one of two schemas based on a predicate.

This is a structural helper that allows branching validation logic.

## Type Parameters

### T

`T`

## Parameters

### path

`SchemaPath`\<`T`\>

The schema path to apply the conditions to.

### when

`LogicFn`\<`T`, `boolean`\>

A predicate function that receives the validation context and returns a boolean.

### thenSchema

`SchemaOrSchemaFn`\<`T`\>

The schema or conditions to apply if the predicate is true.

### elseSchema

`SchemaOrSchemaFn`\<`T`\>

The schema or conditions to apply if the predicate is false.

## Returns

`void`

## Example

```ts
applyIf(path, valueEquals(path.isCompany, true), CompanySchema, PersonSchema);
```

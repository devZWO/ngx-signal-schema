---
editUrl: false
next: false
prev: false
title: "isOptionalBlock"
---

> **isOptionalBlock**\<`T`, `K`\>(`obj`): `obj is OptionalBlock<T, K>`

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:61

Type guard for OptionalBlock.
Checks if the given object matches the structure of an OptionalBlock.

## Type Parameters

### T

`T` = `unknown`

### K

`K` = `boolean`

## Parameters

### obj

`unknown`

The object to check.

## Returns

`obj is OptionalBlock<T, K>`

True if the object is an OptionalBlock, false otherwise.

## Example

```ts
const maybeBlock: unknown = { meta: { enabled: true }, data: { id: 1 } };
if (isOptionalBlock<{ id: number }>(maybeBlock)) {
  // maybeBlock is now typed as OptionalBlock<{ id: number }>
  console.log(maybeBlock.data.id);
}
```

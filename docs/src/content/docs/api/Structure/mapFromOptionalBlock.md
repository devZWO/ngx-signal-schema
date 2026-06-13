---
editUrl: false
next: false
prev: false
title: "mapFromOptionalBlock"
---

> **mapFromOptionalBlock**\<`T`, `R`\>(`block`): `T` \| `null`

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:102

Maps an OptionalBlock to its data if it is enabled, otherwise returns null.
Useful for mapping form values back to domain models or DTOs.

## Type Parameters

### T

`T`

### R

`R` = `boolean`

## Parameters

### block

[`OptionalBlock`](/ngx-signal-schema/api/structure/optionalblock/)\<`T`, `R`\>

The OptionalBlock to map.

## Returns

`T` \| `null`

The data if enabled, null otherwise.

## Example

```ts
const block = { meta: { enabled: true }, data: { name: 'John' } };
const data = mapFromOptionalBlock(block); // { name: 'John' }

const disabledBlock = { meta: { enabled: false }, data: { name: 'John' } };
const noData = mapFromOptionalBlock(disabledBlock); // null
```

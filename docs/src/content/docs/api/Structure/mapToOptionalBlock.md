---
editUrl: false
next: false
prev: false
title: "mapToOptionalBlock"
---

> **mapToOptionalBlock**\<`T`\>(`data`, `enabled?`): [`OptionalBlock`](/ngx-signal-schema/api/structure/optionalblock/)\<`T`\>

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:120

Creates an OptionalBlock from the given data and enabled state.
Useful for mapping domain models or DTOs to form values.

## Type Parameters

### T

`T`

## Parameters

### data

`T`

The data to wrap.

### enabled?

`boolean` = `true`

Whether the block should be enabled by default. Defaults to true.

## Returns

[`OptionalBlock`](/ngx-signal-schema/api/structure/optionalblock/)\<`T`\>

An OptionalBlock containing the data and enabled state.

## Example

```ts
const block = mapToOptionalBlock({ name: 'John' });
// { meta: { enabled: true }, data: { name: 'John' } }
```

---
editUrl: false
next: false
prev: false
title: "ApplyOptionalOptions"
---

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:136

Options for applying rules or schemas to an OptionalBlock.

## Type Parameters

### T

`T`

The type of the data inside the block.

### K

`K`

The type of the enabled property in meta.

## Properties

### isEnabled?

> `optional` **isEnabled?**: (`enabled`) => `boolean`

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:152

A function to determine if the block is enabled based on the `meta.enabled` value.
Supports complex logic when `K` is not just a boolean.

#### Parameters

##### enabled

`K`

The value of `meta.enabled`.

#### Returns

`boolean`

True if the block should be treated as enabled.

***

### otherwise?

> `optional` **otherwise?**: `SchemaOrSchemaFn`\<`T`\>

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:144

Inline rules or schema applied to the `data` node when the block is considered disabled.

***

### then

> **then**: `SchemaOrSchemaFn`\<`T`\>

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:140

Inline rules or schema applied to the `data` node when the block is considered enabled.

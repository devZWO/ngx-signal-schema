---
editUrl: false
next: false
prev: false
title: "RequiredAtLeastOneOptions"
---

Defined in: projects/ngx-signal-schema/src/lib/validators/required-at-least-one.ts:5

## Type Parameters

### T

`T` *extends* `object`

## Properties

### attachTo?

> `optional` **attachTo?**: (`p`) => `SchemaPath`\<`unknown`\>

Defined in: projects/ngx-signal-schema/src/lib/validators/required-at-least-one.ts:11

Optional selector to determine which field should receive the validation error.
If omitted, the error is attached to all participating fields.

#### Parameters

##### p

`SchemaPathTree`\<`T`\>

#### Returns

`SchemaPath`\<`unknown`\>

***

### exclude?

> `optional` **exclude?**: (`p`) => `SchemaPath`\<`unknown`\>[]

Defined in: projects/ngx-signal-schema/src/lib/validators/required-at-least-one.ts:40

Optional list of fields to exclude from the "at least one" check.

This is useful in recursive mode to skip structural or metadata fields (like a discriminator field).

#### Parameters

##### p

`SchemaPathTree`\<`T`\>

#### Returns

`SchemaPath`\<`unknown`\>

***

### isFilled?

> `optional` **isFilled?**: (`value`) => `boolean`

Defined in: projects/ngx-signal-schema/src/lib/validators/required-at-least-one.ts:17

Optional function to define what should count as "filled".
By default, a value is considered filled if it is neither `null` nor an empty string (`''`).

#### Parameters

##### value

`unknown`

#### Returns

`boolean`

***

### ~~message?~~

> `optional` **message?**: `string`

Defined in: projects/ngx-signal-schema/src/lib/validators/required-at-least-one.ts:23

Optional custom validation error message.

:::caution[Deprecated]
Use `error.message` from `ErrorOption` instead.
:::

***

### recursive?

> `optional` **recursive?**: `boolean`

Defined in: projects/ngx-signal-schema/src/lib/validators/required-at-least-one.ts:33

Optional flag to enable recursive validation of nested objects.

If enabled, the validation will traverse nested objects and validate their properties as well.
Otherwise, nested objects themselves are ignored and only direct leaf fields participate.

Defaults to `true` if no selectors are provided, and `false` otherwise.

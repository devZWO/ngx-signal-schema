---
editUrl: false
next: false
prev: false
title: "optionalBlock"
---

## Call Signature

> **optionalBlock**\<`T`\>(`then`, `otherwise?`): `Schema`\<[`OptionalBlock`](/ngx-signal-schema/api/structure/optionalblock/)\<`T`, `boolean`\>\>

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:300

Creates a reusable schema for `OptionalBlock<T>`.

Use this when an API expects a `Schema<OptionalBlock<T>>`, for example in
`form(...)`, `apply(...)`, or when composing reusable schemas.

Internally this applies the same optional-block behavior as `applyOptional`,
but instead of applying it immediately to an existing `fieldPath`, it returns
a schema that can be applied later.

The `then` inline rules or schema are applied to the block's `data` node when
`meta.enabled` evaluates to `true`.

If `otherwise` is provided, it is applied to the block's `data` node when
`meta.enabled` evaluates to `false`.

### Type Parameters

#### T

`T`

### Parameters

#### then

`SchemaOrSchemaFn`\<`T`\>

inline rules or schema applied when `meta.enabled` evaluates to `true`.

#### otherwise?

`SchemaOrSchemaFn`\<`T`\>

inline rules or schema applied when `meta.enabled` evaluates to `false`.

### Returns

`Schema`\<[`OptionalBlock`](/ngx-signal-schema/api/structure/optionalblock/)\<`T`, `boolean`\>\>

a reusable schema for an `OptionalBlock<T>`.

### Example

```ts
form(myOptionalBlockSignal, optionalBlock(SomeSchema, disabledHidden));
```

## Call Signature

> **optionalBlock**\<`T`, `K`\>(`options`): `Schema`\<[`OptionalBlock`](/ngx-signal-schema/api/structure/optionalblock/)\<`T`, `K`\>\>

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:327

Creates a reusable schema for `OptionalBlock<T, K>`.

Use this overload when `meta.enabled` is not a boolean or when the enabled state
needs custom evaluation logic via `isEnabled`.

This returns a schema. It does not apply rules to a concrete field immediately.
If you already have a `SchemaPath` inside an existing `schema(...)`, prefer
`applyOptional(...)`.

### Type Parameters

#### T

`T`

#### K

`K` = `boolean`

### Parameters

#### options

[`ApplyOptionalOptions`](/ngx-signal-schema/api/structure/applyoptionaloptions/)\<`T`, `K`\>

configuration for the rules and the enabled-state evaluation.

### Returns

`Schema`\<[`OptionalBlock`](/ngx-signal-schema/api/structure/optionalblock/)\<`T`, `K`\>\>

a reusable schema for an `OptionalBlock<T, K>`.

### Example

```ts
const mySchema = optionalBlock({
  then: SomeSchema,
  otherwise: OtherSchema,
  isEnabled: (val) => val === 'yes'
});
```

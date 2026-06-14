---
editUrl: false
next: false
prev: false
title: "applyOptional"
---

## Call Signature

> **applyOptional**\<`T`\>(`fieldPath`, `then`, `otherwise?`): `void`

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:205

Applies rules or a schema directly to the `data` node of a concrete `OptionalBlock` field.

Use this inside an existing `schema(...)` when you already have a `SchemaPath`
to an `OptionalBlock<T>`.

The `then` inline rules or schema are applied to `fieldPath.data` when
`meta.enabled` evaluates to `true`.

If `otherwise` is provided, it is applied to `fieldPath.data` when
`meta.enabled` evaluates to `false`.

### Type Parameters

#### T

`T`

### Parameters

#### fieldPath

`SchemaPath`\<[`OptionalBlock`](/ngx-signal-schema/api/structure/optionalblock/)\<`T`, `boolean`\>\>

path to the concrete `OptionalBlock<T>` field.

#### then

`SchemaOrSchemaFn`\<`T`\>

inline rules or schema applied when `meta.enabled` evaluates to `true`.

#### otherwise?

`SchemaOrSchemaFn`\<`T`\>

inline rules or schema applied when `meta.enabled` evaluates to `false`.

### Returns

`void`

### Example

```ts
schema<MyModel>((fieldPath) => {
  applyOptional(fieldPath.someOptionalBlock, SomeSchema, disabledHidden);
});
```

## Call Signature

> **applyOptional**\<`T`, `K`\>(`fieldPath`, `options`): `void`

Defined in: projects/ngx-signal-schema/src/lib/structure/optional-block.ts:234

Applies rules or a schema directly to the `data` node of a concrete `OptionalBlock` field.

Use this overload when `meta.enabled` is not a boolean or when the enabled state
needs custom evaluation logic via `isEnabled`.

This function does not create a reusable schema. It applies the optional-block
behavior immediately to the given `fieldPath`.

### Type Parameters

#### T

`T`

#### K

`K` = `boolean`

### Parameters

#### fieldPath

`SchemaPath`\<[`OptionalBlock`](/ngx-signal-schema/api/structure/optionalblock/)\<`T`, `K`\>\>

path to the concrete `OptionalBlock<T, K>` field.

#### options

[`ApplyOptionalOptions`](/ngx-signal-schema/api/structure/applyoptionaloptions/)\<`T`, `K`\>

configuration for the rules and the enabled-state evaluation.

### Returns

`void`

### Example

```ts
schema<MyModel>((fieldPath) => {
  applyOptional(fieldPath.statusBlock, {
    then: StatusActiveSchema,
    isEnabled: (status) => status === 'ACTIVE'
  });
});
```

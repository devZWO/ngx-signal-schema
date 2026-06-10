---
editUrl: false
next: false
prev: false
title: "mimeType"
---

> **mimeType**\<`T`\>(`fieldPath`, `mimeType`, `config?`): `void`

Defined in: projects/ngx-signal-schema/src/lib/validators/mime-type.ts:23

Validator that checks if the field value matches one of the allowed MIME types.
Supports static values, arrays of strings, or a function (e.g., a signal getter) that returns them.

## Type Parameters

### T

`T` *extends* `string`

## Parameters

### fieldPath

`SchemaPath`\<`T`\>

The path to the field in the form schema.

### mimeType

`string` \| readonly `string`[] \| (() => `string` \| readonly `string`[])

The allowed MIME type(s). Can be a string, an array, or a function returning either.

### config?

`object` & [`ErrorOption`](/ngx-signal-schema/api/other/erroroption/)

Optional configuration for the validator, such as a custom error message.

## Returns

`void`

## Examples

```ts
// Static usage
mimeType(ctx.fileType, ['image/png', 'application/pdf']);
```

```ts
// Functional/Signal usage
mimeType(ctx.fileType, () => this.mimeTypesAllowed());
```

---
editUrl: false
next: false
prev: false
title: "mimeTypePattern"
---

> **mimeTypePattern**(`mimeTypes`): `RegExp`

Defined in: projects/ngx-signal-schema/src/lib/validators/mime-type.ts:61

Generates a Regular Expression specifically for MIME type validation.
It uses exact matching, case insensitivity, and supports wildcards (e.g., 'application/*').

:::caution[Deprecated]
will be become internal in a future version. Use `mimeTypePattern` directly.
:::

## Parameters

### mimeTypes

`string` \| readonly `string`[]

The allowed MIME type(s) or wildcard patterns.

## Returns

`RegExp`

A RegExp object for validating MIME types.

## Example

```ts
mimeTypePattern(['image/*', 'application/pdf']);
```

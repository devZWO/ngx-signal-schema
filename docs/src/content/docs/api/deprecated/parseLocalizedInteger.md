---
editUrl: false
next: false
prev: false
title: "parseLocalizedInteger"
---

> **parseLocalizedInteger**(`value`, `locale?`): [`ParseIntegerResult`](/ngx-signal-schema/api/deprecated/parseintegerresult/)

Defined in: projects/ngx-signal-schema/src/lib/validators/integer-parser.ts:26

Parses a localized string or number into an integer.

:::caution[Deprecated]
This function was exported by mistake and will become internal in the next major release (v2). Don't use it.
:::

## Parameters

### value

`string` \| `number` \| `null` \| `undefined`

The value to parse.

### locale?

`string` = `'de-DE'`

The locale used for parsing (defaults to 'de-DE').

## Returns

[`ParseIntegerResult`](/ngx-signal-schema/api/deprecated/parseintegerresult/)

A result object indicating success or failure.

## Example

```ts
parseLocalizedInteger("1.234", "de-DE"); // returns { kind: 'success', value: 1234 }
```

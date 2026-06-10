---
editUrl: false
next: false
prev: false
title: "parseLocalizedFloat"
---

> **parseLocalizedFloat**(`value`, `locale?`): [`ParseFloatResult`](/ngx-signal-schema/api/deprecated/parsefloatresult/)

Defined in: projects/ngx-signal-schema/src/lib/validators/decimal-parser.ts:91

Parses a localized string or number into a float.

:::caution[Deprecated]
This function was exported by mistake and will become internal in the next major release (v2).
:::

## Parameters

### value

`string` \| `number` \| `null` \| `undefined`

The value to parse.

### locale?

`string` = `'de-DE'`

The locale used for parsing (defaults to 'de-DE').

## Returns

[`ParseFloatResult`](/ngx-signal-schema/api/deprecated/parsefloatresult/)

A result object indicating success or failure.

## Example

```ts
parseLocalizedFloat("1.234,56", "de-DE"); // returns { kind: 'success', value: 1234.56 }
```

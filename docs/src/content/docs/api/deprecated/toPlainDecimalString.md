---
editUrl: false
next: false
prev: false
title: "toPlainDecimalString"
---

> **toPlainDecimalString**(`value`, `fractionSeparator`): `string`

Defined in: projects/ngx-signal-schema/src/lib/validators/decimal-parser.ts:18

Converts a number into a plain decimal string without scientific notation.

:::caution[Deprecated]
This function was exported by mistake and will become internal in the next major release (v2). Don't use it.
:::

## Parameters

### value

`string` \| `number`

The numeric value to convert.

### fractionSeparator

`string`

The decimal separator to use in the output string.

## Returns

`string`

A plain string representation of the number.

## Examples

```ts
toPlainDecimalString(12.34, "."); // returns "12.34"
```

```ts
toPlainDecimalString(1e-7, ".");  // returns "0.0000001"

This makes it possible to count integer and fraction digits reliably.
```

---
editUrl: false
next: false
prev: false
title: "stripLeadingZeros"
---

> **stripLeadingZeros**(`value`): `string`

Defined in: projects/ngx-signal-schema/src/lib/validators/decimal-parser.ts:64

Removes leading zeros but keeps a single "0" for values smaller than 1.

:::caution[Deprecated]
This function was exported by mistake and will become internal in the next major release (v2).
:::

## Parameters

### value

`string`

The string to strip leading zeros from.

## Returns

`string`

The string without leading zeros.

## Examples

```ts
stripLeadingZeros("00012"); // returns "12"
```

```ts
stripLeadingZeros("000"); // returns "0"
```

---
editUrl: false
next: false
prev: false
title: "decimal"
---

> **decimal**(`path`, `options`): `void`

Defined in: projects/ngx-signal-schema/src/lib/validators/decimal.ts:64

Schema helper for decimal numbers stored as number | null.

This validator checks the *shape* of the numeric value:
- whether it is a finite number
- whether the integer part fits into the allowed number of digits
- whether the fractional part fits into the allowed number of digits

It intentionally does NOT check:
- required / missing values
- min / max
- whether negative numbers are allowed

Those concerns should be handled by separate validators.

The validator returns two separated error-kinds
- decimal.isNumber: if the value is not a (finite) number
- decimal.intCount: if the number of digits is not within the allowed range
- decimal.fractCount: if the number of digits is not within the allowed range

## Parameters

### path

`SchemaPath`\<`string` \| `number` \| `null`\>

The schema path to the field to validate.

### options

[`DecimalOptions`](/ngx-signal-schema/api/other/decimaloptions/)

Configuration options for the validator.

## Returns

`void`

## Example

```ts
decimal(path.amount, { maxIntegerDigits: 5, maxFractionDigits: 2 });
```

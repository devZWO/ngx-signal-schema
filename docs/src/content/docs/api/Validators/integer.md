---
editUrl: false
next: false
prev: false
title: "integer"
---

> **integer**(`path`, `options`): `void`

Defined in: projects/ngx-signal-schema/src/lib/validators/integer.ts:52

Schema helper for integer numbers stored as number | null.

This validator checks the *shape* of the integer value:

- whether it is a finite number and an integer (no fractional part)
- whether the number of digits fits into the allowed range

It intentionally does NOT check:

- required / missing values
- min / max
- whether negative numbers are allowed

Those concerns should be handled by separate validators.

The validator returns two separated error-kinds:

- integer.isInteger: if the value is not a (finite) integer
- integer.digitCount: if the number of digits is not within the allowed range

## Parameters

### path

`SchemaPath`\<`string` \| `number` \| `null`\>

The schema path to the field to validate.

### options

[`IntegerOptions`](/ngx-signal-schema/api/other/integeroptions/)

Configuration options for the validator.

## Returns

`void`

## Example

```ts
integer(path.count, { maxDigits: 3 });
```

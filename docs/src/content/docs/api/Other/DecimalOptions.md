---
editUrl: false
next: false
prev: false
title: "DecimalOptions"
---

Defined in: projects/ngx-signal-schema/src/lib/validators/decimal.ts:10

Configuration options for the decimal validator.

## Extends

- [`ErrorOption`](/ngx-signal-schema/api/other/erroroption/)

## Properties

### error?

> `optional` **error?**: `object`

Defined in: projects/ngx-signal-schema/src/lib/validators/error-options.ts:20

Optional object containing error details.

#### kind?

> `optional` **kind?**: `string`

The kind of error as a string identifier.

#### message?

> `optional` **message?**: `string`

A message describing the error.

#### Inherited from

[`ErrorOption`](/ngx-signal-schema/api/other/erroroption/).[`error`](/ngx-signal-schema/api/other/erroroption/#error)

***

### locale?

> `optional` **locale?**: `string`

Defined in: projects/ngx-signal-schema/src/lib/validators/decimal.ts:33

Optional locale for parsing strings.
Default is 'de-DE'

***

### maxFractionDigits

> **maxFractionDigits**: `number`

Defined in: projects/ngx-signal-schema/src/lib/validators/decimal.ts:21

Maximum number of digits after the decimal separator.
Example: maxFractionDigits = 2 allows 12.34 but rejects 12.345

***

### maxIntegerDigits

> **maxIntegerDigits**: `number`

Defined in: projects/ngx-signal-schema/src/lib/validators/decimal.ts:15

Maximum number of digits before the decimal separator.
Example: maxIntegerDigits = 3 allows 999.99 but rejects 1000.00

***

### ~~message?~~

> `optional` **message?**: `string`

Defined in: projects/ngx-signal-schema/src/lib/validators/decimal.ts:27

Optional custom error message. or message key

:::caution[Deprecated]
Use `error.message` from `ErrorOption` instead.
:::

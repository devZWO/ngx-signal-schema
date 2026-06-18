---
editUrl: false
next: false
prev: false
title: "IntegerOptions"
---

Defined in: projects/ngx-signal-schema/src/lib/validators/integer.ts:11

Configuration options for the integer validator.

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

Defined in: projects/ngx-signal-schema/src/lib/validators/integer.ts:24

Optional locale for parsing localized strings (defaults to 'de-DE').

***

### maxDigits

> **maxDigits**: `number`

Defined in: projects/ngx-signal-schema/src/lib/validators/integer.ts:15

Maximum number of digits allowed in the integer part.

***

### ~~message?~~

> `optional` **message?**: `string`

Defined in: projects/ngx-signal-schema/src/lib/validators/integer.ts:20

Optional custom error message.

:::caution[Deprecated]
Use `error.message` from `ErrorOption` instead.
:::

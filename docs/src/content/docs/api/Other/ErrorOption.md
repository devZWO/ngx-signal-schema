---
editUrl: false
next: false
prev: false
title: "ErrorOption"
---

Defined in: projects/ngx-signal-schema/src/lib/validators/error-options.ts:14

Represents an error option containing error details.

The `ErrorOption` type is designed to provide structured information
about errors. It includes the kind of error as a string identifier
and a message describing the error.

This type is intended for scenarios where detailed error reporting
and categorization are required.

## Extended by

- [`IntegerOptions`](/ngx-signal-schema/api/other/integeroptions/)
- [`DecimalOptions`](/ngx-signal-schema/api/other/decimaloptions/)

## Properties

### error?

> `optional` **error?**: `object`

Defined in: projects/ngx-signal-schema/src/lib/validators/error-options.ts:19

Optional object containing error details.

#### kind?

> `optional` **kind?**: `string`

The kind of error as a string identifier.

#### message?

> `optional` **message?**: `string`

A message describing the error.

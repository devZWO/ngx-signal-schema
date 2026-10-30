---
editUrl: false
next: false
prev: false
title: "NotOnlyBlankOptions"
---

Defined in: projects/ngx-signal-schema/src/lib/validators/not-only-blank.ts:7

Options for configuring the `notOnlyBlank` validator.

## Extends

- [`ErrorOption`](/ngx-signal-schema/api/other/erroroption/)

## Properties

### allowEmpty?

> `optional` **allowEmpty?**: `boolean`

Defined in: projects/ngx-signal-schema/src/lib/validators/not-only-blank.ts:30

Whether `null`, `undefined`, or an empty string `""` is considered valid.

Set this to `false` if empty values should also be rejected by this validator.

#### Default

true (allows optional fields; use alongside `required` or `requiredTrimmed` if mandatory)

***

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

### includeControlCharacters?

> `optional` **includeControlCharacters?**: `boolean`

Defined in: projects/ngx-signal-schema/src/lib/validators/not-only-blank.ts:14

Whether to treat control characters (e.g. \x00-\x1F, \x7F, and Unicode control characters)
as invalid/blank characters.

#### Default

```ts
false (only standard whitespaces are treated as blank)
```

***

### minConsecutive?

> `optional` **minConsecutive?**: `number`

Defined in: projects/ngx-signal-schema/src/lib/validators/not-only-blank.ts:21

Minimum number of consecutive valid (non-blank, non-control) characters required.

#### Default

```ts
1 (requires at least one valid character in the string)
```

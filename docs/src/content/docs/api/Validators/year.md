---
editUrl: false
next: false
prev: false
title: "year"
---

> **year**\<`T`\>(`fieldPath`, `config?`): `void`

Defined in: projects/ngx-signal-schema/src/lib/validators/year.ts:27

Validates a year text field (exactly 4 digits, e.g., "2023").

It ensures the value:

1. Has a maximum length of 4 characters.
2. Has a minimum length of 4 characters.
3. Consists only of digits.

## Type Parameters

### T

`T` *extends* `string`

## Parameters

### fieldPath

`SchemaPath`\<`T`\>

The schema path to the year field to validate.

### config?

[`ErrorOption`](/ngx-signal-schema/api/other/erroroption/)

Provides custom error options for validation errors.

## Returns

`void`

## Important

**Unexpectedly the custom error kind will NOT override the default error kind for minLength and maxLength, only the error kind for the pattern.**

## Example

```ts
year(path.birthYear);
```

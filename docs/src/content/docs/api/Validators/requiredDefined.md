---
editUrl: false
next: false
prev: false
title: "requiredDefined"
---

> **requiredDefined**\<`T`\>(`path`, `option?`): `void`

Defined in: projects/ngx-signal-schema/src/lib/validators/required-defined.ts:26

Validator that ensures a value is defined (not null or undefined).

**Important:** Use this validator primarily for non-string types where `false`, `0`, or empty arrays
are valid and intentional selections. For string/text inputs, use `requiredTrimmed` instead.

This is particularly useful for boolean fields (checkboxes, toggles) where the standard `required`
validator might treat `false` as a missing value (falsy). This validator explicitly checks that
a value is present, regardless of whether it is `true` or `false`.

## Type Parameters

### T

`T`

## Parameters

### path

`SchemaPath`\<`T`\>

The schema path to the field to validate.

### option?

[`ErrorOption`](/ngx-signal-schema/api/other/erroroption/)

Optional configuration for the validator.

## Returns

`void`

## Example

```ts
// Correct use for mandatory boolean
requiredDefined(path.agreedToTerms);
```

## See

requiredTrimmed - Use this for string/text fields.

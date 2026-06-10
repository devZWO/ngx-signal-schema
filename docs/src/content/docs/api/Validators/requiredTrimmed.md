---
editUrl: false
next: false
prev: false
title: "requiredTrimmed"
---

> **requiredTrimmed**(`path`, `option?`): `void`

Defined in: projects/ngx-signal-schema/src/lib/validators/required-trimmed.ts:23

A validator for signal-based forms that checks if a string value is present after trimming whitespace.
Returns a 'required' error if the value is null, undefined, or empty after trimming.

This is the standard "required" validator for text inputs and textareas.

## Parameters

### path

`SchemaPath`\<`string` \| `null` \| `undefined`\>

The schema path to the string field to be validated.

### option?

[`ErrorOption`](/ngx-signal-schema/api/other/erroroption/)

Optional configuration for the validator.

## Returns

`void`

## Example

```ts
requiredTrimmed(path.username);
```

## See

requiredDefined - Use this for non-string fields like booleans or numbers.

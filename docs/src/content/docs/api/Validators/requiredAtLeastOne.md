---
editUrl: false
next: false
prev: false
title: "requiredAtLeastOne"
---

> **requiredAtLeastOne**\<`T`\>(`path`, `selectors`, `options?`): `void`

Defined in: projects/ngx-signal-schema/src/lib/validators/required-at-least-one.ts:76

Adds a cross-field validation rule to the given schema path that requires
at least one of multiple selected fields to be filled.

This helper is useful for cases where several alternative inputs are allowed,
but at least one of them must contain a value.

Typical examples:

- at least one of several contact channels must be filled
- either email or phone number must be provided

The Validator returns an error if none of the selected fields is filled.
The Error kind is `requiredAtLeastOne`.

## Type Parameters

### T

`T` *extends* `object`

The object type represented by the schema path on which the validator is registered.

## Parameters

### path

`SchemaPath`\<`T`\>

The schema path of the object on which the cross-field validation should be applied.
Usually this is the root object or a nested object containing all relevant fields.

### selectors

readonly \[(`p`) => `SchemaPath`\<`unknown`\>, (`p`) => `SchemaPath`\<`unknown`\>, (`p`) => `SchemaPath`\<`unknown`\>\]

A readonly tuple of at least two selector functions.
Each selector receives the current `SchemaPathTree<T>` and must return the
path of a field that should participate in the "at least one required" check.

### options?

`object` & [`ErrorOption`](/ngx-signal-schema/api/other/erroroption/)

Optional configuration for the validator.

## Returns

`void`

## Example

```ts
requiredAtLeastOne(
  path,
  [
    p => p.email,
    p => p.telefonnummer,
    p => p.mobilnummer,
  ],
  {
    message: 'Mindestens ein Kontaktweg muss angegeben werden.',
    attachTo: p => p.email,
    isFilled: (value) =>
      typeof value === 'string' ? value.trim() !== '' : value != null,
  },
);
```

## Remarks

This helper models a real cross-field rule. That makes it preferable to
expressing the same behavior through multiple mirrored `required(..., { when })`
conditions, especially when more than two fields are involved.

---
editUrl: false
next: false
prev: false
title: "requiredAtLeastOne"
---

## Call Signature

> **requiredAtLeastOne**\<`T`\>(`path`, `selectors`, `options?`): `void`

Defined in: projects/ngx-signal-schema/src/lib/validators/required-at-least-one.ts:150

Adds a cross-field validation rule to the given schema path that requires
at least one of multiple fields to be filled.

This helper is useful for cases where several alternative inputs are allowed,
but at least one of them must contain a value.

It supports two modes:
1. **Selector-based**: Specify a list of fields to check.
2. **Recursive root**: Check all leaf fields of the object at `path`.

Typical examples:
- At least one of several contact channels must be filled.
- Either email or phone number must be provided.
- At least one field in a complex search/filter form must be filled.

**Disabled and Hidden fields:**
Fields that are currently disabled or hidden (including entire subtrees) do not
participate in the validation. The validator only considers fields that are
currently "active" in the UI. If all selected fields are disabled or hidden,
the validation passes (returns `null`).

The Validator returns an error if none of the active participating fields is filled.
The Error kind is `requiredAtLeastOne`.

### Type Parameters

#### T

`T` *extends* `object`

The object type represented by the schema path on which the validator is registered.

### Parameters

#### path

`SchemaPath`\<`T`\>

The schema path of the object on which the cross-field validation should be applied.
Usually this is the root object or a nested object containing all relevant fields.

#### selectors

readonly \[[`RequiredAtLeastOneSelector`](/ngx-signal-schema/api/other/requiredatleastoneselector/)\<`T`\>, [`RequiredAtLeastOneSelector`](/ngx-signal-schema/api/other/requiredatleastoneselector/)\<`T`\>, [`RequiredAtLeastOneSelector`](/ngx-signal-schema/api/other/requiredatleastoneselector/)\<`T`\>\]

A readonly tuple of at least two selector functions.
Each selector receives the current `SchemaPathTree<T>` and must return the
path of a field that should participate in the "at least one required" check.

#### options?

[`RequiredAtLeastOneOptions`](/ngx-signal-schema/api/other/requiredatleastoneoptions/)\<`T`\> & [`ErrorOption`](/ngx-signal-schema/api/other/erroroption/)

Optional configuration for the validator.

### Returns

`void`

### Examples

**Selector-based usage:**
```ts
requiredAtLeastOne(
  path,
  [
    p => p.email,
    p => p.phone,
  ],
  { message: 'Please provide either email or phone.' }
);
```

**Recursive root usage:**
```ts
// Validates that at least one leaf field in the entire 'contact' object is filled.
requiredAtLeastOne(path.contact);
```

**Recursive selectors:**
```ts
// Validates that at least one field in 'address' OR the 'email' field is filled.
requiredAtLeastOne(path, [p => p.address, p => p.email], { recursive: true });
```

**Excluding fields:**
```ts
// Validates that at least one field is filled, but ignores the 'type' discriminator.
// which probably only decides if eg. a contact form should validate the
// `naturalPerson.firstname` field or the `legalPerson.companyName` field.
requiredAtLeastOne(path, { exclude: [p => p.type] });
```

### Remarks

This helper models a real cross-field rule. That makes it preferable to
expressing the same behavior through multiple mirrored `required(..., { when })`
conditions, especially when more than two fields are involved.

## Call Signature

> **requiredAtLeastOne**\<`T`\>(`path`, `options?`): `void`

Defined in: projects/ngx-signal-schema/src/lib/validators/required-at-least-one.ts:160

Adds a cross-field validation rule to the given schema path that requires
at least one of multiple fields to be filled.

This helper is useful for cases where several alternative inputs are allowed,
but at least one of them must contain a value.

It supports two modes:
1. **Selector-based**: Specify a list of fields to check.
2. **Recursive root**: Check all leaf fields of the object at `path`.

Typical examples:
- At least one of several contact channels must be filled.
- Either email or phone number must be provided.
- At least one field in a complex search/filter form must be filled.

**Disabled and Hidden fields:**
Fields that are currently disabled or hidden (including entire subtrees) do not
participate in the validation. The validator only considers fields that are
currently "active" in the UI. If all selected fields are disabled or hidden,
the validation passes (returns `null`).

The Validator returns an error if none of the active participating fields is filled.
The Error kind is `requiredAtLeastOne`.

### Type Parameters

#### T

`T` *extends* `object`

The object type represented by the schema path on which the validator is registered.

### Parameters

#### path

`SchemaPath`\<`T`\>

The schema path of the object on which the cross-field validation should be applied.
Usually this is the root object or a nested object containing all relevant fields.

#### options?

[`RequiredAtLeastOneOptions`](/ngx-signal-schema/api/other/requiredatleastoneoptions/)\<`T`\> & [`ErrorOption`](/ngx-signal-schema/api/other/erroroption/)

Optional configuration for the validator.

### Returns

`void`

### Examples

**Selector-based usage:**
```ts
requiredAtLeastOne(
  path,
  [
    p => p.email,
    p => p.phone,
  ],
  { message: 'Please provide either email or phone.' }
);
```

**Recursive root usage:**
```ts
// Validates that at least one leaf field in the entire 'contact' object is filled.
requiredAtLeastOne(path.contact);
```

**Recursive selectors:**
```ts
// Validates that at least one field in 'address' OR the 'email' field is filled.
requiredAtLeastOne(path, [p => p.address, p => p.email], { recursive: true });
```

**Excluding fields:**
```ts
// Validates that at least one field is filled, but ignores the 'type' discriminator.
// which probably only decides if eg. a contact form should validate the
// `naturalPerson.firstname` field or the `legalPerson.companyName` field.
requiredAtLeastOne(path, { exclude: [p => p.type] });
```

### Remarks

This helper models a real cross-field rule. That makes it preferable to
expressing the same behavior through multiple mirrored `required(..., { when })`
conditions, especially when more than two fields are involved.

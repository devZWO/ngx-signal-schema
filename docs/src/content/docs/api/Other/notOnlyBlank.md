---
editUrl: false
next: false
prev: false
title: "notOnlyBlank"
---

> **notOnlyBlank**(`path`, `options?`): `void`

Defined in: projects/ngx-signal-schema/src/lib/validators/not-only-blank.ts:61

Validates that a string field does not consist exclusively of whitespaces (or control characters),
and optionally requires a minimum number of consecutive valid characters.

By default:
- Empty values (`null`, `undefined`, `""`) are considered valid (use with `required` or `allowEmpty: false` if mandatory).
- Strings containing only whitespace characters (e.g., `"   "`, `"\t\n"`) are invalid.
- When `includeControlCharacters: true` is set, control characters are treated as blank characters.
- When `minConsecutive` is set to `N`, the string must contain at least one contiguous block of `N` valid characters.

## Parameters

### path

`SchemaPath`\<`string` \| `null` \| `undefined`\>

The schema path to validate.

### options?

[`NotOnlyBlankOptions`](/ngx-signal-schema/api/other/notonlyblankoptions/)

Optional configuration for the validator.

## Returns

`void`

## Example

```typescript
const userSchema = schema<User>((s) => {
  // Ensure name is not only whitespace if provided (optional field)
  notOnlyBlank(s.name);

  // Reject control characters and require at least 3 consecutive valid characters
  notOnlyBlank(s.comment, {
    includeControlCharacters: true,
    minConsecutive: 3,
    error: { message: 'Comment must contain meaningful text (at least 3 consecutive characters).' }
  });
});
```

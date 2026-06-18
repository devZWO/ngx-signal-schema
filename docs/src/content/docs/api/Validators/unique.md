---
editUrl: false
next: false
prev: false
title: "unique"
---

> **unique**\<`S`, `T`\>(`fieldPath`, `options?`): `void`

Defined in: projects/ngx-signal-schema/src/lib/validators/unique.ts:86

The `unique` validator checks if all items within an [ArrayBlock](/ngx-signal-schema/api/deprecated/arrayblock/) or a raw array are unique.
If duplicates are found, it generates validation errors.

### Default behavior
- **Strings**: Trimmed and compared case-insensitively.
- **Other types**: Compared using strict equality (`===`).

### Error reporting
By default, errors are attached to both the container ([ArrayBlock](/ngx-signal-schema/api/deprecated/arrayblock/) or the array itself)
and each individual item that is part of a duplicate set. This can be configured using the `destination` option.

## Type Parameters

### S

`S` *extends* [`ArrayBlock`](/ngx-signal-schema/api/deprecated/arrayblock/)\<`T`\> \| `T`[] \| `null` \| `undefined`

The type of the schema path, extending [ArrayBlock](/ngx-signal-schema/api/deprecated/arrayblock/), `T[]`, or being null/undefined.

### T

`T`

The type of the elements in the array.

## Parameters

### fieldPath

`SchemaPath`\<`S`\>

The SchemaPath to the [ArrayBlock](/ngx-signal-schema/api/deprecated/arrayblock/) or raw array containing the items to validate.

### options?

[`ErrorOption`](/ngx-signal-schema/api/other/erroroption/) & `object` & `object`

Configuration options for the validator.

## Returns

`void`

## Examples

```ts
// Basic usage with strings (case-insensitive, trimmed by default)
schema<ArrayBlock<string>>(path => {
  unique(path);
});
```

```ts
// Usage with raw arrays
schema<string[]>(path => {
  unique(path);
});
```

```ts
// Custom equality function and error message
interface User { id: number; name: string; }
schema<ArrayBlock<User>>(path => {
  unique(path, {
    equalFn: (a, b) => a.id === b.id,
    error: { message: 'User IDs must be unique' }
  });
});
```

```ts
// Attach errors only to items container (items containers)
schema<ArrayBlock<string>>(path => {
  unique(path, { destination: 'container' });
});
```

```ts
// Using a signal for dynamic destination
const dest = signal<'container' | 'items'>('items');
schema<ArrayBlock<string>>(path => {
  unique(path, { destination: dest });
});
```

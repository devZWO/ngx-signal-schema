---
editUrl: false
next: false
prev: false
title: "valueIn"
---

> **valueIn**\<`T`\>(`path`, `values`): [`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)

Defined in: projects/ngx-signal-schema/src/lib/conditions/value-in.ts:23

Checks if a field's value is contained within a list of expected values.
If you need the other way round, use includes

__`valueIn`__ _is a semantic shortcut for:_

```ts
(ctx) => ctx.valueOf(path.someField) in ['val1', 'val2']
```

## Type Parameters

### T

`T`

## Parameters

### path

`SchemaPath`\<`T`\>

The path to the field to check.

### values

readonly `T`[] \| (() => readonly `T`[])

The array of values to compare against, or a function returning them.

## Returns

[`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)

A rule function that returns true if the value is in the set.

## Example

```ts
applyWhen(path.field, valueIn(path.other, ['val1', 'val2']), required);
```

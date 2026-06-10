---
editUrl: false
next: false
prev: false
title: "valueEquals"
---

> **valueEquals**\<`T`\>(`path`, `expected`): [`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)

Defined in: projects/ngx-signal-schema/src/lib/conditions/value-equals.ts:23

Checks if a field's value equals a specific expected value.
Useful for conditional conditions (e.g., in `when` conditions).

__`valueEquals`__ _is a semantic shortcut for:_

```ts
(ctx) => ctx.valueOf(path.someField) === 'active'
```

## Type Parameters

### T

`T`

## Parameters

### path

`SchemaPath`\<`T`\>

The path to the field to check.

### expected

`T`

The value to compare against.

## Returns

[`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)

A rule function that returns true if the value matches.

## Example

```ts
applyWhen(path.field, valueEquals(path.other, 'some-value'), required);
```

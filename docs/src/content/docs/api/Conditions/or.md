---
editUrl: false
next: false
prev: false
title: "or"
---

> **or**(...`rules`): [`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)

Defined in: projects/ngx-signal-schema/src/lib/conditions/or.ts:21

Combines multiple schema rules with OR logic.

## Parameters

### rules

...[`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)[]

The rules to combine.

## Returns

[`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)

A rule function that returns true if at least one rule returns true.

## Example

```ts
applyIf(
      fieldPath, // the field path to apply a schema to
      // the conditions concatenated with `or`
      or(valueEquals(fieldPath.type, 'A'), valueEquals(fieldPath.aknowladged, true)),
      AllowSchema, // applyes the Allow Schema, when the condition above is true
      inactive // hides the complete fieldPath and subpath
    )
```

---
editUrl: false
next: false
prev: false
title: "and"
---

> **and**(...`rules`): [`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)

Defined in: projects/ngx-signal-schema/src/lib/conditions/and.ts:20

Combines multiple schema rules with AND logic.

## Parameters

### rules

...[`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)[]

The rules to combine.

## Returns

[`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)

A rule function that returns true if all rules return true.

## Example

```ts
applyIf(
      fieldPath, // the field path to apply a schema to
      // the conditions concatenated with `and`
      and(valueEquals(fieldPath.type, 'A'), valueEquals(fieldPath.aknowladged, true)),
      AllowSchema, // applyes the Allow Schema, when the condition above is true
      inactive // hides the complete fieldPath and subpath
    )
```

---
editUrl: false
next: false
prev: false
title: "includes"
---

> **includes**\<`T`\>(`path`, `value`): [`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)

Defined in: projects/ngx-signal-schema/src/lib/conditions/includes.ts:15

Checks if a list field contains a specific value.
If you need the other way round, use [valueIn](/ngx-signal-schema/api/conditions/valuein/)

## Type Parameters

### T

`T`

## Parameters

### path

`SchemaPath`\<`T`[]\>

The path to the list field.

### value

`T`

The value to look for.

## Returns

[`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)

A rule function that returns true if the list contains the value.

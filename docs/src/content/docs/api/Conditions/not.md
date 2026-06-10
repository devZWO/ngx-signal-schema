---
editUrl: false
next: false
prev: false
title: "not"
---

> **not**(`rule`): [`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)

Defined in: projects/ngx-signal-schema/src/lib/conditions/not.ts:20

Negates a given schema rule.

__`not`__ _is a semantic shortcut for:_

```ts
(ctx) => !rule(ctx)
```

## Parameters

### rule

[`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)

The rule to negate.

## Returns

[`SchemaRule`](/ngx-signal-schema/api/other/schemarule/)

A rule function that returns the inverse of the input rule.

## Example

```ts
applyWhen(path.field, not(valueEquals(path.other, 'some-value')), required);
```

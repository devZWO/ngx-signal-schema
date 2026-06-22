---
editUrl: false
next: false
prev: false
title: "RequiredAtLeastOneSelector"
---

> **RequiredAtLeastOneSelector**\<`T`\> = (`p`) => `SchemaPathTree`\<`unknown`\>

Defined in: projects/ngx-signal-schema/src/lib/validators/required-at-least-one.ts:47

Each selector receives the current `SchemaPathTree<T>` and must return the
path of a field that should participate in the "at least one required" check.

## Type Parameters

### T

`T` *extends* `object`

## Parameters

### p

`SchemaPathTree`\<`T`\>

## Returns

`SchemaPathTree`\<`unknown`\>

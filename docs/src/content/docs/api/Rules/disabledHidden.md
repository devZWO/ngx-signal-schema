---
editUrl: false
next: false
prev: false
title: "disabledHidden"
---

> **disabledHidden**\<`T`\>(`fieldPath`, `options?`): `void`

Defined in: projects/ngx-signal-schema/src/lib/rules/disabled-hidden.ts:31

Applies a combined "inactive UI" state by both disabling and hiding a field.

Use this when a field should not be visible and should also be non-interactive
at the control level while hidden. Note that `hidden()` alone already excludes
the field from validation / parent form state; this helper additionally applies
the disabled state so bound controls reflect disabled semantics as well.

This is fully type-agnostic and can be used for any field shape.

:::caution[Deprecated]
The name disabledHidden was technically correct, but it does not show its purpose. so it was renamed to `inactive`.
Use `inactive` instead.
:::

## Type Parameters

### T

`T`

## Parameters

### fieldPath

`SchemaPath`\<`T`\>

The schema path to the field.

### options?

`LogicOptions`

Configuration for the disabled/hidden states. Can be a boolean, a function returning boolean, or an Observable/Signal.

## Returns

`void`

## Example

```ts
disabledHidden(path.secretCode, not(valueEquals(path.isAdmin, true)));
```

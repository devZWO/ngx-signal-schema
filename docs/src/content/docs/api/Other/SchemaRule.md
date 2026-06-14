---
editUrl: false
next: false
prev: false
title: "SchemaRule"
---

> **SchemaRule** = (`ctx`) => `boolean`

Defined in: projects/ngx-signal-schema/src/lib/conditions/schema-rule.ts:32

A rule that evaluates a condition based on the schema context.
Used for conditional logic like visibility or enablement.

## Parameters

### ctx

`SchemaRuleContext`

The context providing access to the schema state.

## Returns

`boolean`

True if the condition is met, false otherwise.

## Example

```ts
const myRule: SchemaRule = (ctx) => ctx.valueOf(path.someField) === 'active';
```

---
editUrl: false
next: false
prev: false
title: "TrimDirective"
---

Defined in: projects/ngx-signal-schema/src/lib/directives/trim.directive.ts:39

A directive that trims whitespace (and optionally control characters) from `<input>` and `<textarea>`
elements upon blur.

When the value is modified by trimming, native `input` and `change` events are dispatched
to ensure that `@angular/forms/signals` and other model bindings are properly updated.

## Example

```html
<!-- Static attribute usage on input or textarea -->
<input trim type="text" [formField]="form.name" />

<!-- Dynamic binding with optional control character trimming -->
<textarea [trim]="isTrimActive()" [trimControlCharacters]="true" [formField]="form.bio"></textarea>
```

## Constructors

### Constructor

> **new TrimDirective**(): `TrimDirective`

#### Returns

`TrimDirective`

## Properties

### trim

> `readonly` **trim**: `InputSignalWithTransform`\<`boolean`, `unknown`\>

Defined in: projects/ngx-signal-schema/src/lib/directives/trim.directive.ts:46

Enables or disables trimming on blur.
Defaults to true when the attribute is present.

***

### trimControlCharacters

> `readonly` **trimControlCharacters**: `InputSignalWithTransform`\<`boolean`, `unknown`\>

Defined in: projects/ngx-signal-schema/src/lib/directives/trim.directive.ts:54

Whether to also trim ASCII and Unicode control characters.
Default: false

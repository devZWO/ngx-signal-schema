---
title: AI Agent Guide
description: Public API rules and checked integration examples for coding agents.
---

Use `@devzwo/ngx-signal-schema` with Angular 22 Signal Forms. Check the installed
package version and peer dependencies before implementing an integration.
Import library helpers from `@devzwo/ngx-signal-schema`; import `schema`, `form`
and `FormField` from `@angular/forms/signals`. Avoid internal or deep imports.

## Choose the right helper

- Combine schema fragments with `compose(base, ...extensions)`. Extensions receive
  the schema path. There is no `append` export.
- Use `applyIf(path, condition, thenSchema, elseSchema)` for two branches and
  `inactive` to hide and disable irrelevant fields. The template must respect `hidden()`.
- Use `requiredTrimmed` for mandatory text and `requiredDefined` for nullable
  selections where `false` or `0` is a valid choice.
- Use `unique` for arrays. Its default string comparison trims whitespace and
  ignores case. Choose `destination: 'items'`, `'container'` or `'both'`.
- Keep nested form models stable. Use `OptionalBlock`, `mapToOptionalBlock` and
  `applyOptional` for optional objects instead of removing subtrees.
- Use Angular signals with `set()` and `update()` for model changes. Create
  `form()` in an injection context, such as a component field initializer.

## Complete integration

This example is compiled against the built package, including its Angular template.

<!-- recipe-check: ai-contact.ts -->
```ts
import { Component, signal } from '@angular/core';
import { FormField, form, schema } from '@angular/forms/signals';
import { compose, inactive, requiredTrimmed, valueEquals } from '@devzwo/ngx-signal-schema';

interface Contact {
  kind: 'private' | 'company';
  name: string;
  companyName: string;
}

const BaseSchema = schema<Contact>(path => {
  requiredTrimmed(path.name);
});

const ContactSchema = compose(BaseSchema, path => {
  requiredTrimmed(path.companyName);
  inactive(path.companyName, valueEquals(path.kind, 'private'));
});

@Component({
  selector: 'app-contact',
  imports: [FormField],
  template: `
    <input aria-label="Name" [formField]="contactForm.name" />
    <select aria-label="Contact type" [formField]="contactForm.kind">
      <option value="private">Private</option>
      <option value="company">Company</option>
    </select>
    @if (!contactForm.companyName().hidden()) {
      <input aria-label="Company name" [formField]="contactForm.companyName" />
    }
  `,
})
export class ContactComponent {
  readonly model = signal<Contact>({ kind: 'private', name: '', companyName: '' });
  readonly contactForm = form(this.model, ContactSchema);
}
```

## Further examples

- [Getting started](/gettingstarted/)
- [Conditional contact form](/recipes/contact-form/)
- [Dynamic lists and uniqueness](/recipes/list-recipe/)
- [API reference](/api/readme/)

The npm package includes this guide at `ai/usage.md` and the getting started,
concept and recipe guides under `docs/`. The website exposes `/ngx-signal-schema/llms.txt`
and Markdown versions of its pages (replace `.mdx` with `.md` in the source path).

## Working on this repository

Use Node.js 24 and `npm ci`. Run `npm run recipes:check` after changing examples,
`npm run package:check` to validate bundled documentation and Markdown endpoints,
and `npm run release:check` for lint, tests, the Pages build and package validation.

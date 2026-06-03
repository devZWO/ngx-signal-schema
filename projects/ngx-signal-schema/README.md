# @devzwo/ngx-signal-schema

Composable schema operators for Angular Signal Forms.

## Motivation
Angular Signal Forms introduce a powerful, signal-based schema system. As form complexity grows, so does the need for reusable and modular validation logic. `@devzwo/ngx-signal-schema` provides a collection of helper functions to design complex schemas declaratively and maintainably.

## Problem Statement
Defining schemas with complex dependencies (e.g., "Field A is only required if Field B has a certain value") often leads to cluttered boilerplate code. Existing validators are often difficult to combine or extend without redefining the entire schema.

## Features
- **Composable**: Schemata can be easily combined and extended.
- **Declarative**: Clear structure through `composition`, `conditions`, `rules`, and `validators`.
- **Type-safe**: Full support for TypeScript typing of Angular Signal Forms.
- **Tree-shakeable**: Functional API ensures minimal bundle size impact.
- **Future-proof**: Built directly on top of `@angular/forms/signals`.

## Installation

```bash
npm install @devzwo/ngx-signal-schema
```

## Usage & Examples

### Simple Composition with `append`
With `append`, existing schemas can be easily extended.

```typescript
import { append, requiredTrimmed } from '@devzwo/ngx-signal-schema';

const MySchema = append(
  BaseSchema,
  (path) => {
    requiredTrimmed(path.name);
  }
);
```

### Conditional Validation with `applyIf`
Conditional logic can be mapped without deeply nested structures.

```typescript
import { applyIf, valueEquals } from '@devzwo/ngx-signal-schema';

applyIf(
  path.billingAddress,
  (ctx) => ctx.valueOf(path.useDifferentBillingAddress),
  AddressSchema,
  EmptySchema
);
```

## API

The package is divided into four logical areas:

### 1. Composition
Utilities for structuring and combining schemas.
- `append(base, ...extensions)`: Extends a base schema with additional rules or schemas.
- `applyIf(path, condition, thenSchema, elseSchema)`: Conditionally applies one of two schemas (branching logic).

### 2. Conditions
Predicates that can be used in rules or conditional schemas.
- `valueEquals(path, expected)`: Checks for exact equality of a field value.
- `valueIn(path, values)`: Checks if a field value is contained in a list.
- `not(rule)`: Negates an existing `SchemaRule`.

### 3. Rules
Structural field configurations.
- `disabledHidden(path, options)`: Applies both `disabled` and `hidden` to a field simultaneously. Ideal for fields that are completely irrelevant depending on the context.

### 4. Validators
Specialized validators for Signal Forms.
- `requiredTrimmed(path)`: Checks for content while removing leading/trailing whitespace.
- `requiredDefined(path)`: Ensures that a value is neither `null` nor `undefined`.
- `requiredAtLeastOne(path, fields)`: Validates that at least one of the specified fields is filled.
- `requiredIfOtherFilled(path, otherPath)`: Makes a field required as soon as another field contains a value.
- `decimal(path)` / `integer(path)`: Numeric validation.
- `mimeType(path, allowedTypes)`: Validation of file types.
- `oneOfPattern(path, patterns)`: Checks against a list of RegEx patterns.
- `yearText(path)`: Specialized validator for years in text form.

## Angular Compatibility
This package requires **Angular 21.2.0** or higher. It utilizes the latest features of signal-based forms.

## Signal Forms Compatibility
The library is specifically designed for use with `@angular/forms/signals` (Angular Signal Forms) and integrates seamlessly into its schema system.

## Tree Shaking
The library is fully optimized for tree shaking. Thanks to the functional architecture and the `sideEffects: false` marking, only the operators you actually import end up in your bundle.

## Peer Dependencies
Ensure that the following packages are installed in your project:
- `@angular/core`: ^21.2.0
- `@angular/common`: ^21.2.0
- `@angular/forms`: ^21.2.0

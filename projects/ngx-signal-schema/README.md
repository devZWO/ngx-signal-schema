# @devzwo/ngx-signal-schema

[![Angular](https://img.shields.io/badge/Angular-21+-DD0031?style=flat-square&logo=angular)](https://angular.dev)
[![CI](https://img.shields.io/github/actions/workflow/status/devZWO/ngx-signal-schema/main.yml?style=flat-square)](https://github.com/devZWO/ngx-signal-schema/actions/workflows/main.yml)
[![codecov](https://img.shields.io/codecov/c/github/devzwo/ngx-signal-schema?style=flat-square)](https://codecov.io/github/devZWO/ngx-signal-schema)
[![NPM Version](https://img.shields.io/npm/v/@devzwo/ngx-signal-schema?style=flat-square)](https://npmjs.org/package/@devzwo/ngx-signal-schema)
[![License](https://img.shields.io/npm/l/%40devzwo%2Fngx-signal-schema?style=flat-square)](https://github.com/devZWO/ngx-signal-schema/blob/main/LICENSE)



> Composable schema validation operators for
[Angular Signal Forms](https://angular.dev/essentials/signal-forms).
>
> Built for Angular v21+.

---

## Motivation

Angular Signal Forms introduce a powerful, signal-based schema system. Defining schemas with complex dependencies (e.g., "Field A is only required if Field B has a certain value") often leads to cluttered boilerplate code. Existing validators are often challenging to combine or extend without redefining the entire schema.

> As form complexity grows, so does the need for reusable and modular validation logic. `@devzwo/ngx-signal-schema` provides a collection of helper functions to design complex schemas declaratively and maintainably.

---

## ✨ Features

- **Composable**: Schemata can be easily combined and extended.
- **Declarative**: Clear structure through `composition`, `conditions`, `rules`, and `validators`.
- **Type-safe**: Full support for TypeScript typing of Angular Signal Forms.
- **Tree-shakeable**: Functional API ensures minimal bundle size impact.
- **Future-proof**: Built directly on top of `@angular/forms/signals`.

---

## 📦 Installation

```bash
npm install @devzwo/ngx-signal-schema
```

or

```bash
pnpm install @devzwo/ngx-signal-schema
```

### Peer Dependencies

Ensure that the following packages are installed in your project:

- `@angular/core`: ^21.2.0
- `@angular/forms`: ^21.2.0

---

## 🚀 Usage & Examples

### Simple Composition with `compose`

With `compose`, existing schemas can be easily extended.

```typescript
import {compose, requiredTrimmed} from '@devzwo/ngx-signal-schema';

const MySchema = compose(BaseSchema, required(path.name));
```

**Standard Signal Forms equivalent:**

```typescript
import {schema, apply} from '@angular/forms/signals';

const MySchema = schema((path) => {
    apply(path, BaseSchema)
    required(path.name)
});
```

### Conditional Validation with `applyIf`

Conditional logic can be mapped without deeply nested structures.

```typescript
import {applyIf, valueEquals} from '@devzwo/ngx-signal-schema';

applyIf(
    path.billingAddress,
    valueEquals(path.useDifferentBillingAddress, true),
    AddressSchema,
    EmptySchema
);
```

**Standard Signal Forms equivalent:**

```typescript
import {applyWhen} from '@angular/forms/signals';

// "Then" case
applyWhen(
    path.billingAddress,
    (ctx) => ctx.valueOf(path.useDifferentBillingAddress),
    AddressSchema
);

// "Else" case (requires manual negation)
applyWhen(
    path.billingAddress,
    (ctx) => !ctx.valueOf(path.useDifferentBillingAddress),
    EmptySchema
);
```

### Combined Rules with `disabledHidden`

Simplify UI logic by combining state rules with declarative conditions. This is particularly useful because **disabled fields are automatically excluded from validation and submission**, and hiding them ensures the UI stays clean and relevant.

```typescript
import {disabledHidden, valueIn, not} from '@devzwo/ngx-signal-schema';

// Field is only relevant for DACH region
disabledHidden(
    path.taxNumber,
    not(valueIn(path.country, ['DE', 'AT', 'CH']))
);
```

**Standard Signal Forms equivalent:**

```typescript
import {disabled, hidden} from '@angular/forms/signals';

const isForeign = (ctx) => !['DE', 'AT', 'CH'].includes(ctx.valueOf(path.country));

disabled(path.taxNumber, isForeign);
hidden(path.taxNumber, isForeign);
```

### Numeric Validation with `decimal` and `integer`

These validators check the **structural shape** of numeric values (integer digits and fractional digits) rather than just their range. They also support localized string parsing (defaulting to `de-DE`).

```typescript
import {decimal, integer} from '@devzwo/ngx-signal-schema';

// Allows up to 5 digits before and 2 digits after the decimal separator
decimal(path.price, {maxIntegerDigits: 5, maxFractionDigits: 2});

// Allows up to 3 digits, strictly as an integer
integer(path.count, {maxDigits: 3});
```

### File Type Validation with `mimeType`

Ensure that uploaded files match specific formats. Supports exact types, wildcards (e.g., `image/*`), and reactive updates via signal-based functions.

```typescript
import {mimeType} from '@devzwo/ngx-signal-schema';

// Static array of allowed types with wildcard support
mimeType(path.attachment, ['image/*', 'application/pdf']);

// Dynamic/Reactive allowed types (e.g., from a config signal)
mimeType(path.avatar, () => this.allowedAvatarTypes());
```

### Flexible Schema Definitions

The composition operators are highly flexible. Wherever a `Schema` is expected, you can also provide a **Schema Function** — a function that receives the current `path` and applies rules or validators directly. This allows you to mix reusable schemas with custom inline logic.

```typescript
import {compose, inactive, valueEquals} from '@devzwo/ngx-signal-schema';

const MySchema = compose(
    //full schema
    BaseSchema,
    // Reusable schema
    inactive(path.status, isForeign),
    // Inline rule instead of a full schema object
    (path) => disabledHidden(path.subfield, valueEquals(path.status, 'inactive'))
);
```

### Explicit Presence with `requiredDefined`

The standard `required` validator treat `false` as an invalid value because it is falsy. `requiredDefined` is necessary when `false` is a valid input (e.g., in checkboxes or toggles) but a selection is strictly mandatory.

```typescript
import {requiredDefined} from '@devzwo/ngx-signal-schema';

// Rejects null/undefined, but accepts both true and false
requiredDefined(path.agreedToTerms);
```

**Standard Signal Forms equivalent:**

```typescript
import {validate} from '@angular/forms/signals';

validate(path.agreedToTerms, (ctx) => {
    return ctx.value() !== null && ctx.value() !== undefined
        ? null
        : {kind: 'required'};
});
```

### Stable Form Structures with `OptionalBlock`

Angular Signal Forms require a **stable object structure** to correctly track signals. You cannot use subtrees that are `null` or `undefined` if you want to apply rules or validation to their nested fields.

`OptionalBlock` provides stable containers for optional data and collections, ensuring the signal tree remains intact even when parts of the form are logically absent or empty.


```typescript
import {OptionalBlock, mapToOptionalBlock} from '@devzwo/ngx-signal-schema';

interface UserProfile {
    // ❌ BAD: Signal Form cannot track fields inside null/undefined
    // address?: { street: string }; 

    // ✅ GOOD: Stable structure even if "disabled"
    address: OptionalBlock<{ street: string; city: string }>;
}

// Initializing the form
const initialValue: UserProfile = {
    address: mapToOptionalBlock({street: '', city: ''}, false), // disabled by default
};
```

In your schema, use `applyOptional` to apply rules to the inner data of an `OptionalBlock`:

```typescript
import {compose, applyOptional, requiredTrimmed} from '@devzwo/ngx-signal-schema';

const UserSchema = compose(
    (path) => {
        // Validation is only active when address.meta.enabled is true
        applyOptional(path.address, (data) => {
            requiredTrimmed(data.street);
            requiredTrimmed(data.city);
        });
    }
);
```

### Array Validation with `unique`

Standard Signal Forms does not have any validation arrays. You can use the `unique` validator to ensure all elements in a collection are distinct. By default, it marks the individual duplicate items as invalid.

```typescript
import {unique} from '@devzwo/ngx-signal-schema';

// Basic usage: checks for duplicates in the array
// For strings: case-insensitive and trimmed by default
unique(path.tags);

// Advanced usage: custom equality and error placement
unique(path.employees, {
    equalFn: (a, b) => a.email === b.email,
    destination: 'both', // Mark both the Array itself and the duplicate items in the array
    error: { message: 'Duplicate email addresses found' }
});
```

---

## 📚 API

The package is divided into four logical areas:

### 1. Composition

Utilities for structuring and combining schemas.

- `compose(base, ...extensions)`: Extends a base schema with additional rules or schemas. Supports both `Schema` objects and inline functions (`(path) => void`).
- `applyIf(path, condition, thenSchema, elseSchema)`: Conditionally applies one of two schemas or inline functions (branching logic).

### 2. Conditions

Predicates that can be used in rules or conditional schemas.

- `valueEquals(path, expected)`: Checks for exact equality of a field value.
- `valueIn(path, values)`: Checks if a field value is contained in a list.
- `includes(path, value)`: Checks if an array field contains a specific value.
- `not(rule)`: Negates an existing `SchemaRule`.
- `and(...rules)`: Combines multiple rules with logical AND.
- `or(...rules)`: Combines multiple rules with logical OR.

### 3. Rules

Structural field configurations.

- `inactive(path, options)`: Applies both `disabled` and `hidden` to a field simultaneously. Prevents both user interaction and validation for irrelevant fields.

### 4. Validators

Specialized validators for Signal Forms.

- `requiredTrimmed(path)`: **Standard text required.** Checks for content while removing leading/trailing whitespace. Recommended for all string inputs. **Error key:** `required`
- `requiredDefined(path)`: **Mandatory selection.** Ensures that a value is neither `null` nor `undefined`. Essential for booleans (toggles, checkboxes) where `false` is a valid selection but a choice is required. **Not recommended for strings.** **Error key:** `required`
- `requiredAtLeastOne(path, fields)`: Validates that at least one of the specified fields is filled. **Error key:** `group.requiredAtLeastOne`
- `requiredIfOtherFilled(path, otherPath)`: Makes a field required as soon as another field contains a value. **Error key:** `required` (default, configurable)
- `decimal(path, options)`: Validates that a value matches a decimal format. **Error keys:** `decimal.isNumber`, `decimal.intCount`, `decimal.fractCount`
- `integer(path, options)`: Validates that a value is a whole number. **Error keys:** `integer.isInteger`, `integer.digitCount`
- `mimeType(path, allowedTypes)`: Validation of file types. Supports wildcards (`image/*`) and reactive arrays. **Error key:** `mimeType`
- `unique(path, options)`: Ensures all items in an array are unique. Supports custom equality logic and can attach errors to the container, the duplicate items, or both. **Error key:** `unique`
- `oneOfPattern(values, options)`: Helper that generates a `RegExp` matching any of the provided values. Useful with the built-in `pattern` validator.
- `year(path)`: Specialized validator for years (`YYYY`) in text form. **Error key:** `year`

### 5. Structures

Utilities for modeling complex data structures managing optional state.

- `optionalBlock(options)`: Creates a reusable schema for `OptionalBlock<T>`, allowing rules to be applied conditionally based on the block's enabled state.
- `applyOptional(path, options)`: Applies rules or schemas directly to the `data` node of an `OptionalBlock` field.
- `mapToOptionalBlock(data, enabled)`: Utility to wrap domain data into an `OptionalBlock` structure.
- `mapFromOptionalBlock(block)`: Utility to extract data from an `OptionalBlock` if it is enabled.
- `isOptionalBlock(obj)`: Type guard for `OptionalBlock`.

## Maintainer

This project is developed and maintained by the **devZWO GmbH**.

https://devzwo.com

# Shared Form Components

This directory contains reusable, accessible, and signal-based form components for the demo application. These components are designed to work seamlessly with `@angular/forms/signals` and `ngx-signal-schema`.

## Design Principles

- **Signal-Based**: All components use Angular Signals for inputs and state management.
- **Accessibility**: Components follow WCAG AA guidelines, using appropriate ARIA attributes, labels, and semantic HTML (e.g., `fieldset` for toggle groups).
- **OnPush**: All components use `ChangeDetectionStrategy.OnPush` for optimal performance.
- **Unified Error Handling**: Errors are consistently displayed using the `ErrorIndicator` component.

## Components

### 1. `ErrorIndicator` (`mat-error[appErrorIndicator]`)

A specialized attribute selector for `mat-error` that automatically displays the first validation error from a given `FieldState`.

**Usage:**

```html

<mat-error appErrorIndicator [fieldState]="fieldTree()()"/>
```

### 2. `InputFormField` (`app-input-form-field`)

A wrapper around `mat-form-field` and `input[matInput]` for text-based inputs.

**Properties:**

- `label`: (Required) The floating label for the input.
- `fieldTree`: (Required) The signal-based field tree from the form.
- `placeholder`: (Optional) Placeholder text.

**Usage:**

```html
<app-input-form-field
  label="Last Name"
  [fieldTree]="contactForm.lastName"
  placeholder="Doe"
/>
```

### 3. `SelectFormField` (`app-select-form-field`)

A wrapper around `mat-form-field` and `mat-select` for dropdown selection.

**Properties:**

- `label`: (Required) The floating label for the select.
- `fieldTree`: (Required) The signal-based field tree from the form.
- `options`: (Required) An array of `SelectOption` objects `{label: string, value: any}`.

**Usage:**

```html
<app-select-form-field
  label="Title"
  [fieldTree]="contactForm.title"
  [options]="titleOptions"
/>
```

### 4. `ButtonToggleFormField` (`app-button-toggle-form-field`)

A standalone toggle group component that uses `fieldset` and `legend` for semantic accessibility. It does not require `mat-form-field`.

**Properties:**

- `label`: (Required) The legend text for the fieldset.
- `fieldTree`: (Required) The signal-based field tree from the form.
- `options`: (Required) An array of `ButtonToggleOption` objects `{label: string, value: any}`.

**Usage:**

```html
<app-button-toggle-form-field
  label="Person Type"
  [fieldTree]="contactForm.type"
  [options]="personTypeOptions"
/>
```

## Integration with `@angular/forms/signals`

These components expect a `FieldTree` as input. They internally access the `FieldState` using `fieldTree()()` to handle common logic like:

- Hiding the component when `hidden()` signal is true.
- Displaying errors when the field is invalid.
- Binding the form control via `[formField]`.

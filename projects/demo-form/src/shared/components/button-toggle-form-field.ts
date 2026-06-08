import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {FieldTree, FormField} from '@angular/forms/signals';
import {ErrorIndicator} from './error-indicator';
import {MatError} from '@angular/material/input';

export interface ButtonToggleOption {
    label: string;
    value: unknown;
}

/**
 * A reusable button toggle group component used as a form field.
 * It uses a `fieldset` and `legend` for accessibility, avoiding the need for `MatFormField`.
 * It integrates with `@angular/forms/signals` and `ErrorIndicator`.
 *
 * @example
 * ```html
 * <app-button-toggle-form-field
 *   label="Person Type"
 *   [fieldTree]="myForm.type"
 *   [options]="[{label: 'Natural', value: 'natural'}, {label: 'Legal', value: 'legal'}]"
 * />
 * ```
 */
@Component({
    selector: 'app-button-toggle-form-field',
    imports: [MatButtonToggleModule, FormField, ErrorIndicator, MatError],
    template: `
      @if (!fieldTree()().hidden()) {
          <fieldset class="flex flex-col gap-2 border-none p-0 m-0">

              <legend class="font-medium text-cyan-900">{{ label() }}</legend>

              <mat-button-toggle-group
                  [formField]="fieldTree()"
                  class="w-fit"
              >
                  @for (option of options(); track option.value) {
                      <mat-button-toggle [value]="option.value">{{ option.label }}</mat-button-toggle>
                  }
              </mat-button-toggle-group>

              <mat-error appErrorIndicator [fieldState]="fieldTree()()" />
          </fieldset>
      }
  `,
    styles: `
    :host {
      display: contents;
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonToggleFormField {
    /** The legend text for the fieldset. */
    label = input.required<string>();

    /** The signal-based field tree from `@angular/forms/signals`. */
    fieldTree = input.required<FieldTree<unknown>>();

    /** The list of options to display as button toggles. */
    options = input.required<ButtonToggleOption[]>();
}

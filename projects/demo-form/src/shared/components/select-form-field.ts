import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {FieldTree, FormField} from '@angular/forms/signals';
import {ErrorIndicator} from './error-indicator';

export interface SelectOption {
    label: string;
    value: unknown;
}

/**
 * A reusable dropdown select component wrapped in a Material Form Field.
 * It integrates with `@angular/forms/signals` for state management and
 * uses `ErrorIndicator` for error reporting.
 *
 * @example
 * ```html
 * <app-select-form-field
 *   label="Country"
 *   [fieldTree]="myForm.country"
 *   [options]="[{label: 'Germany', value: 'DE'}, {label: 'USA', value: 'US'}]"
 * />
 * ```
 */
@Component({
    selector: 'app-select-form-field',
    imports: [MatFormFieldModule, MatSelectModule, MatOptionModule, FormField, ErrorIndicator],
    template: `
        @if (!fieldTree()().hidden()) {
            <mat-form-field appearance="outline">
                <mat-label>{{ label() }}</mat-label>
                <mat-select [formField]="fieldTree()">
                    @for (option of options(); track option.value) {
                        <mat-option [value]="option.value">{{ option.label }}</mat-option>
                    }
                </mat-select>
                <mat-error appErrorIndicator [fieldState]="fieldTree()()"/>
            </mat-form-field>
        }
    `,
    styles: `
        :host {
            display: contents;
        }
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectFormField {
    /** The floating label for the select field. */
    label = input.required<string>();

    /** The signal-based field tree from `@angular/forms/signals`. */
    fieldTree = input.required<FieldTree<unknown>>();

    /** The list of options to display in the dropdown. */
    options = input.required<SelectOption[]>();
}

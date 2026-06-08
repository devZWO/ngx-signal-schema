import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FieldTree, FormField} from '@angular/forms/signals';
import {ErrorIndicator} from './error-indicator';

/**
 * A reusable text input component wrapped in a Material Form Field.
 * It automatically handles visibility via the `hidden()` signal from the field tree
 * and displays validation errors using the `ErrorIndicator`.
 *
 * @example
 * ```html
 * <app-input-form-field
 *   label="User Name"
 *   [fieldTree]="myForm.username"
 *   placeholder="Enter your username"
 * />
 * ```
 */
@Component({
    selector: 'app-input-form-field',
    imports: [MatFormFieldModule, MatInputModule, FormField, ErrorIndicator],
    template: `
        @if (!fieldTree()().hidden()) {
            <mat-form-field appearance="outline">
                <mat-label>{{ label() }}</mat-label>
                <input matInput [formField]="fieldTree()" [placeholder]="placeholder()">
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
export class InputFormField {
    /** The floating label for the input field. */
    label = input.required<string>();

    /** The signal-based field tree from `@angular/forms/signals`. */
    fieldTree = input.required<FieldTree<string>>();

    /** Optional placeholder text. Defaults to an empty string. */
    placeholder = input<string>('');
}

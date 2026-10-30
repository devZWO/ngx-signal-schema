import {booleanAttribute, Component, input} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FieldTree, FormField} from '@angular/forms/signals';
import {TrimDirective} from '@devzwo/ngx-signal-schema';
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
    imports: [MatFormFieldModule, MatInputModule, FormField, ErrorIndicator, TrimDirective],
    template: `
        @if (!fieldTree()().hidden()) {
            <mat-form-field appearance="outline">
                <mat-label>{{ label() }}</mat-label>
                <input
                    matInput
                    [formField]="fieldTree()"
                    [placeholder]="placeholder()"
                    [trim]="trim()"
                    [trimControlCharacters]="trimControlCharacters()"
                >
                <mat-error appErrorIndicator [fieldState]="fieldTree()()"/>
            </mat-form-field>
        }
    `,
    styles: `
        :host {
            display: contents;
        }
    `,
})
export class InputFormField {
    /** The floating label for the input field. */
    label = input.required<string>();

    /** The signal-based field tree from `@angular/forms/signals`. */
    fieldTree = input.required<FieldTree<string>>();

    /** Optional placeholder text. Defaults to an empty string. */
    placeholder = input<string>('');

    /** Enables or disables trimming on blur. Defaults to true. */
    trim = input<boolean, unknown>(true, {
        transform: booleanAttribute,
    });

    /** Whether to also trim ASCII and Unicode control characters. Defaults to false. */
    trimControlCharacters = input<boolean, unknown>(false, {
        transform: booleanAttribute,
    });
}

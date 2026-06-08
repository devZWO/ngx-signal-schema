import {Component, input} from '@angular/core';
import {FieldState} from '@angular/forms/signals';

/**
 * A specialized error display component that integrates with `ngx-signal-schema` and `@angular/forms/signals`.
 * It is used as an attribute directive on a `mat-error` element to automatically display
 * the first validation error message from the provided field state.
 *
 * @example
 * ```html
 * <mat-error appErrorIndicator [fieldState]="myField()()"></mat-error>
 * ```
 */
@Component({
    selector: 'mat-error[appErrorIndicator]',
    imports: [],
    template: `
        @if (fieldState().errors(); as errors) {
            {{ errors[0]?.message }}
        }
    `,
    styles: `
    `,
})
export class ErrorIndicator {
    /**
     * The signal-based field state containing the current errors, touched status, etc.
     * Use `fieldTree()()` to extract the state from a field tree.
     */
    public readonly fieldState = input.required<FieldState<unknown>>();
}

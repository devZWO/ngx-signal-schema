import {booleanAttribute, Directive, ElementRef, inject, input} from '@angular/core';

/**
 * Options for configuring string trimming behavior.
 */
export interface TrimOptions {
    /**
     * Whether to also trim ASCII and Unicode control characters.
     * Default: false
     */
    includeControlCharacters?: boolean;
}

/**
 * A directive that trims whitespace (and optionally control characters) from `<input>` and `<textarea>`
 * elements upon blur.
 *
 * When the value is modified by trimming, native `input` and `change` events are dispatched
 * to ensure that `@angular/forms/signals` and other model bindings are properly updated.
 *
 * @example
 * ```html
 * <!-- Static attribute usage on input or textarea -->
 * <input trim type="text" [formField]="form.name" />
 *
 * <!-- Dynamic binding with optional control character trimming -->
 * <textarea [trim]="isTrimActive()" [trimControlCharacters]="true" [formField]="form.bio"></textarea>
 * ```
 *
 * @category Directives
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: 'input[trim], textarea[trim]',
    host: {
        '(blur)': 'onBlur()',
    },
})
export class TrimDirective {
    private readonly elementRef = inject<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(ElementRef);

    /**
     * Enables or disables trimming on blur.
     * Defaults to true when the attribute is present.
     */
    readonly trim = input<boolean, unknown>(true, {
        transform: booleanAttribute,
    });

    /**
     * Whether to also trim ASCII and Unicode control characters.
     * Default: false
     */
    readonly trimControlCharacters = input<boolean, unknown>(false, {
        transform: booleanAttribute,
    });

    /**
     * Handles the blur event on the host element.
     */
    protected onBlur(): void {
        if (!this.trim()) {
            return;
        }

        const el = this.elementRef.nativeElement;
        if (el.disabled || el.readOnly) {
            return;
        }

        const currentValue = el.value;

        const trimmedValue = this.trimControlCharacters()
            ? currentValue.replace(/^[\s\p{C}]+|[\s\p{C}]+$/gu, '')
            : currentValue.trim();

        if (currentValue !== trimmedValue) {
            el.value = trimmedValue;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
}

import {SchemaPath, validate} from '@angular/forms/signals';
import {ErrorOption, ValidationErrorWith} from './error-options';
import {parseLocalizedInteger} from './integer-parser';
import {stripLeadingZeros, toPlainDecimalString} from './decimal-parser';

/**
 * Configuration options for the integer validator.
 *
 * @category Other
 */
export interface IntegerOptions extends ErrorOption {
    /**
     * Maximum number of digits allowed in the integer part.
     */
    maxDigits: number;
    /**
     * Optional custom error message.
     * @deprecated Use `error.message` from `ErrorOption` instead.
     */
    message?: string;
    /**
     * Optional locale for parsing localized strings (defaults to 'de-DE').
     */
    locale?: string;
}

/**
 * Schema helper for integer numbers stored as number | null.
 *
 * This validator checks the *shape* of the integer value:
 * - whether it is a finite number and an integer (no fractional part)
 * - whether the number of digits fits into the allowed range
 *
 * It intentionally does NOT check:
 * - required / missing values
 * - min / max
 * - whether negative numbers are allowed
 *
 * Those concerns should be handled by separate validators.
 *
 * The validator returns two separated error-kinds:
 * - integer.isInteger: if the value is not a (finite) integer
 * - integer.digitCount: if the number of digits is not within the allowed range
 *
 * @example
 * integer(path.count, { maxDigits: 3 });
 *
 * @param path - The schema path to the field to validate.
 * @param options - Configuration options for the validator.
 *
 * @category Validators
 */
export function integer(
    path: SchemaPath<number | string | null>,
    options: IntegerOptions,
): void {
    const {maxDigits, message, locale = 'de-DE'} = options;

    validate(path, ({value}): ValidationErrorWith<IntegerOptions> | null => {


        const result = parseLocalizedInteger(value(), locale);

        switch (result.kind) {
            case 'empty':
                // Missing values are handled by validators like required().
                return null;

            case 'not-a-number':
            case 'not-an-integer':
                return {
                    kind: options.error?.kind ?? 'integer.isInteger',
                    message: options.error?.message ?? message,
                    options,
                };

            case 'success': {
                const current = result.value;

                const normalized = toPlainDecimalString(current, '.');
                const unsigned = normalized.startsWith('-')
                    ? normalized.slice(1)
                    : normalized;

                const integerPart = stripLeadingZeros(unsigned);

                if (integerPart.length > maxDigits) {
                    return {
                        kind: options.error?.kind ?? 'integer.digitCount',
                        message: options.error?.message ?? message,
                        options,
                    };
                }

                return null;
            }
        }
    });
}



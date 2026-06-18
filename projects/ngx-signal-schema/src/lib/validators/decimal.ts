import {SchemaPath, validate} from '@angular/forms/signals';
import {ErrorOption, ValidationErrorWith} from './error-options';
import {parseLocalizedFloat, stripLeadingZeros, toPlainDecimalString} from './decimal-parser';

/**
 * Configuration options for the decimal validator.
 *
 * @category Other
 */
export interface DecimalOptions extends ErrorOption {
    /**
     * Maximum number of digits before the decimal separator.
     * Example: maxIntegerDigits = 3 allows 999.99 but rejects 1000.00
     */
    maxIntegerDigits: number;

    /**
     * Maximum number of digits after the decimal separator.
     * Example: maxFractionDigits = 2 allows 12.34 but rejects 12.345
     */
    maxFractionDigits: number;

    /**
     * Optional custom error message. or message key
     * @deprecated Use `error.message` from `ErrorOption` instead.
     */
    message?: string;

    /**
     * Optional locale for parsing strings.
     * Default is 'de-DE'
     */
    locale?: string;
}

/**
 * Schema helper for decimal numbers stored as number | null.
 *
 * This validator checks the *shape* of the numeric value:
 * - whether it is a finite number
 * - whether the integer part fits into the allowed number of digits
 * - whether the fractional part fits into the allowed number of digits
 *
 * It intentionally does NOT check:
 * - required / missing values
 * - min / max
 * - whether negative numbers are allowed
 *
 * Those concerns should be handled by separate validators.
 *
 * The validator returns two separated error-kinds
 * - decimal.isNumber: if the value is not a (finite) number
 * - decimal.intCount: if the number of digits is not within the allowed range
 * - decimal.fractCount: if the number of digits is not within the allowed range
 *
 * @example
 * decimal(path.amount, { maxIntegerDigits: 5, maxFractionDigits: 2 });
 *
 * @param path - The schema path to the field to validate.
 * @param options - Configuration options for the validator.
 *
 * @category Validators
 */
export function decimal(
    path: SchemaPath<number | string | null>,
    options: DecimalOptions
): void {
    const {maxIntegerDigits, maxFractionDigits, message, locale = 'de-DE'} = options;
    const fractionSeparator = "."

    validate(path, ({value}): ValidationErrorWith<DecimalOptions> | null => {
        const result = parseLocalizedFloat(value(), locale);

        switch (result.kind) {
            case 'empty':
                return null;

            case 'not-a-number':
                return {
                    kind: options.error?.kind ?? 'decimal.isNumber',
                    message: options.error?.message ?? message,
                    options: options
                };

            case 'success': {
                const current = result.value;
                const normalized = toPlainDecimalString(current, fractionSeparator);
                const unsigned = normalized.startsWith('-') ? normalized.slice(1) : normalized;

                const [integerPartRaw, fractionPart = ''] = unsigned.split(fractionSeparator);
                const integerPart = stripLeadingZeros(integerPartRaw);

                const integerDigits = integerPart.length;
                const fractionDigits = fractionPart.length;

                if (integerDigits > maxIntegerDigits) {
                    return {
                        kind: options.error?.kind ?? 'decimal.intCount',
                        message: options.error?.message ?? message,
                        options: options
                    };
                }

                if (fractionDigits > maxFractionDigits) {
                    return {
                        kind: options.error?.kind ?? 'decimal.fractCount',
                        message: options.error?.message ?? message,
                        options: options
                    };
                }

                return null;
            }
        }
    });
}


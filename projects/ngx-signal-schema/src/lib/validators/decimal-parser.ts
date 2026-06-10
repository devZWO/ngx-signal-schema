/**
 * Converts a number into a plain decimal string without scientific notation.
 *
 * @example
 * toPlainDecimalString(12.34, "."); // returns "12.34"
 * @example
 * toPlainDecimalString(1e-7, ".");  // returns "0.0000001"
 *
 * This makes it possible to count integer and fraction digits reliably.
 *
 * @param value - The numeric value to convert.
 * @param fractionSeparator - The decimal separator to use in the output string.
 * @returns A plain string representation of the number.
 *
 * @deprecated This function was exported by mistake and will become internal in the next major release (v2). Don't use it.
 * @category deprecated
 */
export function toPlainDecimalString(value: number | string, fractionSeparator: string): string {
    const str = String(value);

    if (!/[eE]/.test(str)) {
        return str;
    }

    const [mantissa, exponentPart] = str.toLowerCase().split('e');
    const exponent = Number(exponentPart);

    const negative = mantissa.startsWith('-');
    const unsignedMantissa = negative ? mantissa.slice(1) : mantissa;
    const [intPart, fracPart = ''] = unsignedMantissa.split(fractionSeparator);

    const digits = intPart + fracPart;
    const decimalIndex = intPart.length;
    const newDecimalIndex = decimalIndex + exponent;

    let result: string;

    if (newDecimalIndex <= 0) {
        result = '0' + fractionSeparator + '0'.repeat(-newDecimalIndex) + digits;
    } else {
        // For JS numbers, scientific notation only occurs when the decimal point
        // moves outside the significant digits (exponent >= 21 or exponent <= -7).
        // Thus, newDecimalIndex is always either <= 0 or >= digits.length.
        result = digits + '0'.repeat(newDecimalIndex - digits.length);
    }

    return negative ? `-${result}` : result;
}

/**
 * Removes leading zeros but keeps a single "0" for values smaller than 1.
 *
 * @example
 * stripLeadingZeros("00012"); // returns "12"
 * @example
 * stripLeadingZeros("000"); // returns "0"
 *
 * @param value - The string to strip leading zeros from.
 * @returns The string without leading zeros.
 *
 * @deprecated This function was exported by mistake and will become internal in the next major release (v2).
 * @category deprecated
 */
export function stripLeadingZeros(value: string): string {
    const stripped = value.replace(/^0+(?=\d)/, '');
    return stripped === '' ? '0' : stripped;
}

/**
 * @deprecated This function was exported by mistake and will become internal in the next major release (v2).
 * @category deprecated
 */
export type ParseFloatResult =
    | { kind: 'empty' }
    | { kind: 'not-a-number'; raw: string }
    | { kind: 'success'; value: number };

/**
 * Parses a localized string or number into a float.
 *
 * @example
 * parseLocalizedFloat("1.234,56", "de-DE"); // returns { kind: 'success', value: 1234.56 }
 *
 * @param value - The value to parse.
 * @param locale - The locale used for parsing (defaults to 'de-DE').
 * @returns A result object indicating success or failure.
 *
 * @deprecated This function was exported by mistake and will become internal in the next major release (v2).
 * @category deprecated
 */
export function parseLocalizedFloat(
    value: string | number | null | undefined,
    locale = 'de-DE',
): ParseFloatResult {

    // null / undefined / ""
    if (value == null || value === '') {
        return {kind: 'empty'};
    }

    // accept number directly
    if (typeof value === 'number') {
        if (!Number.isFinite(value)) {
            return {
                kind: 'not-a-number',
                raw: String(value),
            };
        }

        return {
            kind: 'success',
            value,
        };
    }

    const trimmed = value.trim();

    if (trimmed === '') {
        return {kind: 'empty'};
    }

    const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);

    const group =
        parts.find(p => p.type === 'group')?.value ?? '.';

    const decimal =
        parts.find(p => p.type === 'decimal')?.value ?? ',';

    const normalized = trimmed
        .replaceAll(/\s/g, '')
        .replaceAll(group, '')
        .replace(decimal, '.');

    // not a valid number at all
    if (!/^[+-]?(\d+|\d+\.\d+|\.\d+)$/.test(normalized)) {
        return {
            kind: 'not-a-number',
            raw: value,
        };
    }

    const parsed = Number(normalized);

    if (!Number.isFinite(parsed)) {
        return {
            kind: 'not-a-number',
            raw: value,
        };
    }

    return {
        kind: 'success',
        value: parsed,
    };
}

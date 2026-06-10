import {parseLocalizedFloat} from './decimal-parser';

/**
 * @deprecated This function was exported by mistake and will become internal in the next major release (v2). Don't use it.
 * @category deprecated
 */
export type ParseIntegerResult =
    | { kind: 'empty' }
    | { kind: 'not-a-number'; raw: string }
    | { kind: 'not-an-integer'; raw: string; parsed: number }
    | { kind: 'success'; value: number };

/**
 * Parses a localized string or number into an integer.
 *
 * @example
 * parseLocalizedInteger("1.234", "de-DE"); // returns { kind: 'success', value: 1234 }
 *
 * @param value - The value to parse.
 * @param locale - The locale used for parsing (defaults to 'de-DE').
 * @returns A result object indicating success or failure.
 *
 * @deprecated This function was exported by mistake and will become internal in the next major release (v2). Don't use it.
 * @category deprecated
 */
export function parseLocalizedInteger(
    value: string | number | null | undefined,
    locale = 'de-DE',
): ParseIntegerResult {
    const result = parseLocalizedFloat(value, locale);

    if (result.kind !== 'success') {
        return result;
    }

    const parsed = result.value;

    // Number, but not an integer
    if (!Number.isInteger(parsed)) {
        return {
            kind: 'not-an-integer',
            raw: String(value),
            parsed,
        };
    }

    // For strings, we additionally check if they are formatted like an integer
    if (typeof value === 'string') {
        const trimmed = value.trim();
        const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
        const decimal = parts.find(p => p.type === 'decimal')?.value ?? ',';

        if (trimmed.includes(decimal)) {
            return {
                kind: 'not-an-integer',
                raw: value,
                parsed,
            };
        }
    }

    return {
        kind: 'success',
        value: parsed,
    };
}

import {SchemaPath, validate, ValidationError} from '@angular/forms/signals';
import {ErrorOption} from './options';

/**
 * This type is used to add the options to the error,
 * so you can use the option configuration in the error message.
 */
export interface ValidationErrorWithDecimalOptions extends ValidationError {
  options: DecimalOptions;
}

/**
 * Configuration options for the decimal validator.
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
 */
export function decimal(
  path: SchemaPath<number | string | null>,
  options: DecimalOptions
): void {
  const { maxIntegerDigits, maxFractionDigits, message, locale = 'de-DE' } = options;
  const fractionSeparator = "."

  validate(path, ({ value }): ValidationErrorWithDecimalOptions | null => {
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
 * stripLeadingZeros("000");   // returns "0"
 *
 * @param value - The string to strip leading zeros from.
 * @returns The string without leading zeros.
 */
export function stripLeadingZeros(value: string): string {
  const stripped = value.replace(/^0+(?=\d)/, '');
  return stripped === '' ? '0' : stripped;
}

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
 */
export function parseLocalizedFloat(
  value: string | number | null | undefined,
  locale = 'de-DE',
): ParseFloatResult {

  // null / undefined / ""
  if (value == null || value === '') {
    return { kind: 'empty' };
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
    return { kind: 'empty' };
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

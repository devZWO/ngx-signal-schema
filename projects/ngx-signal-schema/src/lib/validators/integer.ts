import {SchemaPath, validate, ValidationError} from '@angular/forms/signals';
import {parseLocalizedFloat, stripLeadingZeros, toPlainDecimalString} from './decimal';

/**
 * This type is used to add the options to the error,
 * so you can use the option configuration in the error message.
 */
export interface ValidationErrorWithIntegerOptions extends ValidationError {
  options: IntegerOptions;
}

/**
 * Configuration options for the integer validator.
 */
export interface IntegerOptions {
  /**
   * Maximum number of digits allowed in the integer part.
   */
  maxDigits: number;
  /**
   * Optional custom error message.
   */
  message?: string;
  /**
   * Optional locale for parsing localized strings (defaults to 'de-DE').
   */
  locale?: string;
};

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
 */
export function integer(
  path: SchemaPath<number | string | null>,
  options: IntegerOptions,
): void {
  const { maxDigits, message, locale = 'de-DE' } = options;

  validate(path, ({ value }): ValidationErrorWithIntegerOptions | null => {


    const result = parseLocalizedInteger(value(), locale);

    switch (result.kind) {
      case 'empty':
        // Missing values are handled by validators like required().
        return null;

      case 'not-a-number':
      case 'not-an-integer':
        return {
          kind: 'integer.isInteger',
          message,
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
            kind: 'integer.digitCount',
            message,
            options,
          };
        }

        return null;
      }
    }
  });
}

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

import {SchemaPath, validate, ValidationError} from '@angular/forms/signals';

export type ValidationErrorWithDecimalOptions = ValidationError & {
  options: DecimalOptions
}

export type DecimalOptions = {
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
   */
  message?: string;

  /**
   * Optional locale for parsing strings.
   * Default is 'de-DE'
   */
  locale?: string;
};

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
 * The validator returns two seperated error-kinds
 * - decimal.isNumber: if the value is not a (finite) number
 * - decimal.intCount: if the number of digits is not within the allowed range
 * - decimal.fractCount: if the number of digits is not within the allowed range
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
          kind: 'decimal.isNumber',
          message: message,
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
            kind: 'decimal.intCount',
            message: message,
            options: options
          };
        }

        if (fractionDigits > maxFractionDigits) {
          return {
            kind: 'decimal.fractCount',
            message: message,
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
 * Examples:
 * - 12.34    -> "12.34"
 * - 1000     -> "1000"
 * - 1e-7     -> "0.0000001"
 * - -2.5e3   -> "-2500"
 *
 * This makes it possible to count integer and fraction digits reliably.
 */
function toPlainDecimalString(value: number | string, fractionSeparator: string): string {
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
  } else if (newDecimalIndex >= digits.length) {
    result = digits + '0'.repeat(newDecimalIndex - digits.length);
  } else {
    result =
      digits.slice(0, newDecimalIndex) + fractionSeparator + digits.slice(newDecimalIndex);
  }

  return negative ? `-${result}` : result;
}

/**
 * Removes leading zeros but keeps a single "0" for values smaller than 1.
 *
 * Examples:
 * - "00012" -> "12"
 * - "000"   -> "0"
 * - "0"     -> "0"
 *
 */
function stripLeadingZeros(value: string): string {
  const stripped = value.replace(/^0+(?=\d)/, '');
  return stripped === '' ? '0' : stripped;
}

export type ValidationErrorWithIntegerOptions = ValidationError & {
  options: IntegerOptions
}

export type IntegerOptions = {
  maxDigits: number;
  message?: string;
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
 * - integer.isNumber: if the value is not a (finite) integer
 * - integer.digitCount: if the number of digits is not within the allowed range
 *
 * @param path
 * @param options
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

export type ParseFloatResult =
  | { kind: 'empty' }
  | { kind: 'not-a-number'; raw: string }
  | { kind: 'success'; value: number };

export function parseLocalizedFloat(
  value: string | number | null | undefined,
  locale = 'de-DE',
): ParseFloatResult {

  // null / undefined / ""
  if (value == null || value === '') {
    return { kind: 'empty' };
  }

  // number direkt akzeptieren
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

  // überhaupt keine gültige Zahl
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

type ParseIntegerResult =
  | { kind: 'empty' }
  | { kind: 'not-a-number'; raw: string }
  | { kind: 'not-an-integer'; raw: string; parsed: number }
  | { kind: 'success'; value: number };

export function parseLocalizedInteger(
  value: string | number | null | undefined,
  locale = 'de-DE',
): ParseIntegerResult {
  const result = parseLocalizedFloat(value, locale);

  if (result.kind !== 'success') {
    return result;
  }

  const parsed = result.value;

  // Zahl, aber keine Ganzzahl
  if (!Number.isInteger(parsed)) {
    return {
      kind: 'not-an-integer',
      raw: String(value),
      parsed,
    };
  }

  // Für Strings prüfen wir zusätzlich, ob sie wie ein Integer formatiert sind
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

import { describe, it, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { form, schema } from '@angular/forms/signals';
import { signal } from '@angular/core';
import { decimal, DecimalOptions, stripLeadingZeros } from './decimal';

describe('decimal validator', () => {

  function createDecimalForm(initialValue: number | string | null, options: DecimalOptions) {
    const valueSignal = signal(initialValue);
    const decimalSchema = schema<number | string | null>((path) => {
      decimal(path, options);
    });

    return TestBed.runInInjectionContext(() => {
      return form(valueSignal, decimalSchema);
    });
  }

  it('should be valid for null values', () => {
    const f = createDecimalForm(null, { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for valid decimal numbers', () => {
    const f = createDecimalForm(123.45, { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for valid decimal strings (de-DE)', () => {
    const f = createDecimalForm("123,45", { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for valid decimal strings with thousand separators (de-DE)', () => {
    const f = createDecimalForm("1.234,56", { maxIntegerDigits: 4, maxFractionDigits: 2 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for decimal strings with spaces', () => {
    const f = createDecimalForm(" 1 234 , 56 ", { maxIntegerDigits: 4, maxFractionDigits: 2 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for negative decimal strings', () => {
    const f = createDecimalForm("-123,45", { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be invalid for non-numeric strings', () => {
    const f = createDecimalForm("abc", { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'decimal.isNumber' }]);
  });

  it('should be invalid if integer part in string is too long', () => {
    const f = createDecimalForm("1234,56", { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'decimal.intCount' }]);
  });

  it('should be invalid if fractional part in string is too long', () => {
    const f = createDecimalForm("123,456", { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'decimal.fractCount' }]);
  });

  it('should be valid for integers within range', () => {
    const f = createDecimalForm(123, { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for small decimals', () => {
    const f = createDecimalForm(0.12, { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be invalid if integer part is too long', () => {
    const f = createDecimalForm(1234.56, { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'decimal.intCount' }]);
  });

  it('should be invalid if fractional part is too long', () => {
    const f = createDecimalForm(123.456, { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'decimal.fractCount' }]);
  });

  it('should be invalid if not a finite number (NaN)', () => {
    const f = createDecimalForm(NaN, { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'decimal.isNumber' }]);
  });

  it('should be invalid if not a finite number (Infinity)', () => {
    const f = createDecimalForm(Infinity, { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'decimal.isNumber' }]);
  });

  it('should handle negative numbers correctly', () => {
    const f = createDecimalForm(-123.45, { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary()).toEqual([]);

    const fInvalid = createDecimalForm(-1234.5, { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(fInvalid().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'decimal.intCount' }]);
  });

  it('should handle scientific notation correctly (small numbers)', () => {
    // 1e-7 = 0.0000001
    const f = createDecimalForm(1e-7, { maxIntegerDigits: 1, maxFractionDigits: 7 });
    expect(f().errorSummary()).toEqual([]);

    const fInvalid = createDecimalForm(1e-7, { maxIntegerDigits: 1, maxFractionDigits: 6 });
    expect(fInvalid().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'decimal.fractCount' }]);
  });

  it('should handle scientific notation correctly (large numbers)', () => {
    // 1.2e3 = 1200
    const f = createDecimalForm(1.2e3, { maxIntegerDigits: 4, maxFractionDigits: 0 });
    expect(f().errorSummary()).toEqual([]);

    const fInvalid = createDecimalForm(1.2e3, { maxIntegerDigits: 3, maxFractionDigits: 0 });
    expect(fInvalid().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'decimal.intCount' }]);
  });

  it('should use custom error message if provided', () => {
    const customMsg = 'Invalid format';
    const f = createDecimalForm(1234, { maxIntegerDigits: 3, maxFractionDigits: 2, message: customMsg });

    expect(f().errorSummary().map(e => ({ kind: e.kind, message: e.message }))).toEqual([{ kind: 'decimal.intCount', message: customMsg }]);
  });

  it('should be valid for empty strings', () => {
    const f = createDecimalForm("  ", { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be invalid for extremely large numbers resulting in Infinity', () => {
    // Number("9" * 1000) is Infinity
    const f = createDecimalForm("9".repeat(1000), { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'decimal.isNumber' }]);
  });

  it('should handle negative scientific notation', () => {
    const f = createDecimalForm(-1e-7, { maxIntegerDigits: 1, maxFractionDigits: 7 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should handle very large scientific notation', () => {
    // 1e21 stringifies to "1e+21"
    const f = createDecimalForm(1e21, { maxIntegerDigits: 22, maxFractionDigits: 0 });
    expect(f().errorSummary()).toEqual([]);

    const fInvalid = createDecimalForm(1e21, { maxIntegerDigits: 21, maxFractionDigits: 0 });
    expect(fInvalid().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'decimal.intCount' }]);
  });

  it('should support different locales', () => {
    const f = createDecimalForm("1,234.56", { maxIntegerDigits: 4, maxFractionDigits: 2, locale: 'en-US' });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should handle leading zeros correctly', () => {
    const f = createDecimalForm("000123,45", { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary()).toEqual([]);

    const fZero = createDecimalForm("000,45", { maxIntegerDigits: 1, maxFractionDigits: 2 });
    expect(fZero().errorSummary()).toEqual([]);
  });

  it('should be valid for undefined values', () => {
    // @ts-expect-error - testing invalid input type for robustness
    const f = createDecimalForm(undefined, { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('stripLeadingZeros should return "0" for empty string', () => {
    expect(stripLeadingZeros("")).toBe("0");
  });

  it('should use fallback separators if Intl fails', () => {
    const spy = vi.spyOn(Intl, 'NumberFormat').mockImplementation(function() {
      return {
        formatToParts: () => []
      } as unknown as Intl.NumberFormat;
    });

    const f = createDecimalForm("123,45", { maxIntegerDigits: 3, maxFractionDigits: 2 });
    expect(f().errorSummary()).toEqual([]);

    const f2 = createDecimalForm("1.234,56", { maxIntegerDigits: 4, maxFractionDigits: 2 });
    expect(f2().errorSummary()).toEqual([]);

    spy.mockRestore();
  });
});

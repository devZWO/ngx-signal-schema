import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { form, schema } from '@angular/forms/signals';
import { signal } from '@angular/core';
import { integer, IntegerOptions } from './integer';

describe('integer validator', () => {

  function createIntegerForm(initialValue: number | string | null, options: IntegerOptions) {
    const valueSignal = signal(initialValue);
    const integerSchema = schema<number | string | null>((path) => {
      integer(path, options);
    });

    return TestBed.runInInjectionContext(() => {
      return form(valueSignal, integerSchema);
    });
  }

  it('should be valid for null values', () => {
    const f = createIntegerForm(null, { maxDigits: 3 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for valid integers', () => {
    const f = createIntegerForm(123, { maxDigits: 3 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for valid integer strings', () => {
    const f = createIntegerForm("123", { maxDigits: 3 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for valid integer strings with thousand separators (de-DE)', () => {
    const f = createIntegerForm("1.234", { maxDigits: 4 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for integer strings with spaces', () => {
    const f = createIntegerForm(" 1 234 ", { maxDigits: 4 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for negative integer strings', () => {
    const f = createIntegerForm("-123", { maxDigits: 3 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be invalid for non-numeric strings', () => {
    const f = createIntegerForm("abc", { maxDigits: 3 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'integer.isInteger' }]);
  });

  it('should be invalid for decimal strings (de-DE)', () => {
    const f = createIntegerForm("12,34", { maxDigits: 3 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'integer.isInteger' }]);
  });

  it('should be valid for zero', () => {
    const f = createIntegerForm(0, { maxDigits: 3 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be invalid if integer is too long', () => {
    const f = createIntegerForm(1234, { maxDigits: 3 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'integer.digitCount' }]);
  });

  it('should be invalid if not an integer (decimal number)', () => {
    const f = createIntegerForm(12.34, { maxDigits: 3 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'integer.isInteger' }]);
  });

  it('should be invalid if not a finite number (NaN)', () => {
    const f = createIntegerForm(NaN, { maxDigits: 3 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'integer.isInteger' }]);
  });

  it('should handle negative integers correctly', () => {
    const f = createIntegerForm(-123, { maxDigits: 3 });
    expect(f().errorSummary()).toEqual([]);

    const fInvalid = createIntegerForm(-1234, { maxDigits: 3 });
    expect(fInvalid().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'integer.digitCount' }]);
  });

  it('should handle scientific notation for integers correctly', () => {
    // 1.2e3 = 1200
    const f = createIntegerForm(1.2e3, { maxDigits: 4 });
    expect(f().errorSummary()).toEqual([]);

    const fInvalid = createIntegerForm(1.2e3, { maxDigits: 3 });
    expect(fInvalid().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'integer.digitCount' }]);
  });

  it('should use custom error message if provided', () => {
    const customMsg = 'Invalid integer';
    const f = createIntegerForm(1234, { maxDigits: 3, message: customMsg });

    expect(f().errorSummary().map(e => ({ kind: e.kind, message: e.message }))).toEqual([{ kind: 'integer.digitCount', message: customMsg }]);
  });

  it('should be valid for empty strings', () => {
    const f = createIntegerForm("  ", { maxDigits: 3 });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be invalid for strings that look like decimals but are integers', () => {
    // "12,0" parses to 12, but has a decimal separator in de-DE
    const f = createIntegerForm("12,0", { maxDigits: 3 });
    expect(f().errorSummary().map(e => ({ kind: e.kind }))).toEqual([{ kind: 'integer.isInteger' }]);
  });

  it('should handle leading zeros correctly', () => {
    const f = createIntegerForm("000123", { maxDigits: 3 });
    expect(f().errorSummary()).toEqual([]);
  });
});

import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { form, schema } from '@angular/forms/signals';
import { signal } from '@angular/core';
import { decimal, DecimalOptions, integer, IntegerOptions } from './number-validator';

describe('decimal and integer validators', () => {

  function createDecimalForm(initialValue: number | string | null, options: DecimalOptions) {
    const valueSignal = signal(initialValue);
    const decimalSchema = schema<number | string | null>((path) => {
      decimal(path, options);
    });

    return TestBed.runInInjectionContext(() => {
      return form(valueSignal, decimalSchema);
    });
  }

  function createIntegerForm(initialValue: number | string | null, options: IntegerOptions) {
    const valueSignal = signal(initialValue);
    const integerSchema = schema<number | string | null>((path) => {
      integer(path, options);
    });

    return TestBed.runInInjectionContext(() => {
      return form(valueSignal, integerSchema);
    });
  }

  describe('decimal validator', () => {
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
      const customMsg = 'Ungültiges Format';
      const f = createDecimalForm(1234, { maxIntegerDigits: 3, maxFractionDigits: 2, message: customMsg });

      expect(f().errorSummary().map(e => ({ kind: e.kind, message: e.message }))).toEqual([{ kind: 'decimal.intCount', message: customMsg }]);
    });
  });

  describe('integer validator', () => {
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
      const customMsg = 'Ungültige Ganzzahl';
      const f = createIntegerForm(1234, { maxDigits: 3, message: customMsg });

      expect(f().errorSummary().map(e => ({ kind: e.kind, message: e.message }))).toEqual([{ kind: 'integer.digitCount', message: customMsg }]);
    });
  });
});

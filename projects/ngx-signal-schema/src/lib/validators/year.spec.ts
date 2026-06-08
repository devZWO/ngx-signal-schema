import {describe, expect, it} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {form, schema} from '@angular/forms/signals';
import {signal} from '@angular/core';
import {year} from './year';

describe('year validator', () => {

  function createForm(initialValue: string) {
    const valueSignal = signal(initialValue);
    const mySchema = schema<string>((path) => {
      year(path);
    });

    return TestBed.runInInjectionContext(() => {
      return form(valueSignal, mySchema);
    });
  }

  it('should be valid for a 4-digit year', () => {
    const f = createForm('2023');
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be invalid for a 3-digit year', () => {
    // pattern validator should catch it if it doesn't match the regex
    const f = createForm('123');
    const errors = f().errorSummary();

    // Note: depends on isIntegerTextRegex which is /^\d*$/ in fernwaerme-fortsetzung.ts
    // Wait, if the regex is /^\d*$/, then '123' matches.
    // But maxLength is 4.
    // Let's see what happens.
    expect(errors.some(e => e.kind === 'minLength')).toBe(true);
  });

  it('should be invalid for a 5-digit year', () => {
    const f = createForm('20234');
    const errors = f().errorSummary();
    expect(errors.some(e => e.kind === 'maxLength')).toBe(true);
  });

  it('should be invalid for non-numeric input', () => {
    const f = createForm('ABCD');
    const errors = f().errorSummary();
    expect(errors.some(e => e.kind === 'year')).toBe(true);
  });

    it('Assure does override minLength and maxLength error kinds when custom kind is provided', () => {
        const valueSignal = signal('123'); // Too short
        const mySchema = schema<string>((path) => {
            year(path, {error: {kind: 'customYearError'}});
        });

        const f = TestBed.runInInjectionContext(() => {
            return form(valueSignal, mySchema);
        });

        const errors = f().errorSummary();

        // The user wants 'minLength' to be overridden because kind was provided.
        expect(errors.some(e => e.kind === 'customYearError')).toBe(true);
        expect(errors.some(e => e.kind === 'minLength')).toBe(false);
    });

    it('Does override pattern error kind when custom kind is provided', () => {
        const valueSignal = signal('12A'); // Too short
        const mySchema = schema<string>((path) => {
            year(path, {error: {kind: 'customYearError'}});
        });

        const f = TestBed.runInInjectionContext(() => {
            return form(valueSignal, mySchema);
        });

        const errors = f().errorSummary();

        // The user wants 'minLength' to be overridden because kind was provided.
        expect(errors.some(e => e.kind === 'customYearError')).toBe(true);
        expect(errors.some(e => e.kind === 'year')).toBe(false);
    });

    it('should preserve minLength kind but override message when only message is provided', () => {
        const valueSignal = signal('123'); // Too short
        const mySchema = schema<string>((path) => {
            year(path, {error: {message: 'Custom Message'}});
        });

        const f = TestBed.runInInjectionContext(() => {
            return form(valueSignal, mySchema);
        });

        const errors = f().errorSummary();
        console.log('ERRORS:', JSON.stringify(errors, null, 2));

        // Kind should still be 'minLength' because no custom kind was provided.
        const minLengthError = errors.find(e => e.kind === 'minLength');
        expect(minLengthError).toBeDefined();
        expect(minLengthError?.message).toBe('Custom Message');
    });

    it('should use custom error kind only for the year pattern failure (non-numeric)', () => {
        const valueSignal = signal('202A'); // Correct length, but not a digit
        const mySchema = schema<string>((path) => {
            year(path, {error: {kind: 'customYearError', message: 'Custom Message'}});
        });

        const f = TestBed.runInInjectionContext(() => {
            return form(valueSignal, mySchema);
        });

        const errors = f().errorSummary();

        // Here the pattern fails, so it should use the custom kind.
        expect(errors.some(e => e.kind === 'customYearError')).toBe(true);
        expect(errors.some(e => e.kind === 'minLength')).toBe(false);
        expect(errors.some(e => e.kind === 'maxLength')).toBe(false);
    });
});

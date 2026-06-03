import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { form, schema } from '@angular/forms/signals';
import { signal } from '@angular/core';
import { yearText } from './year-text';

describe('yearText validator', () => {

  function createForm(initialValue: string) {
    const valueSignal = signal(initialValue);
    const mySchema = schema<string>((path) => {
      yearText(path);
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
    // In year-text-validator.ts: pattern(fieldPath, isIntegerTextRegex, {error: {kind: 'pattern.integerText'}})
    expect(errors.some(e => e.kind === 'pattern.isInteger')).toBe(true);
  });
});

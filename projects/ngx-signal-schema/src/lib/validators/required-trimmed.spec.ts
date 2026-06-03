import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { form, schema } from '@angular/forms/signals';
import { signal } from '@angular/core';
import { requiredTrimmed } from './required-trimmed.validator';

describe('requiredTrimmed validator', () => {

  function createForm(initialValue: string | null | undefined) {
    const valueSignal = signal(initialValue);
    const mySchema = schema<string | null | undefined>((path) => {
      requiredTrimmed(path);
    });

    return TestBed.runInInjectionContext(() => {
      return form(valueSignal, mySchema);
    });
  }

  it('should be valid for a non-empty string', () => {
    const f = createForm('hello');
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for a string with whitespace and content', () => {
    const f = createForm('  hello  ');
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be invalid for an empty string', () => {
    const f = createForm('');
    const errors = f().errorSummary();
    expect(errors.some(e => e.kind === 'required')).toBe(true);
  });

  it('should be invalid for a whitespace-only string', () => {
    const f = createForm('   ');
    const errors = f().errorSummary();
    expect(errors.some(e => e.kind === 'required')).toBe(true);
  });

  it('should be invalid for null', () => {
    const f = createForm(null);
    const errors = f().errorSummary();
    expect(errors.some(e => e.kind === 'required')).toBe(true);
  });

  it('should be invalid for undefined', () => {
    const f = createForm(undefined);
    const errors = f().errorSummary();
    expect(errors.some(e => e.kind === 'required')).toBe(true);
  });
});

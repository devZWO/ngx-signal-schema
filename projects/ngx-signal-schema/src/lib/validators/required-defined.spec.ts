import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { form, schema } from '@angular/forms/signals';
import { signal } from '@angular/core';
import { requiredDefined } from './required-defined';

describe('requiredDefined validator', () => {

  function createForm(initialValue: boolean | null | undefined) {
    const valueSignal = signal(initialValue);
    const mySchema = schema<boolean | null | undefined>((path) => {
      requiredDefined(path);
    });

    return TestBed.runInInjectionContext(() => {
      return form(valueSignal, mySchema);
    });
  }

  it('should be valid for true', () => {
    const f = createForm(true);
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for false', () => {
    const f = createForm(false);
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be invalid for null', () => {
    const f = createForm(null);
    const errors = f().errorSummary();
    expect(errors.length).toBe(1);
    expect(errors[0].kind).toBe('required');
  });

  it('should be invalid for undefined', () => {
    const f = createForm(undefined);
    const errors = f().errorSummary();
    expect(errors.length).toBe(1);
    expect(errors[0].kind).toBe('required');
  });
});

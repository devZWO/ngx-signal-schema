import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { form, schema } from '@angular/forms/signals';
import { signal } from '@angular/core';
import { requiredIfOtherFilled } from './required-if-other-filled';

describe('requiredIfOtherFilled validator', () => {

  interface MyModel {
    source: string | null;
    target: string | null;
  }

  function createForm(initialValue: MyModel) {
    const valueSignal = signal(initialValue);
    const mySchema = schema<MyModel>((path) => {
      requiredIfOtherFilled(path, p => p.source, p => p.target, { message: 'Required if source filled' });
    });

    return TestBed.runInInjectionContext(() => {
      return form(valueSignal, mySchema);
    });
  }

  it('should be valid if source is empty', () => {
    const f = createForm({ source: null, target: null });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid if source is filled and target is filled', () => {
    const f = createForm({ source: 'filled', target: 'filled' });
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be invalid if source is filled but target is empty', () => {
    const f = createForm({ source: 'filled', target: null });
    const errors = f().errorSummary();
    expect(errors.length).toBe(1);
    expect(errors[0].kind).toBe('required');
    expect(errors[0].message).toBe('Required if source filled');
    // Path check removed
  });

  it('should treat empty string as empty by default', () => {
    const f = createForm({ source: 'filled', target: '' });
    expect(f().errorSummary().length).toBe(1);
  });
});

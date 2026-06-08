import {describe, expect, it} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {form, minLength, schema} from '@angular/forms/signals';
import {signal} from '@angular/core';
import {inactive} from './inactive';

describe('inactive rule', () => {

  function createForm(initialValue: string) {
    const valueSignal = signal(initialValue);
    const mySchema = schema<string>((path) => {
      inactive(path);
    });

    return TestBed.runInInjectionContext(() => {
      return form(valueSignal, mySchema);
    });
  }

  it('should set field to disabled and hidden', () => {
    const f = createForm('test');
    expect(f().disabled()).toBe(true);
    expect(f().hidden()).toBe(true);
  });

  it('should support custom logic options', () => {
    const valueSignal = signal('test');
    const condition = signal(false);

    const mySchema = schema<string>((path) => {
      inactive(path, () => condition());
    });

    const f = TestBed.runInInjectionContext(() => form(valueSignal, mySchema));

    expect(f().disabled()).toBe(false);
    expect(f().hidden()).toBe(false);

    condition.set(true);
    expect(f().disabled()).toBe(true);
    expect(f().hidden()).toBe(true);
  });

  it('should not validate hidden fields with other validators', () => {
    const valueSignal = signal('ab'); // Too short for minLength(3)
    const isHidden = signal(false);

    const mySchema = schema<string>((path) => {
      minLength(path, 3);
      inactive(path, () => isHidden());
    });

    const f = TestBed.runInInjectionContext(() => form(valueSignal, mySchema));

    // Not hidden: validation should fail
    expect(f().errorSummary().some(e => e.kind === 'minLength')).toBe(true);

    // Hidden/Disabled: validation should be skipped
    isHidden.set(true);
    expect(f().errorSummary().some(e => e.kind === 'minLength')).toBe(false);
    expect(f().hidden()).toBe(true);
    expect(f().disabled()).toBe(true);
  });

});

import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { form, schema } from '@angular/forms/signals';
import { signal } from '@angular/core';
import { disabledHidden } from './disabled-hidden';

describe('disabledHidden rule', () => {

  function createForm(initialValue: string) {
    const valueSignal = signal(initialValue);
    const mySchema = schema<string>((path) => {
      disabledHidden(path);
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
      disabledHidden(path, () => condition());
    });

    const f = TestBed.runInInjectionContext(() => form(valueSignal, mySchema));

    expect(f().disabled()).toBe(false);
    expect(f().hidden()).toBe(false);

    condition.set(true);
    expect(f().disabled()).toBe(true);
    expect(f().hidden()).toBe(true);
  });
});

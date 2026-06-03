import { describe, it, expect } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { form, schema } from '@angular/forms/signals';
import { signal } from '@angular/core';
import { mimeType } from './mime-type.validator';

describe('mimeType validator', () => {

  function createForm(initialValue: string, allowed: string | string[] | (() => string | string[])) {
    const valueSignal = signal({ file: initialValue });
    const mySchema = schema<{ file: string }>((path) => {
      mimeType(path.file, allowed);
    });

    return TestBed.runInInjectionContext(() => {
      return form(valueSignal, mySchema);
    });
  }

  it('should be valid for matching mime type', () => {
    const f = createForm('image/png', 'image/png');
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be valid for matching mime type in array', () => {
    const f = createForm('application/pdf', ['image/png', 'application/pdf']);
    expect(f().errorSummary()).toEqual([]);
  });

  it('should be invalid for non-matching mime type', () => {
    const f = createForm('text/plain', ['image/png', 'application/pdf']);
    expect(f().errorSummary().length).toBe(1);
    expect(f().errorSummary()[0].kind).toBe('pattern');
  });

  it('should support wildcards', () => {
    const f = createForm('image/jpeg', 'image/*');
    expect(f().errorSummary()).toEqual([]);

    const f2 = createForm('application/pdf', 'image/*');
    expect(f2().errorSummary().length).toBe(1);
  });

  it('should support functional allowed types', () => {
    const allowed = signal(['image/png']);
    const f = createForm('image/png', () => allowed());
    expect(f().errorSummary()).toEqual([]);

    allowed.set(['application/pdf']);
    // Note: in signal-based forms, validation might need a cycle or manual trigger if not reactive in this way,
    // but here we just check if it works with the function.
    expect(f().errorSummary().length).toBe(1);
  });
});

import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { form, maxLength, minLength, required, schema } from '@angular/forms/signals';
import { signal } from '@angular/core';
import { notOnlyBlank, NotOnlyBlankOptions } from './not-only-blank';

describe('notOnlyBlank validator', () => {
  function createNotOnlyBlankForm(initialValue: string | null | undefined, options?: NotOnlyBlankOptions) {
    const valueSignal = signal(initialValue);
    const testSchema = schema<string | null | undefined>((path) => {
      notOnlyBlank(path, options);
    });

    return TestBed.runInInjectionContext(() => {
      return form(valueSignal, testSchema);
    });
  }

  describe('default whitespace validation', () => {
    it('should be valid for normal non-empty text', () => {
      const f = createNotOnlyBlankForm('hello');
      expect(f().errorSummary()).toEqual([]);
    });

    it('should be valid for text with leading and trailing whitespaces', () => {
      const f = createNotOnlyBlankForm('   hello   ');
      expect(f().errorSummary()).toEqual([]);
    });

    it('should be valid for null, undefined, and empty string by default (allowEmpty = true)', () => {
      expect(createNotOnlyBlankForm(null)().errorSummary()).toEqual([]);
      expect(createNotOnlyBlankForm(undefined)().errorSummary()).toEqual([]);
      expect(createNotOnlyBlankForm('')().errorSummary()).toEqual([]);
    });

    it('should be invalid for whitespace-only strings (spaces, tabs, newlines)', () => {
      const fSpaces = createNotOnlyBlankForm('   ');
      expect(fSpaces().errorSummary().map((e) => ({ kind: e.kind }))).toEqual([{ kind: 'notOnlyBlank' }]);

      const fTabsNewlines = createNotOnlyBlankForm('\t\n\r  ');
      expect(fTabsNewlines().errorSummary().map((e) => ({ kind: e.kind }))).toEqual([{ kind: 'notOnlyBlank' }]);
    });
  });

  describe('allowEmpty option', () => {
    it('should be invalid for null, undefined, or empty string when allowEmpty is false', () => {
      const fNull = createNotOnlyBlankForm(null, { allowEmpty: false });
      expect(fNull().errorSummary().map((e) => ({ kind: e.kind }))).toEqual([{ kind: 'notOnlyBlank' }]);

      const fUndefined = createNotOnlyBlankForm(undefined, { allowEmpty: false });
      expect(fUndefined().errorSummary().map((e) => ({ kind: e.kind }))).toEqual([{ kind: 'notOnlyBlank' }]);

      const fEmpty = createNotOnlyBlankForm('', { allowEmpty: false, error: { kind: 'customEmpty' } });
      expect(fEmpty().errorSummary().map((e) => ({ kind: e.kind }))).toEqual([{ kind: 'customEmpty' }]);
    });

    it('should be valid for valid text when allowEmpty is false', () => {
      const f = createNotOnlyBlankForm('hello', { allowEmpty: false });
      expect(f().errorSummary()).toEqual([]);
    });
  });

  describe('includeControlCharacters option', () => {
    it('should treat control characters as valid when includeControlCharacters is false/default', () => {
      // \x01\x02 are non-whitespace ASCII characters
      const f = createNotOnlyBlankForm('\x01\x02\t\n ');
      expect(f().errorSummary()).toEqual([]);
    });

    it('should reject control-character-only strings when includeControlCharacters is true', () => {
      const f = createNotOnlyBlankForm('\x01\x02\t\n ', { includeControlCharacters: true });
      expect(f().errorSummary().map((e) => ({ kind: e.kind }))).toEqual([{ kind: 'notOnlyBlank' }]);
    });

    it('should break consecutive sequences with control characters when includeControlCharacters is true', () => {
      // "hello\x00world" has 5 chars, then a null byte, then 5 chars.
      // With minConsecutive: 6, neither block qualifies if includeControlCharacters is true.
      const fInvalid = createNotOnlyBlankForm('hello\x00world', {
        includeControlCharacters: true,
        minConsecutive: 6,
      });
      expect(fInvalid().errorSummary().map((e) => ({ kind: e.kind }))).toEqual([{ kind: 'notOnlyBlank' }]);

      const fValidWithoutControlFlag = createNotOnlyBlankForm('hello\x00world', {
        includeControlCharacters: false,
        minConsecutive: 6,
      });
      expect(fValidWithoutControlFlag().errorSummary()).toEqual([]);
    });
  });

  describe('minConsecutive option', () => {
    it('should reject strings without enough consecutive valid characters', () => {
      const f = createNotOnlyBlankForm('ab cd ef', { minConsecutive: 3 });
      expect(f().errorSummary().map((e) => ({ kind: e.kind }))).toEqual([{ kind: 'notOnlyBlank' }]);
    });

    it('should accept strings containing at least one sequence meeting minConsecutive', () => {
      const f = createNotOnlyBlankForm('ab cde ef', { minConsecutive: 3 });
      expect(f().errorSummary()).toEqual([]);

      const fPadded = createNotOnlyBlankForm('   abc   ', { minConsecutive: 3 });
      expect(fPadded().errorSummary()).toEqual([]);
    });

    it('should handle minConsecutive <= 0 by clamping to 1', () => {
      const f = createNotOnlyBlankForm('a', { minConsecutive: 0 });
      expect(f().errorSummary()).toEqual([]);
    });
  });

  describe('error configuration and payload', () => {
    it('should use custom error kind and message when provided', () => {
      const customOptions: NotOnlyBlankOptions = {
        error: {
          kind: 'customBlankError',
          message: 'The field must not consist only of blanks.',
        },
      };

      const f = createNotOnlyBlankForm('   ', customOptions);
      const errors = f().errorSummary();

      expect(errors).toHaveLength(1);
      expect(errors[0].kind).toBe('customBlankError');
      expect(errors[0].message).toBe('The field must not consist only of blanks.');
    });

    it('should include options in the error payload', () => {
      const options: NotOnlyBlankOptions = {
        minConsecutive: 4,
        includeControlCharacters: true,
      };

      const f = createNotOnlyBlankForm('ab cd', options);
      const errors = f().errorSummary();

      expect(errors).toHaveLength(1);
      expect((errors[0] as unknown as { options: NotOnlyBlankOptions }).options).toEqual(options);
    });
  });

  describe('schema interoperability', () => {
    it('should work alongside required and minLength validators', () => {
      interface ComplexModel {
        title: string;
      }

      const model = signal<ComplexModel>({ title: '' });
      const complexSchema = schema<ComplexModel>((s) => {
        required(s.title);
        minLength(s.title, 5);
        notOnlyBlank(s.title, { minConsecutive: 3 });
      });

      const f = TestBed.runInInjectionContext(() => form(model, complexSchema));

      // Initially empty: required triggers (notOnlyBlank allowEmpty defaults to true)
      expect(f().errorSummary().map((e) => e.kind)).toContain('required');

      // Whitespace only of length 6: passes minLength(5), but fails notOnlyBlank
      model.set({ title: '      ' });
      expect(f().errorSummary().map((e) => e.kind)).toContain('notOnlyBlank');

      // 6 characters but separated words with max 2 chars each: fails minConsecutive: 3
      model.set({ title: 'aa bb' });
      expect(f().errorSummary().map((e) => e.kind)).toContain('notOnlyBlank');

      // Valid text meeting all constraints
      model.set({ title: 'Hello world' });
      expect(f().errorSummary()).toEqual([]);
    });

    it('should work alongside maxLength validator', () => {
      interface ComplexModel {
        bio: string;
      }

      const model = signal<ComplexModel>({ bio: 'Valid bio' });
      const complexSchema = schema<ComplexModel>((s) => {
        maxLength(s.bio, 10);
        notOnlyBlank(s.bio);
      });

      const f = TestBed.runInInjectionContext(() => form(model, complexSchema));
      expect(f().errorSummary()).toEqual([]);

      model.set({ bio: 'Too long text exceeding limit' });
      expect(f().errorSummary().map((e) => e.kind)).toContain('maxLength');
    });
  });
});

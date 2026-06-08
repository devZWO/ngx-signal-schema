import {describe, expect, it} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {form, metadata, REQUIRED, required, schema} from '@angular/forms/signals';
import {signal} from '@angular/core';
import {requiredTrimmed} from './required-trimmed';
import {requiredDefined} from './required-defined';

describe('required validators state', () => {

    it('manually setting REQUIRED metadata should trigger the required() signal state', () => {
        const valueSignal = signal('hello');
        const mySchema = schema<string | null | undefined>((path) => {
            metadata(path, REQUIRED, () => true);
        });

        const f = TestBed.runInInjectionContext(() => form(valueSignal, mySchema));
        expect(f().required()).toBe(true);
    });

    it('built-in required should trigger the required() signal state', () => {
        const valueSignal = signal('hello');
        const mySchema = schema<string | null | undefined>((path) => {
            required(path);
        });

        const f = TestBed.runInInjectionContext(() => form(valueSignal, mySchema));
        expect(f().required()).toBe(true);
    });

    it('requiredTrimmed should trigger the required() signal state', () => {
        const valueSignal = signal('hello');
        const mySchema = schema<string | null | undefined>((path) => {
            requiredTrimmed(path);
        });

        const f = TestBed.runInInjectionContext(() => form(valueSignal, mySchema));
        expect(f().required()).toBe(true);
    });

    it('requiredDefined should trigger the required() signal state', () => {
        const valueSignal = signal(true);
        const mySchema = schema<boolean | null | undefined>((path) => {
            requiredDefined(path);
        });

        const f = TestBed.runInInjectionContext(() => form(valueSignal, mySchema));
        expect(f().required()).toBe(true);
    });
});

import {describe, expect, it} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {form, schema} from '@angular/forms/signals';
import {signal} from '@angular/core';
import {unique, ValidationDestination} from './unique';

describe('unique validator', () => {

    function createStringForm(initialValue: string[]) {
        const valueSignal = signal(initialValue);
        const mySchema = schema<string[]>((path) => {
            unique(path);
        });

        return TestBed.runInInjectionContext(() => {
            return form(valueSignal, mySchema);
        });
    }

    function createObjectForm(initialValue: { name: string, id: number }[]) {
        const valueSignal = signal(initialValue);
        const mySchema = schema<{ name: string, id: number }[]>((path) => {
            unique(path, {
                equalFn: (a: { id: number }, b: { id: number }) => a.id === b.id
            });
        });

        return TestBed.runInInjectionContext(() => {
            return form(valueSignal, mySchema);
        });
    }

    describe('string[]', () => {
        it('should be valid for a unique array of strings (>= 4 items)', () => {
            const f = createStringForm(['apple', 'banana', 'cherry', 'date']);
            expect(f().errorSummary()).toEqual([]);
        });

        it('should be invalid for an array of strings with duplicates (default case-insensitive, trimmed, >= 4 items)', () => {
            const f = createStringForm(['apple', 'banana', ' apple ', 'date']);
            const errors = f().errorSummary();
            expect(errors.some(e => e.kind === 'unique')).toBe(true);
        });

        it('should be invalid for an array of strings with multiple duplicate values (>= 4 items)', () => {
            const f = createStringForm(['apple', 'apple', 'banana', 'banana']);
            const errors = f().errorSummary();
            expect(errors.some(e => e.kind === 'unique')).toBe(true);
        });

        it('should respect custom equalFn for strings', () => {
            const val = signal(['apple', 'banana', 'APPLE', 'date']);
            const mySchema = schema<string[]>((path) => {
                unique(path, {
                    equalFn: (a, b) => a === b // case-sensitive
                });
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            expect(f().errorSummary()).toEqual([]);

            val.set(['apple', 'banana', 'apple', 'date']);
            expect(f().errorSummary().some(e => e.kind === 'unique')).toBe(true);
        });
    });

    describe('{name: string, id: number}[]', () => {
        it('should be valid for a unique array of objects (>= 4 items)', () => {
            const f = createObjectForm([
                {name: 'Item 1', id: 1},
                {name: 'Item 2', id: 2},
                {name: 'Item 3', id: 3},
                {name: 'Item 4', id: 4}
            ]);
            expect(f().errorSummary()).toEqual([]);
        });

        it('should be invalid for an array of objects with duplicate IDs (>= 4 items)', () => {
            const f = createObjectForm([
                {name: 'Item 1', id: 1},
                {name: 'Item 2', id: 2},
                {name: 'Item 3', id: 1},
                {name: 'Item 4', id: 4}
            ]);
            const errors = f().errorSummary();
            expect(errors.some(e => e.kind === 'unique')).toBe(true);
        });

        it('should be invalid for an array of objects with multiple duplicates (>= 4 items)', () => {
            const f = createObjectForm([
                {name: 'Item 1', id: 1},
                {name: 'Item 2', id: 2},
                {name: 'Item 3', id: 1},
                {name: 'Item 4', id: 2}
            ]);
            const errors = f().errorSummary();
            expect(errors.some(e => e.kind === 'unique')).toBe(true);
        });
    });

    it('should work with default equalFn for non-string types (strict equality)', () => {
        const val = signal([1, 2, 3, 4]);
        const mySchema = schema<number[]>((path) => {
            unique(path);
        });
        const f = TestBed.runInInjectionContext(() => form(val, mySchema));
        expect(f().errorSummary()).toEqual([]);

        val.set([1, 2, 1, 4]);
        expect(f().errorSummary().some(e => e.kind === 'unique')).toBe(true);
    });

    it('should support custom error kind and message', () => {
        const val = signal(['a', 'a', 'b', 'c']);
        const mySchema = schema<string[]>((path) => {
            unique(path, {
                error: {
                    kind: 'custom-duplicate',
                    message: 'Values must be unique'
                }
            });
        });
        const f = TestBed.runInInjectionContext(() => form(val, mySchema));
        const errors = f().errorSummary();
        expect(errors.some(e => e.kind === 'custom-duplicate' && e.message === 'Values must be unique')).toBe(true);
    });

    describe('Edge cases', () => {
        it('should be valid for an empty array', () => {
            const f = createStringForm([]);
            expect(f().errorSummary()).toEqual([]);
        });

        it('should be valid for an array with a single item', () => {
            const f = createStringForm(['apple']);
            expect(f().errorSummary()).toEqual([]);
        });

        it('should be invalid if all items are identical', () => {
            const f = createStringForm(['apple', 'apple', 'apple', 'apple']);
            const errors = f().errorSummary();
            expect(errors.some(e => e.kind === 'unique')).toBe(true);
        });

        it('should be valid for unique falsy values', () => {
            const val = signal([0, '', false, null, undefined] as unknown[]);
            const mySchema = schema<unknown[]>((path) => {
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            expect(f().errorSummary()).toEqual([]);
        });

        it('should be invalid for duplicate falsy values', () => {
            const val = signal([0, 0, null, null] as unknown[]);
            const mySchema = schema<unknown[]>((path) => {
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            const errors = f().errorSummary();
            expect(errors.some(e => e.kind === 'unique')).toBe(true);
        });

        it('should consider objects with same content but different references as unique by default', () => {
            const obj1 = {id: 1};
            const obj2 = {id: 1};
            const val = signal([obj1, obj2]);
            const mySchema = schema<unknown[]>((path) => {
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            expect(f().errorSummary()).toEqual([]);

            val.set([obj1, obj1]); // same reference
            expect(f().errorSummary().some(e => e.kind === 'unique')).toBe(true);
        });

        it('should treat NaN as unique values because NaN !== NaN', () => {
            const val = signal([NaN, NaN]);
            const mySchema = schema<number[]>((path) => {
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            expect(f().errorSummary()).toEqual([]);
        });

        it('should be valid for null or undefined array', () => {
            const val = signal<string[] | null | undefined>(null);
            const mySchema = schema<string[] | null | undefined>((path) => {
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            expect(f().errorSummary()).toEqual([]);

            val.set(undefined);
            expect(f().errorSummary()).toEqual([]);
        });
    });

    describe('destination option', () => {
        it('should attach error to items by default', () => {
            const val = signal(['a', 'a', 'b', 'c']);
            const mySchema = schema<string[]>((path) => {
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            const errors = f().errorSummary();
            // 2 items error
            expect(errors.filter(e => e.kind === 'unique').length).toBe(2);
        });

        it('should attach error only to container when destination is "container"', () => {
            const val = signal(['a', 'a', 'b', 'c']);
            const mySchema = schema<string[]>((path) => {
                unique(path, {destination: 'container'});
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            const errors = f().errorSummary();
            // only 1 container error
            expect(errors.filter(e => e.kind === 'unique').length).toBe(1);
        });

        it('should attach error only to items when destination is "items"', () => {
            const val = signal(['a', 'a', 'b', 'c']);
            const mySchema = schema<string[]>((path) => {
                unique(path, {destination: 'items'});
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            const errors = f().errorSummary();
            // 2 items error
            expect(errors.filter(e => e.kind === 'unique').length).toBe(2);
        });

        it('should attach error to both when destination is "both"', () => {
            const val = signal(['a', 'a', 'b', 'c']);
            const mySchema = schema<string[]>((path) => {
                unique(path, {destination: 'both'});
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            const errors = f().errorSummary();
            // 2 items + 1 container = 3 errors
            expect(errors.filter(e => e.kind === 'unique').length).toBe(3);
        });

        it('should support signal as destination', () => {
            const val = signal(['a', 'a', 'b', 'c']);
            const dest = signal<ValidationDestination>('items');
            const mySchema = schema<string[]>((path) => {
                unique(path, {destination: dest});
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));

            // Initially 'items' -> 2 errors
            expect(f().errorSummary().filter(e => e.kind === 'unique').length).toBe(2);

            // Change to 'container' -> 1 error
            dest.set('container');
            expect(f().errorSummary().filter(e => e.kind === 'unique').length).toBe(1);

            // Change to 'both' -> 3 errors
            dest.set('both');
            expect(f().errorSummary().filter(e => e.kind === 'unique').length).toBe(3);
        });

        it('should support function as destination', () => {
            const val = signal(['a', 'a', 'b', 'c']);
            let currentDest: ValidationDestination = 'items';
            const destFn = () => currentDest;

            const mySchema = schema<string[]>((path) => {
                unique(path, {destination: destFn});
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));

            // Initially 'items' -> 2 errors
            expect(f().errorSummary().filter(e => e.kind === 'unique').length).toBe(2);

            // Change to 'container'
            currentDest = 'container';
            val.update(v => [...v]); // Trigger re-evaluation
            expect(f().errorSummary().filter(e => e.kind === 'unique').length).toBe(1);
        });
    });

    describe('Coverage and invalid usage', () => {
        it('should handle null/undefined path gracefully (if passed via cast)', () => {
            TestBed.runInInjectionContext(() => {
                // @ts-expect-error - testing invalid path
                expect(() => unique(null)).not.toThrow();
                // @ts-expect-error - testing invalid path
                expect(() => unique(undefined)).not.toThrow();
            });
        });
    });
});

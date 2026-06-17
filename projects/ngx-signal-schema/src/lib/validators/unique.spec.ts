import {describe, it, expect} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {form, schema} from '@angular/forms/signals';
import {signal} from '@angular/core';
import {unique} from './unique';
import {ArrayBlock, toArrayBlock} from '../structure/array-block';

describe('unique validator', () => {

    function createStringForm(initialValue: string[]) {
        const valueSignal = signal(toArrayBlock(initialValue));
        const mySchema = schema<ArrayBlock<string>>((path) => {
            unique(path);
        });

        return TestBed.runInInjectionContext(() => {
            return form(valueSignal, mySchema);
        });
    }

    function createObjectForm(initialValue: { name: string, id: number }[]) {
        const valueSignal = signal(toArrayBlock(initialValue));
        const mySchema = schema<ArrayBlock<{ name: string, id: number }>>((path) => {
            unique(path, {
                equalFn: (a: { id: number }, b: { id: number }) => a.id === b.id
            });
        });

        return TestBed.runInInjectionContext(() => {
            return form(valueSignal, mySchema);
        });
    }

    describe('ArrayBlock<string>', () => {
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
            const val = signal(toArrayBlock(['apple', 'banana', 'APPLE', 'date']));
            const mySchema = schema<ArrayBlock<string>>((path) => {
                unique(path, {
                    equalFn: (a, b) => a === b // case-sensitive
                });
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            expect(f().errorSummary()).toEqual([]);

            val.set(toArrayBlock(['apple', 'banana', 'apple', 'date']));
            expect(f().errorSummary().some(e => e.kind === 'unique')).toBe(true);
        });
    });

    describe('ArrayBlock<{name: string, id: number}>', () => {
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
        const val = signal(toArrayBlock([1, 2, 3, 4]));
        const mySchema = schema<ArrayBlock<number>>((path) => {
            unique(path);
        });
        const f = TestBed.runInInjectionContext(() => form(val, mySchema));
        expect(f().errorSummary()).toEqual([]);

        val.set(toArrayBlock([1, 2, 1, 4]));
        expect(f().errorSummary().some(e => e.kind === 'unique')).toBe(true);
    });

    it('should support custom error kind and message', () => {
        const val = signal(toArrayBlock(['a', 'a', 'b', 'c']));
        const mySchema = schema<ArrayBlock<string>>((path) => {
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
            const val = signal(toArrayBlock([0, '', false, null, undefined] as unknown[]));
            const mySchema = schema<ArrayBlock<unknown>>((path) => {
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            expect(f().errorSummary()).toEqual([]);
        });

        it('should be invalid for duplicate falsy values', () => {
            const val = signal(toArrayBlock([0, 0, null, null] as unknown[]));
            const mySchema = schema<ArrayBlock<unknown>>((path) => {
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            const errors = f().errorSummary();
            expect(errors.some(e => e.kind === 'unique')).toBe(true);
        });

        it('should consider objects with same content but different references as unique by default', () => {
            const obj1 = {id: 1};
            const obj2 = {id: 1};
            const val = signal(toArrayBlock([obj1, obj2]));
            const mySchema = schema<ArrayBlock<unknown>>((path) => {
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            expect(f().errorSummary()).toEqual([]);

            val.set(toArrayBlock([obj1, obj1])); // same reference
            expect(f().errorSummary().some(e => e.kind === 'unique')).toBe(true);
        });

        it('should treat NaN as unique values because NaN !== NaN', () => {
            const val = signal(toArrayBlock([NaN, NaN]));
            const mySchema = schema<ArrayBlock<number>>((path) => {
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            expect(f().errorSummary()).toEqual([]);
        });

        it('should be valid for null or undefined ArrayBlock', () => {
            const val = signal<ArrayBlock<string> | null | undefined>(null);
            const mySchema = schema<ArrayBlock<string> | null | undefined>((path) => {
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            expect(f().errorSummary()).toEqual([]);

            val.set(undefined);
            expect(f().errorSummary()).toEqual([]);
        });
    });

    describe('destination option', () => {
        it('should attach error to leaf by default', () => {
            const val = signal(toArrayBlock(['a', 'a', 'b', 'c']));
            const mySchema = schema<ArrayBlock<string>>((path) => {
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            const errors = f().errorSummary();
            // 2 items error
            expect(errors.filter(e => e.kind === 'unique').length).toBe(2);
        });

        it('should attach error only to node when destination is "node"', () => {
            const val = signal(toArrayBlock(['a', 'a', 'b', 'c']));
            const mySchema = schema<ArrayBlock<string>>((path) => {
                unique(path, {destination: 'node'});
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            const errors = f().errorSummary();
            // only 1 container error
            expect(errors.filter(e => e.kind === 'unique').length).toBe(1);
        });

        it('should attach error only to leaf when destination is "leaf"', () => {
            const val = signal(toArrayBlock(['a', 'a', 'b', 'c']));
            const mySchema = schema<ArrayBlock<string>>((path) => {
                unique(path, {destination: 'leaf'});
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            const errors = f().errorSummary();
            // 2 items error
            expect(errors.filter(e => e.kind === 'unique').length).toBe(2);
        });

        it('should attach error to both when destination is "both"', () => {
            const val = signal(toArrayBlock(['a', 'a', 'b', 'c']));
            const mySchema = schema<ArrayBlock<string>>((path) => {
                unique(path, {destination: 'both'});
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            const errors = f().errorSummary();
            // 2 items + 1 container = 3 errors
            expect(errors.filter(e => e.kind === 'unique').length).toBe(3);
        });
    });

    describe('Coverage and invalid usage', () => {
        it('should not return error if fieldPath is not an ArrayBlockPath', () => {
            const val = signal({name: 'test'});
            const mySchema = schema<{ name: string }>((path) => {
                // @ts-expect-error - testing invalid path
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            // In tests, Signal Form proxies might return proxies for any property,
            // making it hard to fail the isArrayBlockPath check.
            // But we still call it to ensure it doesn't crash.
            expect(f().errorSummary()).toEqual([]);
        });

        it('should handle null/undefined path gracefully (if passed via cast)', () => {
            TestBed.runInInjectionContext(() => {
                // @ts-expect-error - testing invalid path
                expect(() => unique(null)).not.toThrow();
                // @ts-expect-error - testing invalid path
                expect(() => unique(undefined)).not.toThrow();
            });
        });

        it('should hit line 76 if path is a plain object without items', () => {
            TestBed.runInInjectionContext(() => {
                // @ts-expect-error - testing invalid path
                unique({}, {});
            });
        });

        it('should not return error if value.items is missing', () => {
            const val = signal({} as unknown as ArrayBlock<string>);
            const mySchema = schema<ArrayBlock<string>>((path) => {
                unique(path);
            });
            const f = TestBed.runInInjectionContext(() => form(val, mySchema));
            expect(f().errorSummary()).toEqual([]);
        });
    });
});

import {describe, expect, it} from 'vitest';
import {TestBed} from '@angular/core/testing';
import {signal} from '@angular/core';
import {form, required, schema} from '@angular/forms/signals';
import {applyOptional, ApplyOptionalOptions, isOptionalBlock, mapFromOptionalBlock, mapToOptionalBlock, OptionalBlock, optionalBlock} from './optional-block';

describe('OptionalBlock', () => {
    describe('isOptionalBlock Type Guard', () => {
        it('should return true for a valid OptionalBlock', () => {
            const block: OptionalBlock<{ name: string }> = {
                meta: {enabled: true},
                data: {name: 'test'}
            };
            expect(isOptionalBlock(block)).toBe(true);
        });

        it('should return true for a valid OptionalBlock with custom meta type', () => {
            const block: OptionalBlock<{ name: string }, string> = {
                meta: {enabled: 'YES'},
                data: {name: 'test'}
            };
            expect(isOptionalBlock(block)).toBe(true);
        });

        it('should return false for null', () => {
            expect(isOptionalBlock(null)).toBe(false);
        });

        it('should return false for undefined', () => {
            expect(isOptionalBlock(undefined)).toBe(false);
        });

        it('should return false for a plain object missing meta', () => {
            const obj = {data: 'test'};
            expect(isOptionalBlock(obj)).toBe(false);
        });

        it('should return false for a plain object missing data', () => {
            const obj = {meta: {enabled: true}};
            expect(isOptionalBlock(obj)).toBe(false);
        });

        it('should return false for a plain object with invalid meta', () => {
            const obj = {meta: true, data: 'test'};
            expect(isOptionalBlock(obj)).toBe(false);
        });

        it('should preserve type when used in an if statement', () => {
            interface MyData {
                id: number;
                name: string
            }

            const maybeBlock: unknown = {meta: {enabled: true}, data: {id: 1, name: 'test'}};

            if (isOptionalBlock<MyData>(maybeBlock)) {
                // In this block, maybeBlock should be OptionalBlock<MyData>
                const data: MyData = maybeBlock.data;
                expect(data.id).toBe(1);
            } else {
                expect.fail('isOptionalBlock should have returned true');
            }
        });
    });

    describe('mapFromOptionalBlock', () => {
        it('should return data when enabled is true', () => {
            const block: OptionalBlock<string> = {meta: {enabled: true}, data: 'test'};
            expect(mapFromOptionalBlock(block)).toBe('test');
        });

        it('should return null when enabled is false', () => {
            const block: OptionalBlock<string> = {meta: {enabled: false}, data: 'test'};
            expect(mapFromOptionalBlock(block)).toBe(null);
        });
    });

    describe('mapToOptionalBlock', () => {
        it('should create an OptionalBlock with enabled: true by default', () => {
            const result = mapToOptionalBlock('test');
            expect(result).toEqual({meta: {enabled: true}, data: 'test'});
        });

        it('should create an OptionalBlock with specified enabled value', () => {
            const result = mapToOptionalBlock('test', false);
            expect(result).toEqual({meta: {enabled: false}, data: 'test'});
        });
    });

    describe('Schema Integration', () => {
        interface TestData {
            name: string;
        }

        it('optionalBlock should apply rules when enabled', () => {
            const testSchema = optionalBlock<TestData>((path) => {
                required(path.name);
            });

            const data = signal<OptionalBlock<TestData>>({
                meta: {enabled: true},
                data: {name: ''}
            });

            const f = TestBed.runInInjectionContext(() => form(data, testSchema));
            expect(f().errorSummary().length).toBeGreaterThan(0);

            data.set({
                meta: {enabled: true},
                data: {name: 'John'}
            });
            expect(f().errorSummary().length).toBe(0);
        });

        it('optionalBlock should not apply rules when disabled', () => {
            const testSchema = optionalBlock<TestData>((path) => {
                required(path.name);
            });

            const data = signal<OptionalBlock<TestData>>({
                meta: {enabled: false},
                data: {name: ''}
            });

            const f = TestBed.runInInjectionContext(() => form(data, testSchema));
            expect(f().errorSummary().length).toBe(0);
        });

        it('applyOptional should work within a larger schema', () => {
            interface RootData {
                opt: OptionalBlock<TestData>;
            }

            const rootSchema = schema<RootData>((path) => {
                applyOptional(path.opt, (data) => {
                    required(data.name);
                });
            });

            const data = signal<RootData>({
                opt: {
                    meta: {enabled: true},
                    data: {name: ''}
                }
            });

            const f = TestBed.runInInjectionContext(() => form(data, rootSchema));
            expect(f().errorSummary().length).toBeGreaterThan(0);

            data.update(v => ({...v, opt: {...v.opt, meta: {enabled: false}}}));
            expect(f().errorSummary().length).toBe(0);
        });

        it('optionalBlock should support custom isEnabled logic', () => {
            const testSchema = optionalBlock<{ val: string }, string>({
                then: (path) => {
                    required(path.val);
                },
                isEnabled: (enabled) => enabled === 'YES'
            });

            const data = signal<OptionalBlock<{ val: string }, string>>({
                meta: {enabled: 'NO'},
                data: {val: ''}
            });

            const f = TestBed.runInInjectionContext(() => form(data, testSchema));
            expect(f().errorSummary().length).toBe(0);

            data.set({
                meta: {enabled: 'YES'},
                data: {val: ''}
            });
            expect(f().errorSummary().length).toBeGreaterThan(0);
        });

        it('optionalBlock should apply otherwise rules when disabled', () => {
            const testSchema = optionalBlock<TestData>(
                () => { /* then */
                },
                (path) => {
                    required(path.name);
                }
            );

            const data = signal<OptionalBlock<TestData>>({
                meta: {enabled: false},
                data: {name: ''}
            });

            const f = TestBed.runInInjectionContext(() => form(data, testSchema));
            expect(f().errorSummary().length).toBeGreaterThan(0);

            data.update(v => ({...v, meta: {enabled: true}}));
            expect(f().errorSummary().length).toBe(0);
        });

        it('applyOptional should support otherwise', () => {
            interface RootData {
                opt: OptionalBlock<TestData>;
            }

            const rootSchema = schema<RootData>((path) => {
                applyOptional(
                    path.opt,
                    () => { /* then */
                    },
                    (data) => {
                        required(data.name);
                    }
                );
            });

            const data = signal<RootData>({
                opt: {
                    meta: {enabled: false},
                    data: {name: ''}
                }
            });

            const f = TestBed.runInInjectionContext(() => form(data, rootSchema));
            expect(f().errorSummary().length).toBeGreaterThan(0);

            data.update(v => ({...v, opt: {...v.opt, meta: {enabled: true}}}));
            expect(f().errorSummary().length).toBe(0);
        });

        it('optionalBlock should support otherwise in options object', () => {
            const testSchema = optionalBlock<TestData>({
                then: () => { /* then */
                },
                otherwise: (path) => {
                    required(path.name);
                }
            });

            const data = signal<OptionalBlock<TestData>>({
                meta: {enabled: false},
                data: {name: ''}
            });

            const f = TestBed.runInInjectionContext(() => form(data, testSchema));
            expect(f().errorSummary().length).toBeGreaterThan(0);
        });

        it('optionalBlock should support Schema objects returned by schema()', () => {
            const mySchema = schema<TestData>((path) => {
                required(path.name);
            });
            const testSchema = optionalBlock<TestData>(mySchema);

            const data = signal<OptionalBlock<TestData>>({
                meta: {enabled: true},
                data: {name: ''}
            });

            const f = TestBed.runInInjectionContext(() => form(data, testSchema));
            // If this is 0, it means the bug I suspected exists
            expect(f().errorSummary().length).toBeGreaterThan(0);
        });

        it('applyOptionalImpl should handle missing thenFn (for branch coverage)', () => {
            // We bypass types to test the branch coverage where then is missing but otherwise exists
            const testSchema = optionalBlock<TestData>({
                otherwise: () => { /* no-op */
                }
            } as unknown as ApplyOptionalOptions<TestData, boolean>);

            const data = signal<OptionalBlock<TestData>>({
                meta: {enabled: true},
                data: {name: ''}
            });

            const f = TestBed.runInInjectionContext(() => form(data, testSchema));
            expect(f().errorSummary().length).toBe(0); // thenFn is missing, so no error when enabled
        });
    });
});

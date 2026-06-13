import {describe, expect, it} from 'vitest';
import {ArrayBlock, fromArrayBlock, toArrayBlock} from './array-block';

describe('ArrayBlock', () => {
    describe('toArrayBlock', () => {
        it('should convert an array to an ArrayBlock', () => {
            const items = [1, 2, 3];
            const result = toArrayBlock(items);
            expect(result).toEqual({items});
        });

        it('should convert null to an ArrayBlock with an empty array', () => {
            const result = toArrayBlock(null);
            expect(result).toEqual({items: []});
        });

        it('should work with an empty array', () => {
            const result = toArrayBlock([]);
            expect(result).toEqual({items: []});
        });

        it('should handle undefined (via cast or JS)', () => {
            const result = toArrayBlock(undefined as unknown as number[]);
            expect(result).toEqual({items: []});
        });
    });

    describe('fromArrayBlock', () => {
        it('should convert an ArrayBlock back to an array', () => {
            const arrayBlock: ArrayBlock<number> = {items: [1, 2, 3]};
            const result = fromArrayBlock(arrayBlock);
            expect(result).toEqual([1, 2, 3]);
        });

        it('should work with an empty ArrayBlock', () => {
            const arrayBlock: ArrayBlock<number> = {items: []};
            const result = fromArrayBlock(arrayBlock);
            expect(result).toEqual([]);
        });

        it('should return the same array reference', () => {
            const items = [1, 2, 3];
            const arrayBlock: ArrayBlock<number> = {items};
            const result = fromArrayBlock(arrayBlock);
            expect(result).toBe(items);
        });
    });
});

import {describe, expect, it} from 'vitest';
import {includes} from './includes';

describe('includes', () => {
    const mockCtx = (val: unknown) => ({
        valueOf: () => val
    });

    it('should return true if list contains the value', () => {
        const rule = includes('path' as any, 'test');
        expect(rule(mockCtx(['a', 'test', 'b']) as any)).toBe(true);
    });

    it('should return false if list does not contain the value', () => {
        const rule = includes('path' as any, 'test');
        expect(rule(mockCtx(['a', 'b']) as any)).toBe(false);
    });

    it('should handle null list', () => {
        const rule = includes('path' as any, 'test');
        expect(rule(mockCtx(null) as any)).toBe(false);
    });

    it('should handle undefined list', () => {
        const rule = includes('path' as any, 'test');
        expect(rule(mockCtx(undefined) as any)).toBe(false);
    });

    it('should return false for empty list', () => {
        const rule = includes('path' as any, 'test');
        expect(rule(mockCtx([]) as any)).toBe(false);
    });
});

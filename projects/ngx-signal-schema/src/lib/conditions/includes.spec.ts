import {describe, expect, it} from 'vitest';
import {includes} from './includes';
import {SchemaRuleContext} from './schema-rule';

describe('includes', () => {
    const mockCtx = (val: unknown) => ({
        valueOf: () => val
    } as unknown as SchemaRuleContext);

    it('should return true if list contains the value', () => {
        const rule = includes(null as never, 'test');
        expect(rule(mockCtx(['a', 'test', 'b']))).toBe(true);
    });

    it('should return false if list does not contain the value', () => {
        const rule = includes(null as never, 'test');
        expect(rule(mockCtx(['a', 'b']))).toBe(false);
    });

    it('should handle null list', () => {
        const rule = includes(null as never, 'test');
        expect(rule(mockCtx(null))).toBe(false);
    });

    it('should handle undefined list', () => {
        const rule = includes(null as never, 'test');
        expect(rule(mockCtx(undefined))).toBe(false);
    });

    it('should return false for empty list', () => {
        const rule = includes(null as never, 'test');
        expect(rule(mockCtx([]))).toBe(false);
    });
});

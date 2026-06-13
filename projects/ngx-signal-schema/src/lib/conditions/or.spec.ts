import {describe, expect, it} from 'vitest';
import {or} from './or';

describe('or', () => {
    it('should return true if at least one rule returns true', () => {
        const rule = or(() => false, () => true);
        expect(rule(null as any)).toBe(true);
    });

    it('should return false if all rules return false', () => {
        const rule = or(() => false, () => false);
        expect(rule(null as any)).toBe(false);
    });

    it('should return false if no rules are provided', () => {
        const rule = or();
        expect(rule(null as any)).toBe(false);
    });

    it('should pass context to rules', () => {
        const mockCtx = {valueOf: () => 'val'};
        const rule = or((ctx) => ctx.valueOf(null as any) === 'val');
        expect(rule(mockCtx as any)).toBe(true);
    });
});

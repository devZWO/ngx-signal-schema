import {describe, expect, it} from 'vitest';
import {and} from './and';

describe('and', () => {
    it('should return true if all rules return true', () => {
        const rule = and(() => true, () => true);
        expect(rule(null as any)).toBe(true);
    });

    it('should return false if at least one rule returns false', () => {
        const rule = and(() => true, () => false);
        expect(rule(null as any)).toBe(false);
    });

    it('should return true if no rules are provided', () => {
        const rule = and();
        expect(rule(null as any)).toBe(true);
    });

    it('should pass context to rules', () => {
        const mockCtx = {valueOf: () => 'val'};
        const rule = and((ctx) => ctx.valueOf(null as any) === 'val');
        expect(rule(mockCtx as any)).toBe(true);
    });
});

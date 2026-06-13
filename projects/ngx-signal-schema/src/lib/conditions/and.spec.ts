import {describe, expect, it} from 'vitest';
import {and} from './and';
import {SchemaRuleContext} from './schema-rule';

describe('and', () => {
    it('should return true if all rules return true', () => {
        const rule = and(() => true, () => true);
        expect(rule(null as never)).toBe(true);
    });

    it('should return false if at least one rule returns false', () => {
        const rule = and(() => true, () => false);
        expect(rule(null as never)).toBe(false);
    });

    it('should return true if no rules are provided', () => {
        const rule = and();
        expect(rule(null as never)).toBe(true);
    });

    it('should pass context to rules', () => {
        const mockCtx = {valueOf: () => 'val'} as unknown as SchemaRuleContext;
        const rule = and((ctx) => ctx.valueOf(null as never) === 'val');
        expect(rule(mockCtx)).toBe(true);
    });
});

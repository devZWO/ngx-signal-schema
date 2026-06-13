import {describe, expect, it} from 'vitest';
import {or} from './or';
import {SchemaRuleContext} from './schema-rule';

describe('or', () => {
    it('should return true if at least one rule returns true', () => {
        const rule = or(() => false, () => true);
        expect(rule(null as never)).toBe(true);
    });

    it('should return false if all rules return false', () => {
        const rule = or(() => false, () => false);
        expect(rule(null as never)).toBe(false);
    });

    it('should return false if no rules are provided', () => {
        const rule = or();
        expect(rule(null as never)).toBe(false);
    });

    it('should pass context to rules', () => {
        const mockCtx = {valueOf: () => 'val'} as unknown as SchemaRuleContext;
        const rule = or((ctx) => ctx.valueOf(null as never) === 'val');
        expect(rule(mockCtx)).toBe(true);
    });
});

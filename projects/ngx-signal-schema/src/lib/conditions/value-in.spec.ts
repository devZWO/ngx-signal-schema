import {describe, expect, it} from 'vitest';
import {valueIn} from './value-in';

describe('valueIn', () => {
    const mockCtx = (val: unknown) => ({
        valueOf: () => val
    });

    it('should return true if value is in list', () => {
        const rule = valueIn(null as never, ['a', 'b', 'c']);
        expect(rule(mockCtx('b') as never)).toBe(true);
    });

    it('should return false if value is not in list', () => {
        const allowed = ['a', 'b', 'c'];
        const rule = valueIn(null as never, allowed);
        expect(rule(mockCtx('d') as never)).toBe(false);
    });

    it('should respect array mutations', () => {
        const allowed = ['a', 'c'];
        const rule = valueIn(null as never, allowed);

        expect(rule(mockCtx('d') as never)).toBe(false);
        allowed.pop(); // removes c
        allowed.push('d'); // adds d
        expect(rule(mockCtx('d') as never)).toBe(true);
        expect(rule(mockCtx('c') as never)).toBe(false);
    });

    it('should support functional/dynamic values', () => {
        let allowed = ['a', 'b'];
        const rule = valueIn(null as never, () => allowed);

        expect(rule(mockCtx('a') as never)).toBe(true);
        expect(rule(mockCtx('c') as never)).toBe(false);

        allowed = ['a', 'c'];
        expect(rule(mockCtx('b') as never)).toBe(false);
        expect(rule(mockCtx('c') as never)).toBe(true);
    });
});

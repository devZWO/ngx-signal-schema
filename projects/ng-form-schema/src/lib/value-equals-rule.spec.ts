import { describe, it, expect } from 'vitest';
import {not, valueEquals, valueIn} from './value-equals-rule';

describe('value-equals rules', () => {

  const mockCtx = (val: unknown) => ({
    valueOf: () => val
  });

  describe('valueEquals', () => {
    it('should return true if value matches', () => {
      const rule = valueEquals(null as never, 'test');
      expect(rule(mockCtx('test') as never)).toBe(true);
    });

    it('should return false if value does not match', () => {
      const rule = valueEquals(null as never, 'test');
      expect(rule(mockCtx('other') as never)).toBe(false);
    });
  });

  describe('valueIn', () => {
    it('should return true if value is in list', () => {
      const rule = valueIn(null as never, ['a', 'b', 'c']);
      expect(rule(mockCtx('b') as never)).toBe(true);
    });

    it('should return false if value is not in list', () => {
      const rule = valueIn(null as never, ['a', 'b', 'c']);
      expect(rule(mockCtx('d') as never)).toBe(false);
    });
  });

  describe('not', () => {
    it('should negate the rule', () => {
      const rule = not(() => true);
      expect(rule(null as never)).toBe(false);

      const rule2 = not(() => false);
      expect(rule2(null as never)).toBe(true);
    });
  });
});

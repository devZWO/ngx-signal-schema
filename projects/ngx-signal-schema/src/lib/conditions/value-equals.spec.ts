import { describe, it, expect } from 'vitest';
import {valueEquals} from './value-equals';

describe('valueEquals', () => {
  const mockCtx = (val: unknown) => ({
    valueOf: () => val
  });

  it('should return true if value matches', () => {
    const rule = valueEquals(null as never, 'test');
    expect(rule(mockCtx('test') as never)).toBe(true);
  });

  it('should return false if value does not match', () => {
    const rule = valueEquals(null as never, 'test');
    expect(rule(mockCtx('other') as never)).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
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
    const rule = valueIn(null as never, ['a', 'b', 'c']);
    expect(rule(mockCtx('d') as never)).toBe(false);
  });
});

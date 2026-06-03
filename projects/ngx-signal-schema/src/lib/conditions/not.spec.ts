import { describe, it, expect } from 'vitest';
import {not} from './not';

describe('not', () => {
  it('should negate the rule', () => {
    const rule = not(() => true);
    expect(rule(null as never)).toBe(false);

    const rule2 = not(() => false);
    expect(rule2(null as never)).toBe(true);
  });
});

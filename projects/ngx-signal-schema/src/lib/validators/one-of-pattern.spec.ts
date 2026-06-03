import { describe, it, expect } from 'vitest';
import { oneOfPattern } from './one-of-pattern';

describe('oneOfPattern', () => {
  it('should create an exact match pattern by default', () => {
    const regex = oneOfPattern('test');
    expect(regex.test('test')).toBe(true);
    expect(regex.test('TEST')).toBe(true);
    expect(regex.test('atest')).toBe(false);
    expect(regex.test('testa')).toBe(false);
  });

  it('should support multiple values', () => {
    const regex = oneOfPattern(['png', 'jpg']);
    expect(regex.test('png')).toBe(true);
    expect(regex.test('jpg')).toBe(true);
    expect(regex.test('gif')).toBe(false);
  });

  it('should support non-exact matching', () => {
    const regex = oneOfPattern('test', { exact: false });
    expect(regex.test('a test case')).toBe(true);
  });

  it('should support case sensitive matching', () => {
    const regex = oneOfPattern('test', { caseInsensitive: false });
    expect(regex.test('test')).toBe(true);
    expect(regex.test('TEST')).toBe(false);
  });

  it('should support wildcards', () => {
    const regex = oneOfPattern('image/*', { wildcard: true });
    expect(regex.test('image/png')).toBe(true);
    expect(regex.test('image/jpeg')).toBe(true);
    expect(regex.test('application/pdf')).toBe(false);
  });

  it('should escape special characters', () => {
    const regex = oneOfPattern('a.b');
    expect(regex.test('a.b')).toBe(true);
    expect(regex.test('axb')).toBe(false);
  });
});

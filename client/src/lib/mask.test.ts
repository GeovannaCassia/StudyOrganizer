import { describe, expect, it } from 'vitest';
import { maskDate, maskTime } from './mask';

describe('maskTime', () => {
  it.each([
    ['', ''],
    ['1', '1'],
    ['14', '14'],
    ['143', '14:3'],
    ['1430', '14:30'],
    ['14:30', '14:30'],
    ['14305', '14:30'],
    ['2a3h5', '23:5'],
  ])('"%s" → "%s"', (input, expected) => {
    expect(maskTime(input)).toBe(expected);
  });
});

describe('maskDate', () => {
  it.each([
    ['', ''],
    ['1', '1'],
    ['13', '13'],
    ['131', '13/1'],
    ['1310', '13/10'],
    ['13102', '13/10/2'],
    ['13102026', '13/10/2026'],
    ['13/10/2026', '13/10/2026'],
    ['131020261', '13/10/2026'],
  ])('"%s" → "%s"', (input, expected) => {
    expect(maskDate(input)).toBe(expected);
  });
});

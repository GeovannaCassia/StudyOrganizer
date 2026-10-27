import { describe, expect, it } from 'vitest';
import { formatDuration, parseTimeSpan } from './time';

describe('parseTimeSpan', () => {
  it.each([
    ['00:00:00', 0],
    ['00:45:00', 45],
    ['01:30:00', 90],
    ['12:00:00', 720],
    ['1.02:30:00', 1590],
    ['10.00:00:00', 14_400],
  ])('converte "%s" em %i minutos', (value, minutes) => {
    expect(parseTimeSpan(value)).toBe(minutes);
  });

  it('ignora frações de segundo e segundos que não completam um minuto', () => {
    expect(parseTimeSpan('01:30:00.1234567')).toBe(90);
    expect(parseTimeSpan('00:01:59')).toBe(1);
  });

  it('aceita valores negativos', () => {
    expect(parseTimeSpan('-00:30:00')).toBe(-30);
  });

  it.each(['', 'abc', '1:30', '01:30:00Z', '01:60'])('rejeita o formato inválido "%s"', (value) => {
    expect(() => parseTimeSpan(value)).toThrow('TimeSpan inválido');
  });
});

describe('formatDuration', () => {
  it.each([
    [0, '0min'],
    [45, '45min'],
    [60, '1h'],
    [65, '1h05'],
    [90, '1h30'],
    [750, '12h30'],
    [1590, '26h30'],
  ])('formata %i minutos como "%s"', (minutes, expected) => {
    expect(formatDuration(minutes)).toBe(expected);
  });

  it('trata negativos e frações como zero ou minutos inteiros', () => {
    expect(formatDuration(-10)).toBe('0min');
    expect(formatDuration(89.9)).toBe('1h29');
  });
});

import { describe, expect, it } from 'vitest';
import { cascadeSummary, pluralize } from './text';

describe('pluralize', () => {
  it.each([
    [0, '0 disciplinas'],
    [1, '1 disciplina'],
    [4, '4 disciplinas'],
  ])('%i → "%s"', (count, expected) => {
    expect(pluralize(count, 'disciplina', 'disciplinas')).toBe(expected);
  });
});

describe('cascadeSummary', () => {
  it.each([
    [10, 7, '10 tópicos e 7 sessões'],
    [1, 1, '1 tópico e 1 sessão'],
    [3, 0, '3 tópicos'],
    [0, 2, '2 sessões'],
  ])('%i tópicos e %i sessões → "%s"', (topics, sessions, expected) => {
    expect(cascadeSummary(topics, sessions)).toBe(expected);
  });

  it('devolve null quando a disciplina não tem tópicos nem sessões', () => {
    expect(cascadeSummary(0, 0)).toBeNull();
  });
});

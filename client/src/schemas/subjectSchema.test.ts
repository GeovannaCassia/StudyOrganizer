import { describe, expect, it } from 'vitest';
import { subjectSchema, toSubjectInput } from './subjectSchema';

describe('subjectSchema', () => {
  it('aceita nome e descrição, tirando os espaços das pontas', () => {
    const result = subjectSchema.parse({ name: '  Cálculo II  ', description: ' Prof. Ana ' });
    expect(result).toEqual({ name: 'Cálculo II', description: 'Prof. Ana' });
  });

  it('exige o nome (espaços não contam)', () => {
    const result = subjectSchema.safeParse({ name: '   ', description: '' });
    expect(result.error?.issues[0]?.message).toBe('Informe o nome da disciplina.');
  });

  it('limita o nome a 80 e a descrição a 200 caracteres', () => {
    expect(subjectSchema.safeParse({ name: 'a'.repeat(80), description: 'b'.repeat(200) }).success).toBe(true);
    expect(subjectSchema.safeParse({ name: 'a'.repeat(81), description: '' }).error?.issues[0]?.message).toBe(
      'O nome pode ter no máximo 80 caracteres.',
    );
    expect(subjectSchema.safeParse({ name: 'a', description: 'b'.repeat(201) }).error?.issues[0]?.message).toBe(
      'A descrição pode ter no máximo 200 caracteres.',
    );
  });
});

describe('toSubjectInput', () => {
  it('envia a descrição vazia como null', () => {
    expect(toSubjectInput({ name: 'Física', description: '' })).toEqual({ name: 'Física', description: null });
  });

  it('mantém a descrição preenchida', () => {
    expect(toSubjectInput({ name: 'Física', description: 'Mecânica' })).toEqual({
      name: 'Física',
      description: 'Mecânica',
    });
  });
});

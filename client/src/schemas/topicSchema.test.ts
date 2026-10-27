import { describe, expect, it } from 'vitest';
import { toTopicFields, topicSchema } from './topicSchema';

describe('topicSchema', () => {
  it('aceita título e descrição, tirando os espaços das pontas', () => {
    const result = topicSchema.parse({ title: '  Limites  ', description: ' Cap. 2 ' });
    expect(result).toEqual({ title: 'Limites', description: 'Cap. 2' });
  });

  it('exige o título (espaços não contam)', () => {
    const result = topicSchema.safeParse({ title: '   ', description: '' });
    expect(result.error?.issues[0]?.message).toBe('Informe o título do tópico.');
  });

  it('limita o título a 120 e a descrição a 300 caracteres', () => {
    expect(topicSchema.safeParse({ title: 'a'.repeat(120), description: 'b'.repeat(300) }).success).toBe(true);
    expect(topicSchema.safeParse({ title: 'a'.repeat(121), description: '' }).error?.issues[0]?.message).toBe(
      'O título pode ter no máximo 120 caracteres.',
    );
    expect(topicSchema.safeParse({ title: 'a', description: 'b'.repeat(301) }).error?.issues[0]?.message).toBe(
      'A descrição pode ter no máximo 300 caracteres.',
    );
  });
});

describe('toTopicFields', () => {
  it('envia a descrição vazia como null', () => {
    expect(toTopicFields({ title: 'Derivadas', description: '' })).toEqual({ title: 'Derivadas', description: null });
  });
});

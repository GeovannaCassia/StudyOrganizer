import { describe, expect, it } from 'vitest';
import { createSessionSchema, toSessionInput } from './sessionSchema';

// "Agora" fixo: 13/10/2026 às 20:00 no horário local
const schema = createSessionSchema(() => new Date(2026, 9, 13, 20, 0));
const firstError = (form: { date: string; startTime: string; endTime: string }) => {
  const issue = schema.safeParse(form).error?.issues[0];
  return issue && { path: issue.path.join('.'), message: issue.message };
};

describe('sessionSchema', () => {
  it('aceita uma sessão válida', () => {
    expect(schema.safeParse({ date: '13/10/2026', startTime: '14:00', endTime: '15:30' }).success).toBe(true);
  });

  it('aceita sessão que passa da meia-noite', () => {
    expect(schema.safeParse({ date: '12/10/2026', startTime: '23:00', endTime: '01:00' }).success).toBe(true);
  });

  it.each([
    [{ date: '', startTime: '14:00', endTime: '15:00' }, 'date', 'Informe a data.'],
    [{ date: '13/10/2026', startTime: '', endTime: '15:00' }, 'startTime', 'Informe o horário de início.'],
    [{ date: '13/10/2026', startTime: '14:00', endTime: '' }, 'endTime', 'Informe o horário de fim.'],
    [{ date: '31/02/2026', startTime: '14:00', endTime: '15:00' }, 'date', 'Informe uma data válida (dd/mm/aaaa).'],
    [{ date: '13/10', startTime: '14:00', endTime: '15:00' }, 'date', 'Informe uma data válida (dd/mm/aaaa).'],
    [{ date: '13/10/2026', startTime: '24:00', endTime: '15:00' }, 'startTime', 'Use o formato 24h (hh:mm), de 00:00 a 23:59.'],
    [{ date: '13/10/2026', startTime: '14:00', endTime: '9:30' }, 'endTime', 'Use o formato 24h (hh:mm), de 00:00 a 23:59.'],
    [{ date: '13/10/2026', startTime: '14:00', endTime: '14:00' }, 'endTime', 'O fim precisa ser diferente do início.'],
    [{ date: '12/10/2026', startTime: '08:00', endTime: '20:01' }, 'endTime', 'A sessão pode ter no máximo 12h.'],
    [{ date: '13/10/2026', startTime: '19:00', endTime: '20:30' }, 'endTime', 'O fim da sessão não pode estar no futuro.'],
    [{ date: '13/10/2026', startTime: '23:00', endTime: '01:00' }, 'endTime', 'O fim da sessão não pode estar no futuro.'],
  ])('%o → %s: "%s"', (form, path, message) => {
    expect(firstError(form)).toEqual({ path, message });
  });

  it('aceita exatamente 12h e fim igual a "agora"', () => {
    expect(schema.safeParse({ date: '13/10/2026', startTime: '08:00', endTime: '20:00' }).success).toBe(true);
  });
});

describe('toSessionInput', () => {
  it('converte o horário local para UTC (ISO com "Z")', () => {
    const input = toSessionInput({ date: '12/10/2026', startTime: '23:00', endTime: '01:00' }, 7);
    expect(input).toEqual({
      startTime: new Date(2026, 9, 12, 23, 0).toISOString(),
      endTime: new Date(2026, 9, 13, 1, 0).toISOString(),
      subjectId: 7,
    });
    expect(input.startTime.endsWith('Z')).toBe(true);
  });
});

import { describe, expect, it } from 'vitest';
import type { Session } from '@/types/session';
import { buildSessionRange, findOverlap, sessionMinutes, sortSessions } from './sessions';

// Datas montadas no horário local, para o teste valer em qualquer fuso
const local = (day: number, hour: number, minute = 0) => new Date(2026, 9, day, hour, minute);

const session = (id: number, start: Date, end: Date): Session => ({
  id,
  startTime: start.toISOString(),
  endTime: end.toISOString(),
  duration: '01:00:00',
  subjectId: 1,
});

describe('buildSessionRange', () => {
  it('calcula a duração no mesmo dia', () => {
    const range = buildSessionRange('13/10/2026', '14:00', '15:30');
    expect(range).toEqual({ start: local(13, 14), end: local(13, 15, 30), minutes: 90, crossesMidnight: false });
  });

  it('conta o fim como dia seguinte quando passa da meia-noite', () => {
    const range = buildSessionRange('13/10/2026', '23:00', '01:00');
    expect(range).toEqual({ start: local(13, 23), end: local(14, 1), minutes: 120, crossesMidnight: true });
  });

  it('fim igual ao início vira 24h (o schema barra antes)', () => {
    expect(buildSessionRange('13/10/2026', '10:00', '10:00')?.minutes).toBe(24 * 60);
  });

  it.each([
    ['', '14:00', '15:00'],
    ['13/10/2026', '', '15:00'],
    ['13/10/2026', '14:00', ''],
    ['40/13/2026', '14:00', '15:00'],
    ['31/02/2026', '14:00', '15:00'],
    ['13/10/26', '14:00', '15:00'],
  ])('devolve null com campo vazio ou inválido (%s %s %s)', (date, start, end) => {
    expect(buildSessionRange(date, start, end)).toBeNull();
  });
});

describe('sessionMinutes', () => {
  it('calcula pelo início e fim, ignorando o campo duration', () => {
    const old = { ...session(1, local(13, 15, 31), local(13, 17, 31)), duration: '00:00:00' };
    expect(sessionMinutes(old)).toBe(120);
  });

  it('funciona quando passa da meia-noite', () => {
    expect(sessionMinutes(session(1, local(13, 23), local(14, 1, 15)))).toBe(135);
  });
});

describe('sortSessions', () => {
  it('ordena das mais recentes para as mais antigas', () => {
    const sessions = [
      session(1, local(10, 9), local(10, 10)),
      session(2, local(12, 9), local(12, 10)),
      session(3, local(11, 9), local(11, 10)),
    ];
    expect(sortSessions(sessions).map((s) => s.id)).toEqual([2, 3, 1]);
  });
});

describe('findOverlap', () => {
  const existing = [session(1, local(13, 14), local(13, 15)), session(2, local(13, 22), local(14, 0, 30))];

  it.each([
    ['começa no meio de outra', local(13, 14, 30), local(13, 16), 1],
    ['contém outra', local(13, 13), local(13, 16), 1],
    ['fica dentro de outra', local(13, 14, 15), local(13, 14, 45), 1],
    ['cruza a meia-noite junto com outra', local(13, 23), local(14, 1), 2],
  ])('acha quando %s', (_case, start, end, id) => {
    expect(findOverlap({ start, end }, existing)?.id).toBe(id);
  });

  it.each([
    ['encosta no fim de outra', local(13, 15), local(13, 16)],
    ['encosta no início de outra', local(13, 13), local(13, 14)],
    ['fica em outro dia', local(12, 14), local(12, 15)],
  ])('não acusa quando %s', (_case, start, end) => {
    expect(findOverlap({ start, end }, existing)).toBeNull();
  });

  it('não acusa sem sessões', () => {
    expect(findOverlap({ start: local(13, 14), end: local(13, 15) }, [])).toBeNull();
  });
});

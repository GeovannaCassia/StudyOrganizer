import { describe, expect, it } from 'vitest';
import type { Session } from '@/types/session';
import { lastSevenDays, recentSessions, sumTopics, weekMinutes } from './dashboard';

// Datas no horário local (o teste vale em qualquer fuso). 14/10/2026 é uma quarta-feira.
const local = (day: number, hour: number, minute = 0) => new Date(2026, 9, day, hour, minute);
const NOW = local(14, 20);

let nextId = 1;
const session = (start: Date, minutes: number): Session => ({
  id: nextId++,
  startTime: start.toISOString(),
  endTime: new Date(start.getTime() + minutes * 60_000).toISOString(),
  duration: '00:00:00',
  subjectId: 1,
});

describe('weekMinutes', () => {
  it('soma de segunda a domingo da semana atual', () => {
    const sessions = [
      session(local(12, 0, 0), 60), // segunda, meia-noite: conta
      session(local(14, 9), 90), // hoje
      session(local(18, 23), 30), // domingo: conta
      session(local(11, 23, 30), 60), // domingo anterior (passa da meia-noite): não conta
      session(local(19, 8), 45), // segunda seguinte: não conta
    ];
    expect(weekMinutes(sessions, NOW)).toBe(180);
  });

  it('zero sem sessões', () => {
    expect(weekMinutes([], NOW)).toBe(0);
  });
});

describe('lastSevenDays', () => {
  it('devolve 7 dias terminando hoje, com zero nos dias sem sessão', () => {
    const days = lastSevenDays([session(local(14, 9), 90), session(local(14, 15), 45), session(local(10, 22), 60)], NOW);
    expect(days.map((d) => d.date.getDate())).toEqual([8, 9, 10, 11, 12, 13, 14]);
    expect(days.map((d) => d.minutes)).toEqual([0, 0, 60, 0, 0, 0, 135]);
  });

  it('conta a sessão no dia em que começou', () => {
    const days = lastSevenDays([session(local(13, 23), 120)], NOW);
    expect(days.at(-2)?.minutes).toBe(120);
    expect(days.at(-1)?.minutes).toBe(0);
  });

  it('ignora sessões fora da janela', () => {
    expect(lastSevenDays([session(local(7, 10), 60)], NOW).every((d) => d.minutes === 0)).toBe(true);
  });

  it('rótulos em português', () => {
    const today = lastSevenDays([], NOW).at(-1);
    expect(today?.label).toBe('qua');
    expect(today?.fullLabel).toBe('qua 14/10');
  });
});

describe('recentSessions', () => {
  it('as 5 mais recentes, da mais nova para a mais antiga', () => {
    const sessions = [1, 5, 3, 7, 2, 6, 4].map((day) => session(local(day, 10), 30));
    expect(recentSessions(sessions).map((s) => new Date(s.startTime).getDate())).toEqual([7, 6, 5, 4, 3]);
  });
});

describe('sumTopics', () => {
  it('soma os tópicos de todas as disciplinas, ignorando as não carregadas', () => {
    const progress = (completed: number, total: number) => ({
      subjectName: 'X',
      totalTopicsCompleted: completed,
      totalTopics: total,
      progress: 0,
    });
    expect(sumTopics([progress(2, 3), undefined, progress(0, 1)])).toEqual({ completed: 2, total: 4 });
    expect(sumTopics([])).toEqual({ completed: 0, total: 0 });
  });
});

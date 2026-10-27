import { endOfWeek, format, isSameDay, isWithinInterval, parseISO, startOfDay, startOfWeek, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Session } from '@/types/session';
import type { SubjectProgress } from '@/types/subject';
import { sessionMinutes, sortSessions } from './sessions';

export interface DayTotal {
  date: Date;
  /** Dia da semana abreviado, para o eixo: "qua". */
  label: string;
  /** Para a dica do gráfico: "qua 08/10". */
  fullLabel: string;
  minutes: number;
}

/**
 * Minutos estudados na semana atual, de segunda a domingo (horário local).
 * A sessão conta na semana em que começou.
 */
export function weekMinutes(sessions: Session[], now: Date = new Date()): number {
  const week = { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) };
  return sessions
    .filter((session) => isWithinInterval(parseISO(session.startTime), week))
    .reduce((total, session) => total + sessionMinutes(session), 0);
}

/** Minutos por dia nos últimos 7 dias, terminando hoje; a sessão conta no dia em que começou. */
export function lastSevenDays(sessions: Session[], now: Date = new Date()): DayTotal[] {
  return Array.from({ length: 7 }, (_, index) => {
    const date = startOfDay(subDays(now, 6 - index));
    const minutes = sessions
      .filter((session) => isSameDay(parseISO(session.startTime), date))
      .reduce((total, session) => total + sessionMinutes(session), 0);
    const weekday = format(date, 'EEEEEE', { locale: ptBR }); // "qua", "sab"
    return { date, label: weekday, fullLabel: `${weekday} ${format(date, 'dd/MM')}`, minutes };
  });
}

/** As sessões mais recentes de qualquer disciplina. */
export function recentSessions(sessions: Session[], count = 5): Session[] {
  return sortSessions(sessions).slice(0, count);
}

/** Soma os tópicos concluídos e o total de todas as disciplinas (ignora progresso ainda não carregado). */
export function sumTopics(progresses: (SubjectProgress | undefined)[]): { completed: number; total: number } {
  return progresses.reduce(
    (sum, progress) =>
      progress
        ? { completed: sum.completed + progress.totalTopicsCompleted, total: sum.total + progress.totalTopics }
        : sum,
    { completed: 0, total: 0 },
  );
}

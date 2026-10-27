import { addDays, differenceInMinutes, isValid, parse, parseISO } from 'date-fns';
import { DATE_INPUT_FORMAT, parseDateInput } from './time';
import type { Session } from '@/types/session';

/** Duração máxima de uma sessão, em minutos (12h). */
export const MAX_SESSION_MINUTES = 12 * 60;

export interface SessionRange {
  start: Date;
  end: Date;
  minutes: number;
  /** true quando o fim caiu no dia seguinte (ex.: 23:00–01:00). */
  crossesMidnight: boolean;
}

/**
 * Duração da sessão em minutos, calculada pelo início e fim (como a API faz no tempo total).
 * Não usa o campo `duration`: sessões antigas do banco o têm zerado.
 */
export function sessionMinutes(session: Session): number {
  return differenceInMinutes(parseISO(session.endTime), parseISO(session.startTime));
}

/** Mais recentes primeiro. */
export function sortSessions(sessions: Session[]): Session[] {
  return [...sessions].sort((a, b) => parseISO(b.startTime).getTime() - parseISO(a.startTime).getTime());
}

/**
 * Monta o intervalo da sessão a partir dos campos do formulário (horário local).
 * Se o fim for menor ou igual ao início, ele conta como dia seguinte.
 * Devolve null se algum campo estiver vazio ou inválido.
 */
export function buildSessionRange(date: string, startTime: string, endTime: string): SessionRange | null {
  if (!parseDateInput(date)) return null;
  const start = parse(`${date} ${startTime}`, `${DATE_INPUT_FORMAT} HH:mm`, new Date());
  const sameDayEnd = parse(`${date} ${endTime}`, `${DATE_INPUT_FORMAT} HH:mm`, new Date());
  if (!isValid(start) || !isValid(sameDayEnd)) return null;

  const crossesMidnight = sameDayEnd <= start;
  const end = crossesMidnight ? addDays(sameDayEnd, 1) : sameDayEnd;
  return { start, end, minutes: differenceInMinutes(end, start), crossesMidnight };
}

/** Primeira sessão já registrada que coincide com o intervalo (encostar não conta). */
export function findOverlap(range: Pick<SessionRange, 'start' | 'end'>, sessions: Session[]): Session | null {
  return (
    sortSessions(sessions)
      .reverse()
      .find((session) => parseISO(session.startTime) < range.end && parseISO(session.endTime) > range.start) ?? null
  );
}

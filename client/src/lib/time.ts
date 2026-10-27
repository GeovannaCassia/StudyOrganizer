import { format, isValid, parse, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { IsoDate, TimeSpan } from '@/types/api';

// "hh:mm:ss", "d.hh:mm:ss", com sinal e frações opcionais ("-1.02:30:00.1234567")
const TIMESPAN_REGEX = /^(-)?(?:(\d+)\.)?(\d{1,2}):(\d{2}):(\d{2})(?:\.\d+)?$/;

/** Converte o TimeSpan da API em minutos inteiros (frações de minuto são descartadas). */
export function parseTimeSpan(value: TimeSpan): number {
  const match = TIMESPAN_REGEX.exec(value.trim());
  if (!match) throw new Error(`TimeSpan inválido: "${value}"`);

  const [, sign, days = '0', hours, minutes, seconds] = match;
  const totalSeconds =
    Number(days) * 86_400 + Number(hours) * 3_600 + Number(minutes) * 60 + Number(seconds);
  const totalMinutes = Math.floor(totalSeconds / 60);

  return sign ? -totalMinutes : totalMinutes;
}

/** Formata minutos como "45min", "1h", "1h05" ou "26h30" (sem dias). */
export function formatDuration(totalMinutes: number): string {
  const minutes = Math.max(0, Math.floor(totalMinutes));
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `${rest}min`;
  if (rest === 0) return `${hours}h`;
  return `${hours}h${String(rest).padStart(2, '0')}`;
}

/** Data no horário local: "13/10/2026". */
export function formatDate(date: IsoDate): string {
  return format(parseISO(date), 'dd/MM/yyyy', { locale: ptBR });
}

/** Dia e mês no horário local: "13/10". */
export function formatDayMonth(date: IsoDate): string {
  return format(parseISO(date), 'dd/MM', { locale: ptBR });
}

/** Hora no horário local, 24h: "14:00". */
export function formatTime(date: IsoDate): string {
  return format(parseISO(date), 'HH:mm', { locale: ptBR });
}

/** Formato do campo de data do formulário. */
export const DATE_INPUT_FORMAT = 'dd/MM/yyyy';

/** Data no formato do campo ("27/10/2026"), no horário local. */
export function toDateInputValue(date: Date = new Date()): string {
  return format(date, DATE_INPUT_FORMAT);
}

/** Lê a data do campo ("27/10/2026"); null se estiver incompleta ou não existir (ex.: 31/02). */
export function parseDateInput(value: string): Date | null {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return null;
  const date = parse(value, DATE_INPUT_FORMAT, new Date());
  return isValid(date) ? date : null;
}

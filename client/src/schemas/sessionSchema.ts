import { z } from 'zod';
import { buildSessionRange, MAX_SESSION_MINUTES } from '@/lib/sessions';
import { parseDateInput } from '@/lib/time';
import type { SessionInput } from '@/types/session';

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

/** `now` é injetável para os testes ("o fim não pode ser no futuro"). */
export function createSessionSchema(now: () => Date = () => new Date()) {
  return z
    .object({
      date: z
        .string()
        .min(1, 'Informe a data.')
        .refine((value) => parseDateInput(value) !== null, 'Informe uma data válida (dd/mm/aaaa).'),
      startTime: z.string().min(1, 'Informe o horário de início.').regex(TIME_REGEX, 'Use o formato 24h (hh:mm), de 00:00 a 23:59.'),
      endTime: z.string().min(1, 'Informe o horário de fim.').regex(TIME_REGEX, 'Use o formato 24h (hh:mm), de 00:00 a 23:59.'),
    })
    .superRefine((form, ctx) => {
      const issue = (message: string) => ctx.addIssue({ code: 'custom', path: ['endTime'], message });

      if (form.startTime === form.endTime) return issue('O fim precisa ser diferente do início.');

      const range = buildSessionRange(form.date, form.startTime, form.endTime);
      if (!range) return; // campos inválidos já têm erro próprio

      if (range.minutes <= 0) return issue('A duração precisa ser maior que zero.');
      if (range.minutes > MAX_SESSION_MINUTES) return issue('A sessão pode ter no máximo 12h.');
      if (range.end > now()) return issue('O fim da sessão não pode estar no futuro.');
    });
}

export type SessionForm = z.infer<ReturnType<typeof createSessionSchema>>;

/** Converte o formulário (horário local) no payload da API, em UTC ("...Z"). */
export function toSessionInput(form: SessionForm, subjectId: number): SessionInput {
  const range = buildSessionRange(form.date, form.startTime, form.endTime);
  if (!range) throw new Error('Sessão inválida');
  return { startTime: range.start.toISOString(), endTime: range.end.toISOString(), subjectId };
}

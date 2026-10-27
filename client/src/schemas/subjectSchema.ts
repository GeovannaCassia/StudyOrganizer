import { z } from 'zod';
import type { SubjectInput } from '@/types/subject';

export const subjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Informe o nome da disciplina.')
    .max(80, 'O nome pode ter no máximo 80 caracteres.'),
  description: z.string().trim().max(200, 'A descrição pode ter no máximo 200 caracteres.'),
});

export type SubjectForm = z.infer<typeof subjectSchema>;

/** Converte o formulário no payload da API (descrição vazia vira null). */
export function toSubjectInput(form: SubjectForm): SubjectInput {
  return { name: form.name, description: form.description || null };
}

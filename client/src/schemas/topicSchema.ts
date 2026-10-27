import { z } from 'zod';

export const TOPIC_TITLE_MAX = 120;
export const TOPIC_DESCRIPTION_MAX = 300;

export const topicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Informe o título do tópico.')
    .max(TOPIC_TITLE_MAX, `O título pode ter no máximo ${TOPIC_TITLE_MAX} caracteres.`),
  description: z
    .string()
    .trim()
    .max(TOPIC_DESCRIPTION_MAX, `A descrição pode ter no máximo ${TOPIC_DESCRIPTION_MAX} caracteres.`),
});

export type TopicForm = z.infer<typeof topicSchema>;

/** Converte o formulário nos campos da API (descrição vazia vira null). */
export function toTopicFields(form: TopicForm): { title: string; description: string | null } {
  return { title: form.title, description: form.description || null };
}

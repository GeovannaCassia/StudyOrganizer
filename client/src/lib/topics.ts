import type { Topic } from '@/types/topic';

export const TOPIC_FILTERS = ['todos', 'pendentes', 'concluidos'] as const;
export type TopicFilter = (typeof TOPIC_FILTERS)[number];

/** Pendentes primeiro, depois os concluídos; dentro de cada grupo, a ordem de criação (id). */
export function sortTopics(topics: Topic[]): Topic[] {
  return [...topics].sort((a, b) => Number(a.isCompleted) - Number(b.isCompleted) || a.id - b.id);
}

export function filterTopics(topics: Topic[], filter: TopicFilter): Topic[] {
  if (filter === 'pendentes') return topics.filter((topic) => !topic.isCompleted);
  if (filter === 'concluidos') return topics.filter((topic) => topic.isCompleted);
  return topics;
}

/** Progresso de 0 a 100 com 2 casas, como a API calcula (0 quando não há tópicos). */
export function topicsProgress(completed: number, total: number): number {
  return total === 0 ? 0 : Math.round((completed / total) * 10000) / 100;
}

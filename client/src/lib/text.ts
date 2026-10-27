/** "1 tópico", "3 tópicos", "0 tópicos". */
export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

/**
 * O que a exclusão de uma disciplina apaga junto, ex.: "10 tópicos e 7 sessões".
 * Devolve null quando não há nada além da disciplina.
 */
export function cascadeSummary(topics: number, sessions: number): string | null {
  const parts = [
    topics > 0 ? pluralize(topics, 'tópico', 'tópicos') : null,
    sessions > 0 ? pluralize(sessions, 'sessão', 'sessões') : null,
  ].filter((part): part is string => part !== null);

  return parts.length > 0 ? parts.join(' e ') : null;
}

// Chaves hierárquicas: invalidar ['subjects'] atualiza lista, detalhe e progresso;
// invalidar ['sessions'] atualiza listas e totais de tempo.
export const queryKeys = {
  subjects: ['subjects'] as const,
  subject: (id: number) => ['subjects', id] as const,
  subjectProgress: (id: number) => ['subjects', id, 'progress'] as const,

  topics: (subjectId: number) => ['topics', subjectId] as const,

  sessions: ['sessions'] as const,
  allSessions: ['sessions', 'all'] as const,
  totalTime: ['sessions', 'total'] as const,
  subjectSessions: (subjectId: number) => ['sessions', 'subject', subjectId] as const,
  subjectTotalTime: (subjectId: number) => ['sessions', 'subject', subjectId, 'total'] as const,
};

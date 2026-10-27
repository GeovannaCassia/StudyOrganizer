export interface Topic {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  subjectId: number;
  /** Só vem na listagem por disciplina. */
  subjectName?: string | null;
}

export interface CreateTopicInput {
  title: string;
  description?: string | null;
  subjectId: number;
}

/** O PATCH de tópico exige o DTO completo (também usado para desmarcar como concluído). */
export interface UpdateTopicInput {
  title: string;
  description: string | null;
  isCompleted: boolean;
}

import type { IsoDate } from './api';

export interface Subject {
  id: number;
  name: string;
  description: string | null;
  createdAt: IsoDate;
}

export interface SubjectInput {
  name: string;
  description?: string | null;
}

export interface SubjectProgress {
  subjectName: string;
  totalTopics: number;
  totalTopicsCompleted: number;
  /** De 0 a 100 (0 quando não há tópicos). */
  progress: number;
}

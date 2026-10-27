import { api } from './api';
import type { Subject, SubjectInput, SubjectProgress } from '@/types/subject';

export const subjectService = {
  async list() {
    const { data } = await api.get<Subject[]>('/Subject');
    return data;
  },

  async get(id: number) {
    const { data } = await api.get<Subject>(`/Subject/${id}`);
    return data;
  },

  async getProgress(id: number) {
    const { data } = await api.get<{ progress: SubjectProgress }>(`/Subject/${id}/progress`);
    return data.progress;
  },

  async create(input: SubjectInput) {
    const { data } = await api.post<Subject>('/Subject', input);
    return data;
  },

  async update(id: number, input: SubjectInput) {
    await api.patch(`/Subject/${id}`, input);
  },

  async remove(id: number) {
    await api.delete(`/Subject/${id}`);
  },
};

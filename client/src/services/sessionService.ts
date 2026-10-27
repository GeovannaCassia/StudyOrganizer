import { api } from './api';
import type { TimeSpan } from '@/types/api';
import type { Session, SessionInput } from '@/types/session';

export const sessionService = {
  async list() {
    const { data } = await api.get<Session[]>('/StudySession');
    return data;
  },

  async listBySubject(subjectId: number) {
    const { data } = await api.get<Session[]>(`/StudySession/subjectId/${subjectId}`);
    return data;
  },

  async totalTime() {
    const { data } = await api.get<TimeSpan>('/StudySession/TotalTime');
    return data;
  },

  async totalTimeBySubject(subjectId: number) {
    const { data } = await api.get<TimeSpan>(`/StudySession/subjectId/TotalTime/${subjectId}`);
    return data;
  },

  async create(input: SessionInput) {
    const { data } = await api.post<Session>('/StudySession', input);
    return data;
  },

  async remove(id: number) {
    await api.delete(`/StudySession/${id}`);
  },
};

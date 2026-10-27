import { api } from './api';
import type { CreateTopicInput, Topic, UpdateTopicInput } from '@/types/topic';

export const topicService = {
  async listBySubject(subjectId: number) {
    const { data } = await api.get<Topic[]>(`/StudyTopics/subjectId/${subjectId}`);
    return data;
  },

  async create(input: CreateTopicInput) {
    const { data } = await api.post<Topic>('/StudyTopics', { ...input, isCompleted: false });
    return data;
  },

  async update(id: number, input: UpdateTopicInput) {
    await api.patch(`/StudyTopics/${id}`, input);
  },

  async markCompleted(id: number) {
    await api.patch(`/StudyTopics/completed/${id}`);
  },

  async remove(id: number) {
    await api.delete(`/StudyTopics/${id}`);
  },
};

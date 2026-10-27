import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { topicService } from '@/services/topicService';
import type { CreateTopicInput, UpdateTopicInput } from '@/types/topic';
import { queryKeys } from './queryKeys';

function invalidateTopics(queryClient: QueryClient, subjectId: number) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.topics(subjectId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.subjectProgress(subjectId) }),
  ]);
}

export function useTopics(subjectId: number) {
  return useQuery({
    queryKey: queryKeys.topics(subjectId),
    queryFn: () => topicService.listBySubject(subjectId),
  });
}

export function useCreateTopic() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTopicInput) => topicService.create(input),
    meta: { skipErrorToast: true },
    onSuccess: (_data, input) => invalidateTopics(queryClient, input.subjectId),
  });
}

export function useUpdateTopic(subjectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateTopicInput }) => topicService.update(id, input),
    meta: { skipErrorToast: true },
    onSuccess: () => invalidateTopics(queryClient, subjectId),
  });
}

export function useDeleteTopic(subjectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => topicService.remove(id),
    onSuccess: () => invalidateTopics(queryClient, subjectId),
  });
}

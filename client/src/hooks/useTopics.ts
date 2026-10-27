import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
import { topicsProgress } from '@/lib/topics';
import { topicService } from '@/services/topicService';
import type { SubjectProgress } from '@/types/subject';
import type { CreateTopicInput, Topic, UpdateTopicInput } from '@/types/topic';
import { queryKeys } from './queryKeys';

function invalidateTopics(queryClient: QueryClient, subjectId: number) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.topics(subjectId) }),
    queryClient.invalidateQueries({ queryKey: queryKeys.subjectProgress(subjectId) }),
  ]);
}

/** Muda o estado de um tópico no cache e ajusta o progresso da disciplina junto. */
function setCompleted(queryClient: QueryClient, subjectId: number, topic: Topic, isCompleted: boolean) {
  let changed = false;
  queryClient.setQueryData<Topic[]>(queryKeys.topics(subjectId), (topics) =>
    topics?.map((item) => {
      if (item.id !== topic.id || item.isCompleted === isCompleted) return item;
      changed = true;
      return { ...item, isCompleted };
    }),
  );
  if (!changed) return;

  queryClient.setQueryData<SubjectProgress>(queryKeys.subjectProgress(subjectId), (progress) => {
    if (!progress) return progress;
    const completed = progress.totalTopicsCompleted + (isCompleted ? 1 : -1);
    return { ...progress, totalTopicsCompleted: completed, progress: topicsProgress(completed, progress.totalTopics) };
  });
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

/**
 * Marca ou desmarca um tópico (T3). A lista e o progresso mudam na hora; se a API falhar,
 * voltam ao que eram e o MutationCache mostra o aviso de erro.
 */
export function useToggleTopic(subjectId: number) {
  const queryClient = useQueryClient();
  const mutationKey = [...queryKeys.topics(subjectId), 'toggle'];

  return useMutation({
    mutationKey,
    // Marcar tem rota própria; desmarcar só pelo PATCH completo
    mutationFn: (topic: Topic) =>
      topic.isCompleted
        ? topicService.update(topic.id, { title: topic.title, description: topic.description, isCompleted: false })
        : topicService.markCompleted(topic.id),
    onMutate: async (topic) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.topics(subjectId) }),
        queryClient.cancelQueries({ queryKey: queryKeys.subjectProgress(subjectId) }),
      ]);
      setCompleted(queryClient, subjectId, topic, !topic.isCompleted);
    },
    // Desfaz só este tópico (um snapshot da lista apagaria outros cliques ainda em andamento)
    onError: (_error, topic) => setCompleted(queryClient, subjectId, topic, topic.isCompleted),
    onSettled: () => {
      // Com cliques seguidos, só busca de novo depois do último (evita a lista "piscar" com dados antigos)
      if (queryClient.isMutating({ mutationKey }) === 1) return invalidateTopics(queryClient, subjectId);
    },
  });
}

export function useDeleteTopic(subjectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => topicService.remove(id),
    onSuccess: () => invalidateTopics(queryClient, subjectId),
  });
}

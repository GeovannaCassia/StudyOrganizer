import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { subjectService } from '@/services/subjectService';
import type { SubjectInput } from '@/types/subject';
import { queryKeys } from './queryKeys';

export function useSubjects() {
  return useQuery({
    queryKey: queryKeys.subjects,
    queryFn: subjectService.list,
    select: (subjects) => [...subjects].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')),
  });
}

export function useSubject(id: number) {
  return useQuery({
    queryKey: queryKeys.subject(id),
    queryFn: () => subjectService.get(id),
  });
}

export function useSubjectProgress(id: number) {
  return useQuery({
    queryKey: queryKeys.subjectProgress(id),
    queryFn: () => subjectService.getProgress(id),
  });
}

/** Progresso de várias disciplinas de uma vez (lista e dashboard), indexado pelo id. */
export function useSubjectsProgress(ids: number[]) {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: queryKeys.subjectProgress(id),
      queryFn: () => subjectService.getProgress(id),
    })),
    combine: (results) => ({
      byId: new Map(ids.map((id, index) => [id, results[index]?.data])),
      isPending: results.some((result) => result.isPending),
      isError: results.some((result) => result.isError),
    }),
  });
}

export function useCreateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SubjectInput) => subjectService.create(input),
    meta: { skipErrorToast: true },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.subjects }),
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: SubjectInput }) => subjectService.update(id, input),
    meta: { skipErrorToast: true },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.subjects }),
  });
}

export function useDeleteSubject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => subjectService.remove(id),
    onSuccess: (_data, id) => {
      // A exclusão apaga em cascata os tópicos e as sessões da disciplina
      queryClient.removeQueries({ queryKey: queryKeys.subject(id) });
      queryClient.removeQueries({ queryKey: queryKeys.topics(id) });
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.subjects }),
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions }),
      ]);
    },
  });
}

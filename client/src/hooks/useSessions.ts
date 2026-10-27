import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { parseTimeSpan } from '@/lib/time';
import { sessionService } from '@/services/sessionService';
import type { SessionInput } from '@/types/session';
import { queryKeys } from './queryKeys';

export function useSessions() {
  return useQuery({
    queryKey: queryKeys.allSessions,
    queryFn: sessionService.list,
  });
}

export function useSubjectSessions(subjectId: number) {
  return useQuery({
    queryKey: queryKeys.subjectSessions(subjectId),
    queryFn: () => sessionService.listBySubject(subjectId),
  });
}

/** Tempo total estudado, em minutos. */
export function useTotalTime() {
  return useQuery({
    queryKey: queryKeys.totalTime,
    queryFn: sessionService.totalTime,
    select: parseTimeSpan,
  });
}

/** Tempo total estudado na disciplina, em minutos. */
export function useSubjectTotalTime(subjectId: number) {
  return useQuery({
    queryKey: queryKeys.subjectTotalTime(subjectId),
    queryFn: () => sessionService.totalTimeBySubject(subjectId),
    select: parseTimeSpan,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SessionInput) => sessionService.create(input),
    meta: { skipErrorToast: true },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.sessions }),
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => sessionService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.sessions }),
  });
}

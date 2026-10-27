import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { ApiError } from '@/services/api';
import { authService } from '@/services/authService';
import type { LoginInput, RegisterInput, User } from '@/types/auth';
import { queryKeys } from './queryKeys';

/** Usuário logado: `null` sem sessão, `undefined` enquanto verifica. */
export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      try {
        return await authService.me();
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) return null;
        throw error;
      }
    },
    staleTime: Infinity,
    retry: false,
  });
}

export function useAuthStatus(enabled = true) {
  return useQuery({
    queryKey: queryKeys.authStatus,
    queryFn: authService.status,
    enabled,
  });
}

/** Descarta os dados do usuário anterior e marca a sessão como encerrada. */
export function useClearSession() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== 'auth' });
    queryClient.setQueryData<User | null>(queryKeys.me, null);
  }, [queryClient]);
}

function useStartSession() {
  const queryClient = useQueryClient();
  return useCallback(
    (user: User) => {
      queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== 'auth' });
      queryClient.setQueryData<User | null>(queryKeys.me, user);
    },
    [queryClient],
  );
}

export function useLogin() {
  const startSession = useStartSession();
  return useMutation({
    mutationFn: (input: LoginInput) => authService.login(input),
    meta: { skipErrorToast: true },
    onSuccess: startSession,
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const startSession = useStartSession();
  return useMutation({
    mutationFn: (input: RegisterInput) => authService.register(input),
    meta: { skipErrorToast: true },
    onSuccess: (user) => {
      startSession(user);
      queryClient.setQueryData(queryKeys.authStatus, { registrationOpen: false });
    },
    // Ex.: o cadastro fechou enquanto a tela estava aberta
    onError: () => queryClient.invalidateQueries({ queryKey: queryKeys.authStatus }),
  });
}

export function useLogout() {
  const clearSession = useClearSession();
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: clearSession,
  });
}

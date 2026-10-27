import { MutationCache, QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { DEFAULT_ERROR_MESSAGE } from '@/services/api';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      /** true quando a tela mostra o erro no próprio formulário (ex.: nome duplicado). */
      skipErrorToast?: boolean;
    };
  }
}

export const queryClient = new QueryClient({
  // Erros de mutation viram aviso; erros de consulta aparecem no ErrorState da tela.
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.skipErrorToast) return;
      toast.error(error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      // Não insiste em 401/404: a resposta não vai mudar
      retry: (failureCount, error) => {
        const status = (error as { status?: number }).status;
        if (status === 401 || status === 404) return false;
        return failureCount < 1;
      },
    },
  },
});

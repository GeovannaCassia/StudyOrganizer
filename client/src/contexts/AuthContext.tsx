import { useEffect, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import { useClearSession } from '@/hooks/useAuth';
import { setUnauthorizedHandler } from '@/services/api';

/**
 * Liga o 401 da API ao estado de sessão: qualquer 401 fora das rotas de Auth (sessão expirada)
 * apaga os dados em cache e marca o usuário como deslogado; a RotaProtegida leva para /login.
 * O usuário em si fica no cache do TanStack Query (useCurrentUser).
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const clearSession = useClearSession();

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
      // id fixo: várias consultas falhando juntas mostram um aviso só
      toast.error('Sua sessão expirou. Faça login novamente.', { id: 'sessao-expirada' });
    });
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  return children;
}

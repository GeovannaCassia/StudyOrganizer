import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ErrorState } from '@/components/shared/ErrorState';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { useAuthStatus, useCurrentUser } from '@/hooks/useAuth';

/** Só mostra as rotas filhas com sessão; sem sessão, leva para /login (ou /cadastro, se ainda não há conta). */
export function RotaProtegida() {
  const location = useLocation();
  const currentUser = useCurrentUser();
  const status = useAuthStatus(currentUser.data === null);

  if (currentUser.isPending) return <LoadingScreen />;

  if (currentUser.isError) {
    return (
      <div className="flex min-h-svh items-center justify-center p-4">
        <ErrorState
          title="Não foi possível conectar ao Study Organizer."
          message={currentUser.error.message}
          onRetry={() => currentUser.refetch()}
          retrying={currentUser.isFetching}
          className="w-full max-w-md"
        />
      </div>
    );
  }

  if (currentUser.data === null) {
    if (status.isPending) return <LoadingScreen />;
    const target = status.data?.registrationOpen ? '/cadastro' : '/login';
    return <Navigate to={target} replace state={{ from: location }} />;
  }

  return <Outlet />;
}

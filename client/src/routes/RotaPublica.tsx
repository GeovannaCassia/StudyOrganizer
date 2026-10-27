import { Navigate, Outlet, useLocation, type Location } from 'react-router-dom';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { useCurrentUser } from '@/hooks/useAuth';

/** Telas de login e cadastro: com sessão ativa, volta para a página que a pessoa tentou abrir. */
export function RotaPublica() {
  const location = useLocation();
  const currentUser = useCurrentUser();

  if (currentUser.isPending) return <LoadingScreen />;

  if (currentUser.data) {
    const from = (location.state as { from?: Location } | null)?.from;
    const target = from ? `${from.pathname}${from.search}${from.hash}` : '/';
    return <Navigate to={target} replace />;
  }

  // Se o /me falhar por outro motivo (API fora do ar), o formulário mostra o erro ao enviar
  return <Outlet />;
}

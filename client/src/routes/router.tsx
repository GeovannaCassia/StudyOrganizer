import { createBrowserRouter } from 'react-router-dom';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { LayoutApp } from '@/layouts/LayoutApp';
import NotFound from '@/pages/NotFound/NotFound';
import { RotaProtegida } from './RotaProtegida';
import { RotaPublica } from './RotaPublica';

// Cada página vira um arquivo separado, baixado só quando é aberta (o gráfico do dashboard, por exemplo,
// não pesa no login). O layout e a página 404 são pequenos e ficam no arquivo principal.
const page = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({ Component: (await load()).default });

export const router = createBrowserRouter([
  {
    element: <RotaPublica />,
    hydrateFallbackElement: <LoadingScreen />,
    children: [
      { path: '/login', lazy: page(() => import('@/pages/Login/Login')) },
      { path: '/cadastro', lazy: page(() => import('@/pages/Register/Register')) },
    ],
  },
  {
    element: <RotaProtegida />,
    hydrateFallbackElement: <LoadingScreen />,
    children: [
      {
        path: '/',
        element: <LayoutApp />,
        children: [
          { index: true, lazy: page(() => import('@/pages/Dashboard/Dashboard')) },
          { path: 'disciplinas', lazy: page(() => import('@/pages/Subjects/Subjects')) },
          { path: 'disciplinas/:id', lazy: page(() => import('@/pages/SubjectDetails/SubjectDetails')) },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
]);

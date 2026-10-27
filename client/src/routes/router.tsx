import { createBrowserRouter } from 'react-router-dom';
import { LayoutApp } from '@/layouts/LayoutApp';
import Dashboard from '@/pages/Dashboard/Dashboard';
import Login from '@/pages/Login/Login';
import NotFound from '@/pages/NotFound/NotFound';
import Register from '@/pages/Register/Register';
import SubjectDetails from '@/pages/SubjectDetails/SubjectDetails';
import Subjects from '@/pages/Subjects/Subjects';
import { RotaProtegida } from './RotaProtegida';
import { RotaPublica } from './RotaPublica';

export const router = createBrowserRouter([
  {
    element: <RotaPublica />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/cadastro', element: <Register /> },
    ],
  },
  {
    element: <RotaProtegida />,
    children: [
      {
        path: '/',
        element: <LayoutApp />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'disciplinas', element: <Subjects /> },
          { path: 'disciplinas/:id', element: <SubjectDetails /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
]);

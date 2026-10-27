import { createBrowserRouter } from 'react-router-dom';
import { LayoutApp } from '@/layouts/LayoutApp';
import Dashboard from '@/pages/Dashboard/Dashboard';
import NotFound from '@/pages/NotFound/NotFound';
import SubjectDetails from '@/pages/SubjectDetails/SubjectDetails';
import Subjects from '@/pages/Subjects/Subjects';

export const router = createBrowserRouter([
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
]);

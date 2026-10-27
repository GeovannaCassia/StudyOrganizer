import { createBrowserRouter } from 'react-router-dom';
import { LayoutApp } from '@/layouts/LayoutApp';
import Dashboard from '@/pages/Dashboard/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutApp />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
]);

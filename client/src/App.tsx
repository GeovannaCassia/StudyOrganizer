import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { queryClient } from '@/lib/queryClient';
import { router } from '@/routes/router';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'text-sm font-medium',
          style: { borderRadius: 'var(--radius)' },
          success: {
            style: { background: 'var(--success)', color: 'var(--success-foreground)', border: '1px solid var(--success-border)' },
            iconTheme: { primary: 'var(--success-foreground)', secondary: 'var(--success)' },
          },
          error: {
            style: { background: 'var(--danger)', color: 'var(--danger-foreground)', border: '1px solid var(--danger-border)' },
            iconTheme: { primary: 'var(--danger-foreground)', secondary: 'var(--danger)' },
          },
        }}
      />
    </QueryClientProvider>
  );
}

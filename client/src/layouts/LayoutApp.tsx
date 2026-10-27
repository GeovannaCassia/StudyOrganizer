import { Outlet } from 'react-router-dom';
import { Logo } from '@/components/brand/Logo';

// Esqueleto provisório: o menu lateral responsivo e o botão de tema chegam na Fase 2 (F3).
export function LayoutApp() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground">
        <Logo />
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

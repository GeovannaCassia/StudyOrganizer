import { Menu } from 'lucide-react';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { SidebarBrand, SidebarNav } from './Sidebar';

export function LayoutApp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      {/* Desktop: menu lateral fixo */}
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col gap-7 bg-sidebar px-4 py-7 text-sidebar-foreground md:flex">
        <SidebarBrand />
        <SidebarNav />
      </aside>

      {/* Celular: barra no topo com o botão que abre o menu */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-sidebar px-4 py-3 text-sidebar-foreground md:hidden">
        <SidebarBrand />
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label="Abrir menu"
          onClick={() => setMenuOpen(true)}
          className="size-11 rounded-xl hover:bg-sidebar-accent"
        >
          <Menu className="size-6" />
        </Button>
      </header>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="flex w-72 flex-col gap-7 bg-sidebar px-4 py-7 text-sidebar-foreground">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <SheetDescription className="sr-only">Navegação principal</SheetDescription>
          <SidebarBrand onNavigate={closeMenu} />
          <SidebarNav onNavigate={closeMenu} />
        </SheetContent>
      </Sheet>

      <main className="min-w-0 flex-1 px-4 py-5 md:px-10 md:py-9">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

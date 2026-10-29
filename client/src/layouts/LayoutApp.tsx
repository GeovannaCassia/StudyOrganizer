import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { SidebarBrand, SidebarNav } from './Sidebar';

export function LayoutApp() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const mainRef = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const lastPathname = useRef(pathname);

  // Ao trocar de página, o foco vai para o conteúdo (quem usa teclado ou leitor de tela não fica preso no menu).
  // Compara com a página anterior em vez de "primeira renderização": no StrictMode o efeito roda duas vezes ao montar.
  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-xl bg-primary font-semibold text-primary-foreground shadow-lg focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:px-4! focus:py-3!"
      >
        Pular para o conteúdo
      </a>

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
          <Menu aria-hidden="true" className="size-6" />
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

      <main id="conteudo" ref={mainRef} tabIndex={-1} className="min-w-0 flex-1 px-4 py-5 outline-none md:px-10 md:py-9">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

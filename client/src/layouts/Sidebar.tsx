import { BookOpen, LayoutDashboard, LogOut, Moon, Sun, type LucideIcon } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { AppIcon } from '@/components/brand/Logo';
import { useCurrentUser, useLogout } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';

const NAV_ITEMS: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/disciplinas', label: 'Disciplinas', icon: BookOpen },
];

const itemClass =
  'flex min-h-11 items-center gap-3 rounded-xl px-3.5 text-[15px] font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground';

export function SidebarBrand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      aria-label="Study Organizer, ir para o Dashboard"
      className="flex items-center gap-2.5 rounded-xl px-2 text-sidebar-foreground"
    >
      <AppIcon className="size-10 rounded-xl" />
      <span aria-hidden="true" className="flex flex-col leading-tight">
        <span className="text-[17px] font-bold">Study</span>
        <span className="text-[15px] font-medium">Organizer</span>
      </span>
    </Link>
  );
}

/** Itens do menu e botão de tema; usado no menu fixo (desktop) e na gaveta (celular). */
export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { theme, toggleTheme } = useTheme();
  const ThemeIcon = theme === 'escuro' ? Sun : Moon;

  return (
    <nav aria-label="Principal" className="flex flex-1 flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(itemClass, isActive && 'bg-sidebar-accent font-semibold text-sidebar-accent-foreground')
          }
        >
          <Icon aria-hidden="true" className="size-5" />
          {label}
        </NavLink>
      ))}

      <span className="min-h-4 flex-1" />

      <button type="button" onClick={toggleTheme} className={cn(itemClass, 'text-left')}>
        <ThemeIcon aria-hidden="true" className="size-5" />
        {theme === 'escuro' ? 'Tema claro' : 'Tema escuro'}
      </button>

      <SidebarUser />
    </nav>
  );
}

/** Rodapé do menu: pessoa logada e botão Sair. */
function SidebarUser() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();

  if (!user) return null;

  return (
    <div className="mt-2 flex items-center gap-2 border-t border-sidebar-border pt-4">
      <div className="flex min-w-0 flex-1 flex-col px-1.5">
        <span className="truncate text-sm font-semibold">{user.name}</span>
        <span className="truncate text-xs opacity-80">{user.email}</span>
      </div>
      <button
        type="button"
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-60"
      >
        <LogOut aria-hidden="true" className="size-4.5" />
        {logout.isPending ? 'Saindo...' : 'Sair'}
      </button>
    </div>
  );
}

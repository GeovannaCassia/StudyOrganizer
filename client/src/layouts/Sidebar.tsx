import { BookOpen, LayoutDashboard, Moon, Sun, type LucideIcon } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { AppIcon } from '@/components/brand/Logo';
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
    </nav>
  );
}

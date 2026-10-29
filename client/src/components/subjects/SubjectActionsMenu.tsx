import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface SubjectActionsMenuProps {
  subjectName: string;
  onEdit?: () => void;
  onDelete: () => void;
  className?: string;
}

/** Menu ⋮ de uma disciplina (Editar / Excluir). */
export function SubjectActionsMenu({ subjectName, onEdit, onDelete, className }: SubjectActionsMenuProps) {
  return (
    // modal={false}: o menu não esconde o resto da página do leitor de tela (o foco continua preso no menu enquanto aberto)
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-lg"
          aria-label={`Ações da disciplina ${subjectName}`}
          className={cn('size-10 shrink-0 rounded-xl text-muted-foreground', className)}
        >
          <MoreVertical aria-hidden="true" className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40 rounded-xl p-1.5">
        {onEdit && (
          <DropdownMenuItem onSelect={onEdit} className="min-h-10 gap-2.5 rounded-lg px-3 text-sm font-medium">
            <Pencil aria-hidden="true" />
            Editar
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onSelect={onDelete}
          className="min-h-10 gap-2.5 rounded-lg px-3 text-sm font-medium text-danger-text focus:bg-danger focus:text-danger-foreground [&_svg]:text-current"
        >
          <Trash2 aria-hidden="true" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

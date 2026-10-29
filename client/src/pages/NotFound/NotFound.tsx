import { SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

interface NotFoundProps {
  title?: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
}

export default function NotFound({
  title = 'Página não encontrada',
  description = 'O endereço que você abriu não existe ou foi removido.',
  backTo = '/',
  backLabel = 'Voltar ao Dashboard',
}: NotFoundProps) {
  useDocumentTitle(title);
  return (
    <EmptyState
      icon={SearchX}
      headingLevel={1}
      title={title}
      description={description}
      action={
        <Button asChild size="lg" className="min-h-11 rounded-xl px-5 font-semibold">
          <Link to={backTo}>{backLabel}</Link>
        </Button>
      }
    />
  );
}

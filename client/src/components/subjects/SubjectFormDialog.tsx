import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FormAlert } from '@/components/shared/FormAlert';
import { FormField } from '@/components/shared/FormField';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateSubject, useUpdateSubject } from '@/hooks/useSubjects';
import { fieldA11y } from '@/lib/form';
import { subjectSchema, toSubjectInput, type SubjectForm } from '@/schemas/subjectSchema';
import type { Subject } from '@/types/subject';

const DESCRIPTION_MAX = 200;

interface SubjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Disciplina a editar; sem ela, o formulário cria uma nova. */
  subject?: Subject | null;
}

/** Janela de criar/editar disciplina (D2/D3). */
export function SubjectFormDialog({ open, onOpenChange, subject }: SubjectFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 rounded-2xl p-6 sm:max-w-[480px]">
        {/* O conteúdo desmonta ao fechar: o formulário recomeça limpo a cada abertura */}
        <SubjectFormContent subject={subject ?? null} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function SubjectFormContent({ subject, onDone }: { subject: Subject | null; onDone: () => void }) {
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const isEdit = subject !== null;
  const pending = createSubject.isPending || updateSubject.isPending;

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<SubjectForm>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { name: subject?.name ?? '', description: subject?.description ?? '' },
  });

  const descriptionLength = useWatch({ control, name: 'description' })?.length ?? 0;

  const onSubmit = handleSubmit((form) => {
    const input = toSubjectInput(form);
    // Erros da API (ex.: nome duplicado) ficam na própria janela, que continua aberta
    const onError = (error: Error) => setError('root', { message: error.message });

    if (isEdit) {
      updateSubject.mutate(
        { id: subject.id, input },
        {
          onSuccess: () => {
            toast.success('Disciplina atualizada');
            onDone();
          },
          onError,
        },
      );
    } else {
      createSubject.mutate(input, {
        onSuccess: () => {
          toast.success('Disciplina criada');
          onDone();
        },
        onError,
      });
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">{isEdit ? 'Editar disciplina' : 'Nova disciplina'}</DialogTitle>
        <DialogDescription className="sr-only">
          {isEdit ? 'Altere o nome ou a descrição da disciplina.' : 'Informe o nome e, se quiser, uma descrição.'}
        </DialogDescription>
      </DialogHeader>

      <FormAlert message={errors.root?.message} />

      <FormField id="disciplina-nome" label="Nome" error={errors.name?.message}>
        <Input
          {...fieldA11y('disciplina-nome', errors.name?.message)}
          placeholder="Ex.: Cálculo II"
          maxLength={80}
          autoFocus
          className="h-11"
          {...register('name')}
        />
      </FormField>

      <FormField id="disciplina-descricao" label="Descrição (opcional)" error={errors.description?.message}>
        <Textarea
          {...fieldA11y('disciplina-descricao', errors.description?.message)}
          placeholder="Ex.: professora, semestre, ementa…"
          rows={3}
          maxLength={DESCRIPTION_MAX}
          className="resize-y"
          {...register('description')}
        />
        <span aria-hidden="true" className="self-end text-xs text-muted-foreground tabular-nums">
          {descriptionLength}/{DESCRIPTION_MAX}
        </span>
      </FormField>

      <DialogFooter className="-mx-6 -mb-6 rounded-b-2xl px-6 py-4">
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={pending} className="h-11 rounded-xl px-4 text-[15px] font-semibold">
            Cancelar
          </Button>
        </DialogClose>
        <Button type="submit" variant="success" disabled={pending} className="h-11 rounded-xl px-5 text-[15px] font-semibold">
          <Check aria-hidden="true" />
          {pending ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogFooter>
    </form>
  );
}

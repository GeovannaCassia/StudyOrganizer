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
import { useCreateTopic, useUpdateTopic } from '@/hooks/useTopics';
import { fieldA11y } from '@/lib/form';
import { TOPIC_DESCRIPTION_MAX, TOPIC_TITLE_MAX, toTopicFields, topicSchema, type TopicForm } from '@/schemas/topicSchema';
import type { Topic } from '@/types/topic';

interface TopicFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: number;
  /** Tópico a editar; sem ele, o formulário cria um novo. */
  topic?: Topic | null;
}

/** Janela de criar/editar tópico (T2). */
export function TopicFormDialog({ open, onOpenChange, subjectId, topic }: TopicFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 rounded-2xl p-6 sm:max-w-[480px]">
        {/* O conteúdo desmonta ao fechar: o formulário recomeça limpo a cada abertura */}
        <TopicFormContent subjectId={subjectId} topic={topic ?? null} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function TopicFormContent({ subjectId, topic, onDone }: { subjectId: number; topic: Topic | null; onDone: () => void }) {
  const createTopic = useCreateTopic();
  const updateTopic = useUpdateTopic(subjectId);
  const isEdit = topic !== null;
  const pending = createTopic.isPending || updateTopic.isPending;

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<TopicForm>({
    resolver: zodResolver(topicSchema),
    defaultValues: { title: topic?.title ?? '', description: topic?.description ?? '' },
  });

  const descriptionLength = useWatch({ control, name: 'description' })?.length ?? 0;

  const onSubmit = handleSubmit((form) => {
    const fields = toTopicFields(form);
    const onError = (error: Error) => setError('root', { message: error.message });

    if (isEdit) {
      // Mantém o estado "concluído" que o tópico já tinha
      updateTopic.mutate(
        { id: topic.id, input: { ...fields, isCompleted: topic.isCompleted } },
        {
          onSuccess: () => {
            toast.success('Tópico atualizado');
            onDone();
          },
          onError,
        },
      );
    } else {
      createTopic.mutate(
        { ...fields, subjectId },
        {
          onSuccess: () => {
            toast.success('Tópico criado');
            onDone();
          },
          onError,
        },
      );
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">{isEdit ? 'Editar tópico' : 'Novo tópico'}</DialogTitle>
        <DialogDescription className="sr-only">
          {isEdit ? 'Altere o título ou a descrição do tópico.' : 'Informe o título e, se quiser, uma descrição.'}
        </DialogDescription>
      </DialogHeader>

      <FormAlert message={errors.root?.message} />

      <FormField id="topico-titulo" label="Título" error={errors.title?.message}>
        <Input
          {...fieldA11y('topico-titulo', errors.title?.message)}
          placeholder="Ex.: Limites e continuidade"
          maxLength={TOPIC_TITLE_MAX}
          autoFocus
          className="h-11"
          {...register('title')}
        />
      </FormField>

      <FormField id="topico-descricao" label="Descrição (opcional)" error={errors.description?.message}>
        <Textarea
          {...fieldA11y('topico-descricao', errors.description?.message)}
          placeholder="Ex.: capítulo do livro, lista de exercícios…"
          rows={3}
          maxLength={TOPIC_DESCRIPTION_MAX}
          className="resize-y"
          {...register('description')}
        />
        <span aria-hidden="true" className="self-end text-xs text-muted-foreground tabular-nums">
          {descriptionLength}/{TOPIC_DESCRIPTION_MAX}
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
          {pending ? 'Salvando…' : 'Salvar'}
        </Button>
      </DialogFooter>
    </form>
  );
}

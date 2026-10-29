import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Check, Clock } from 'lucide-react';
import { useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { DateInput } from '@/components/shared/DateInput';
import { FormAlert } from '@/components/shared/FormAlert';
import { FormField } from '@/components/shared/FormField';
import { TimeInput } from '@/components/shared/TimeInput';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateSession, useSubjectSessions } from '@/hooks/useSessions';
import { fieldA11y } from '@/lib/form';
import { buildSessionRange, findOverlap, MAX_SESSION_MINUTES } from '@/lib/sessions';
import { formatDayMonth, formatDuration, formatTime, toDateInputValue } from '@/lib/time';
import { createSessionSchema, toSessionInput, type SessionForm } from '@/schemas/sessionSchema';

interface SessionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: number;
}

/** Janela de registrar sessão (S2). */
export function SessionFormDialog({ open, onOpenChange, subjectId }: SessionFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 rounded-2xl p-6 sm:max-w-[480px]">
        {/* O conteúdo desmonta ao fechar: o formulário recomeça limpo (e com a data de hoje) a cada abertura */}
        <SessionFormContent subjectId={subjectId} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}

function SessionFormContent({ subjectId, onDone }: { subjectId: number; onDone: () => void }) {
  const createSession = useCreateSession();
  const sessions = useSubjectSessions(subjectId);
  const schema = useMemo(() => createSessionSchema(), []);

  const {
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<SessionForm>({
    resolver: zodResolver(schema),
    defaultValues: { date: toDateInputValue(), startTime: '', endTime: '' },
  });

  const [date, startTime, endTime] = useWatch({ control, name: ['date', 'startTime', 'endTime'] });
  const range = startTime !== endTime ? buildSessionRange(date, startTime, endTime) : null;
  const rangeOk = range !== null && range.minutes <= MAX_SESSION_MINUTES;
  const overlap = rangeOk && sessions.data ? findOverlap(range, sessions.data) : null;

  const onSubmit = handleSubmit((form) => {
    createSession.mutate(toSessionInput(form, subjectId), {
      onSuccess: () => {
        toast.success('Sessão registrada');
        onDone();
      },
      onError: (error) => setError('root', { message: error.message }),
    });
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Registrar sessão</DialogTitle>
        <DialogDescription className="sr-only">Informe a data e os horários de início e fim do estudo.</DialogDescription>
      </DialogHeader>

      <FormAlert message={errors.root?.message} />

      <FormField id="sessao-data" label="Data" error={errors.date?.message}>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DateInput {...fieldA11y('sessao-data', errors.date?.message)} {...field} max={new Date()} />
          )}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField id="sessao-inicio" label="Início" error={errors.startTime?.message}>
          <Controller
            control={control}
            name="startTime"
            render={({ field }) => (
              <TimeInput {...fieldA11y('sessao-inicio', errors.startTime?.message)} {...field} autoFocus />
            )}
          />
        </FormField>
        <FormField id="sessao-fim" label="Fim" error={errors.endTime?.message}>
          <Controller
            control={control}
            name="endTime"
            render={({ field }) => <TimeInput {...fieldA11y('sessao-fim', errors.endTime?.message)} {...field} />}
          />
        </FormField>
      </div>

      {/* Duração calculada na hora; aria-live para o leitor de tela anunciar a mudança */}
      <p aria-live="polite" className="flex min-h-11 items-center gap-2 rounded-xl bg-muted px-4 text-[15px]">
        <Clock aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
        {rangeOk ? (
          <span>
            Duração: <strong className="font-semibold">{formatDuration(range.minutes)}</strong>
            {range.crossesMidnight && (
              <span className="text-muted-foreground"> · termina em {formatDayMonth(range.end.toISOString())}</span>
            )}
          </span>
        ) : (
          <span className="text-muted-foreground">Preencha o início e o fim para ver a duração.</span>
        )}
      </p>

      {overlap && range && (
        <p
          role="status"
          className="flex items-start gap-2.5 rounded-xl border border-warning-border bg-warning px-4 py-3 text-sm leading-relaxed text-warning-foreground"
        >
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <span>
            Essa sessão coincide com outra registrada das {formatTime(overlap.startTime)} às {formatTime(overlap.endTime)}
            {formatDayMonth(overlap.startTime) !== formatDayMonth(range.start.toISOString()) &&
              ` (${formatDayMonth(overlap.startTime)})`}
            . Você ainda pode salvar.
          </span>
        </p>
      )}

      <DialogFooter className="-mx-6 -mb-6 rounded-b-2xl px-6 py-4">
        <DialogClose asChild>
          <Button
            type="button"
            variant="outline"
            disabled={createSession.isPending}
            className="h-11 rounded-xl px-4 text-[15px] font-semibold"
          >
            Cancelar
          </Button>
        </DialogClose>
        <Button
          type="submit"
          variant="success"
          disabled={createSession.isPending}
          className="h-11 rounded-xl px-5 text-[15px] font-semibold"
        >
          <Check aria-hidden="true" />
          {createSession.isPending ? 'Salvando…' : 'Salvar'}
        </Button>
      </DialogFooter>
    </form>
  );
}

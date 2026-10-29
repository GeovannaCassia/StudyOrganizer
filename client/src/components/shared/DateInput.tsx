import { CalendarDays } from 'lucide-react';
import { useState, type ComponentProps } from 'react';
import { ptBR } from 'react-day-picker/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { maskDate } from '@/lib/mask';
import { parseDateInput, toDateInputValue } from '@/lib/time';

type DateInputProps = Omit<ComponentProps<typeof Input>, 'type' | 'value' | 'onChange' | 'max'> & {
  /** Data no formato "dd/MM/yyyy". */
  value: string;
  onChange: (value: string) => void;
  /** Último dia que pode ser escolhido no calendário. */
  max?: Date;
};

/**
 * Data no formato brasileiro ("27/10/2026"): digitada com máscara ou escolhida no calendário.
 * Substitui o `<input type="date">`, que segue o idioma do navegador (podendo mostrar mm/dd/aaaa).
 */
export function DateInput({ value, onChange, max, id, ...props }: DateInputProps) {
  const [open, setOpen] = useState(false);
  const selected = parseDateInput(value) ?? undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className="relative">
          <Input
            {...props}
            id={id}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="dd/mm/aaaa"
            maxLength={10}
            value={value}
            onChange={(event) => onChange(maskDate(event.target.value))}
            className="h-11 pr-12 tabular-nums"
          />
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-lg"
              aria-label="Escolher a data no calendário"
              className="absolute top-1/2 right-1 -translate-y-1/2 rounded-lg text-muted-foreground"
            >
              <CalendarDays aria-hidden="true" className="size-5" />
            </Button>
          </PopoverTrigger>
        </div>
      </PopoverAnchor>
      <PopoverContent align="start" aria-label="Calendário" className="w-auto rounded-xl p-1">
        <Calendar
          mode="single"
          locale={ptBR}
          selected={selected}
          defaultMonth={selected ?? max}
          disabled={max ? { after: max } : undefined}
          onSelect={(date) => {
            if (!date) return;
            onChange(toDateInputValue(date));
            setOpen(false);
          }}
          className="[--cell-size:--spacing(9)]"
        />
      </PopoverContent>
    </Popover>
  );
}

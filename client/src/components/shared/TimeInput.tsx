import type { ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { maskTime } from '@/lib/mask';

type TimeInputProps = Omit<ComponentProps<typeof Input>, 'type' | 'value' | 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
};

/**
 * Hora no formato 24h ("14:30"), digitada com máscara.
 * Substitui o `<input type="time">`, que segue o idioma do navegador e pode mostrar AM/PM.
 */
export function TimeInput({ value, onChange, ...props }: TimeInputProps) {
  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder="hh:mm"
      maxLength={5}
      value={value}
      onChange={(event) => onChange(maskTime(event.target.value))}
      className="h-11 tabular-nums"
    />
  );
}

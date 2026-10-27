/** Props de acessibilidade do campo: liga o erro (ou a dica) do FormField ao input. */
export function fieldA11y(id: string, error?: string, hint?: string) {
  return {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-erro` : hint ? `${id}-dica` : undefined,
  };
}

import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('junta classes, ignora valores falsos e resolve conflitos do Tailwind', () => {
    const oculto = false;
    expect(cn('px-2 text-sm', oculto && 'hidden', 'px-4')).toBe('text-sm px-4');
  });
});

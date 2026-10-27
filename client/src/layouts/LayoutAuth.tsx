import type { ReactNode } from 'react';
import { Logo } from '@/components/brand/Logo';

interface LayoutAuthProps {
  title: string;
  description: string;
  children: ReactNode;
}

/** Cartão centralizado das telas públicas (login e cadastro), sem menu lateral. */
export function LayoutAuth({ title, description, children }: LayoutAuthProps) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4 py-10">
      <div className="flex w-full max-w-[420px] flex-col gap-6 rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center gap-5 text-center">
          <Logo className="px-4 py-2.5" />
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-[15px] text-muted-foreground">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}

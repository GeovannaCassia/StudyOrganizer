import { useCallback, useState } from 'react';

export type Theme = 'claro' | 'escuro';

// Mesma chave lida pelo script do index.html, que aplica o tema antes de pintar a página
const STORAGE_KEY = 'so-tema';

function currentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'escuro' : 'claro';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(currentTheme);

  const toggleTheme = useCallback(() => {
    const next: Theme = currentTheme() === 'escuro' ? 'claro' : 'escuro';
    document.documentElement.classList.toggle('dark', next === 'escuro');
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Sem acesso ao localStorage (modo privado): o tema vale só para esta visita
    }
    setTheme(next);
  }, []);

  return { theme, toggleTheme };
}

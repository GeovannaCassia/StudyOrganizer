import { useEffect } from 'react';

const APP_NAME = 'Study Organizer';

/** Título da aba do navegador ("Disciplinas · Study Organizer"); o leitor de tela anuncia a troca de página por ele. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${APP_NAME}` : APP_NAME;
  }, [title]);
}

import { useEffect, useState } from 'react';

/** Contagem regressiva em segundos (ex.: bloqueio depois do limite de tentativas). */
export function useCooldown() {
  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  return { secondsLeft, active: secondsLeft > 0, start: setSecondsLeft };
}

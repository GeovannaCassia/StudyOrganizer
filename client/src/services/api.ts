import axios, { type AxiosError } from 'axios';

/** Erro normalizado da API: a mensagem já está pronta para mostrar na tela. */
export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const DEFAULT_ERROR_MESSAGE = 'Não foi possível concluir a ação. Tente novamente.';
const NETWORK_ERROR_MESSAGE = 'Sem conexão com o servidor. Verifique sua internet e tente novamente.';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Quem trata o 401 é o AuthContext (Fase 3); aqui só fica o gancho.
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

function messageFrom(error: AxiosError<unknown>): string {
  if (!error.response) return NETWORK_ERROR_MESSAGE;

  // A API responde { message }; erros de formato do ASP.NET vêm como ProblemDetails, sem message.
  const data = error.response.data as { message?: unknown } | undefined;
  if (data && typeof data.message === 'string' && data.message.trim()) return data.message;

  if (error.response.status === 404) return 'Item não encontrado.';
  return DEFAULT_ERROR_MESSAGE;
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<unknown>) => {
    const status = error.response?.status;

    // Rotas de Auth tratam o próprio 401 (login inválido, verificação inicial do /me).
    const isAuthRoute = /^\/?Auth\//i.test(error.config?.url ?? '');
    if (status === 401 && !isAuthRoute) onUnauthorized?.();

    return Promise.reject(new ApiError(messageFrom(error), status));
  },
);

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiError && error.status === 404;
}

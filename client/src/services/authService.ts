import { api } from './api';
import type { AuthStatus, LoginInput, RegisterInput, User } from '@/types/auth';

// O token vem num cookie HttpOnly: o JavaScript nunca o lê, só recebe os dados do usuário.
export const authService = {
  async status() {
    const { data } = await api.get<AuthStatus>('/Auth/status');
    return data;
  },

  async me() {
    const { data } = await api.get<User>('/Auth/me');
    return data;
  },

  async login(input: LoginInput) {
    const { data } = await api.post<User>('/Auth/login', input);
    return data;
  },

  async register(input: RegisterInput) {
    const { data } = await api.post<User>('/Auth/register', input);
    return data;
  },

  async logout() {
    await api.post('/Auth/logout');
  },
};

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthStatus {
  /** true enquanto não existe nenhuma conta. */
  registrationOpen: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

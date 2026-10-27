import { z } from 'zod';

// Mesmas regras do AuthService do backend.

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'Informe o e-mail.')
  .max(254, 'O e-mail pode ter no máximo 254 caracteres.')
  .pipe(z.email('Informe um e-mail válido.'));

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe a senha.'),
  rememberMe: z.boolean(),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Informe seu nome.')
      .max(80, 'O nome pode ter no máximo 80 caracteres.'),
    email,
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres.')
      .max(128, 'A senha pode ter no máximo 128 caracteres.')
      .regex(/\p{L}/u, 'A senha deve ter letras e números.')
      .regex(/\p{Nd}/u, 'A senha deve ter letras e números.'),
    confirmPassword: z.string().min(1, 'Confirme a senha.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não são iguais.',
    path: ['confirmPassword'],
  });

export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;

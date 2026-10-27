import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from './authSchema';

const validRegister = {
  name: 'Geovanna',
  email: 'voce@exemplo.com',
  password: 'senhaforte1',
  confirmPassword: 'senhaforte1',
};

function firstError(result: { success: boolean; error?: { issues: { message: string }[] } }) {
  return result.error?.issues[0]?.message;
}

describe('registerSchema', () => {
  it('aceita um cadastro válido e normaliza nome e e-mail', () => {
    const result = registerSchema.safeParse({ ...validRegister, name: '  Geovanna  ', email: ' Voce@Exemplo.COM ' });
    expect(result.success).toBe(true);
    expect(result.data?.name).toBe('Geovanna');
    expect(result.data?.email).toBe('voce@exemplo.com');
  });

  it('exige o nome e limita a 80 caracteres', () => {
    expect(firstError(registerSchema.safeParse({ ...validRegister, name: '   ' }))).toBe('Informe seu nome.');
    expect(firstError(registerSchema.safeParse({ ...validRegister, name: 'a'.repeat(81) }))).toBe(
      'O nome pode ter no máximo 80 caracteres.',
    );
  });

  it('rejeita e-mail inválido', () => {
    expect(firstError(registerSchema.safeParse({ ...validRegister, email: 'voce@' }))).toBe('Informe um e-mail válido.');
  });

  it.each([
    ['curta1', 'A senha deve ter pelo menos 8 caracteres.'],
    ['somenteletras', 'A senha deve ter letras e números.'],
    ['12345678', 'A senha deve ter letras e números.'],
    [`a1${'x'.repeat(127)}`, 'A senha pode ter no máximo 128 caracteres.'],
  ])('rejeita a senha "%s"', (password, message) => {
    expect(firstError(registerSchema.safeParse({ ...validRegister, password, confirmPassword: password }))).toBe(message);
  });

  it('aceita letras acentuadas na senha, como o backend', () => {
    expect(registerSchema.safeParse({ ...validRegister, password: 'ção12345', confirmPassword: 'ção12345' }).success).toBe(
      true,
    );
  });

  it('exige a confirmação igual à senha', () => {
    const result = registerSchema.safeParse({ ...validRegister, confirmPassword: 'outrasenha1' });
    expect(result.error?.issues[0]?.path).toEqual(['confirmPassword']);
    expect(firstError(result)).toBe('As senhas não são iguais.');
  });
});

describe('loginSchema', () => {
  it('exige e-mail e senha', () => {
    const result = loginSchema.safeParse({ email: '', password: '', rememberMe: false });
    expect(result.error?.issues.map((issue) => issue.message)).toEqual(['Informe o e-mail.', 'Informe a senha.']);
  });

  it('não aplica as regras de cadastro na senha do login', () => {
    expect(loginSchema.safeParse({ email: 'voce@exemplo.com', password: 'x', rememberMe: true }).success).toBe(true);
  });
});

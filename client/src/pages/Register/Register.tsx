import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import { FormAlert } from '@/components/shared/FormAlert';
import { FormField } from '@/components/shared/FormField';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { PasswordInput } from '@/components/shared/PasswordInput';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStatus, useRegister } from '@/hooks/useAuth';
import { LayoutAuth } from '@/layouts/LayoutAuth';
import { fieldA11y } from '@/lib/form';
import { registerSchema, type RegisterForm } from '@/schemas/authSchema';

const PASSWORD_HINT = 'Mínimo de 8 caracteres, com letras e números.';

export default function Register() {
  const status = useAuthStatus();
  const registerAccount = useRegister();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  if (status.isPending) return <LoadingScreen />;
  // O cadastro só existe enquanto não há conta
  if (status.data && !status.data.registrationOpen) return <Navigate to="/login" replace />;

  // Em caso de sucesso, a conta já entra logada e a RotaPublica leva ao Dashboard
  const onSubmit = handleSubmit(({ name, email, password }) =>
    registerAccount.mutate(
      { name, email, password },
      { onError: (error) => setError('root', { message: error.message }) },
    ),
  );

  return (
    <LayoutAuth title="Criar conta" description="Esta será a única conta do seu Study Organizer.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormAlert message={errors.root?.message} />

        <FormField id="nome" label="Nome" error={errors.name?.message}>
          <Input
            {...fieldA11y('nome', errors.name?.message)}
            autoComplete="name"
            autoFocus
            maxLength={80}
            className="h-11"
            {...register('name')}
          />
        </FormField>

        <FormField id="email" label="E-mail" error={errors.email?.message}>
          <Input
            {...fieldA11y('email', errors.email?.message)}
            type="email"
            autoComplete="email"
            className="h-11"
            {...register('email')}
          />
        </FormField>

        <FormField id="senha" label="Senha" error={errors.password?.message} hint={PASSWORD_HINT}>
          <PasswordInput
            {...fieldA11y('senha', errors.password?.message, PASSWORD_HINT)}
            autoComplete="new-password"
            className="h-11"
            {...register('password')}
          />
        </FormField>

        <FormField id="confirmar-senha" label="Confirmar senha" error={errors.confirmPassword?.message}>
          <PasswordInput
            {...fieldA11y('confirmar-senha', errors.confirmPassword?.message)}
            autoComplete="new-password"
            className="h-11"
            {...register('confirmPassword')}
          />
        </FormField>

        <Button
          type="submit"
          size="lg"
          disabled={registerAccount.isPending}
          className="mt-1 h-11 rounded-xl text-[15px] font-semibold"
        >
          {registerAccount.isPending ? 'Criando conta…' : 'Criar conta'}
        </Button>
      </form>
    </LayoutAuth>
  );
}

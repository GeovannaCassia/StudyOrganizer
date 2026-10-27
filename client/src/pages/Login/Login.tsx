import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FormAlert } from '@/components/shared/FormAlert';
import { FormField } from '@/components/shared/FormField';
import { PasswordInput } from '@/components/shared/PasswordInput';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStatus, useLogin } from '@/hooks/useAuth';
import { useCooldown } from '@/hooks/useCooldown';
import { LayoutAuth } from '@/layouts/LayoutAuth';
import { fieldA11y } from '@/lib/form';
import { loginSchema, type LoginForm } from '@/schemas/authSchema';
import { ApiError } from '@/services/api';

const TOO_MANY_ATTEMPTS = 'Muitas tentativas. Aguarde um minuto e tente novamente.';

export default function Login() {
  const status = useAuthStatus();
  const login = useLogin();
  const cooldown = useCooldown();

  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  // Fim da espera: o aviso de limite de tentativas deixa de valer
  const rootError = errors.root?.message;
  useEffect(() => {
    if (!cooldown.active && rootError === TOO_MANY_ATTEMPTS) clearErrors('root');
  }, [cooldown.active, rootError, clearErrors]);

  // Em caso de sucesso, a RotaPublica redireciona para a página de origem (ou o Dashboard)
  const onSubmit = handleSubmit((values) =>
    login.mutate(values, {
      onError: (error) => {
        if (error instanceof ApiError && error.status === 429) {
          cooldown.start(60);
          setError('root', { message: TOO_MANY_ATTEMPTS });
          return;
        }
        setError('root', { message: error.message });
      },
    }),
  );

  const busy = login.isPending || cooldown.active;

  return (
    <LayoutAuth title="Entrar" description="Acesse seus estudos.">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <FormAlert message={rootError} />

        <FormField id="email" label="E-mail" error={errors.email?.message}>
          <Input
            {...fieldA11y('email', errors.email?.message)}
            type="email"
            autoComplete="email"
            autoFocus
            className="h-11"
            {...register('email')}
          />
        </FormField>

        <FormField id="senha" label="Senha" error={errors.password?.message}>
          <PasswordInput
            {...fieldA11y('senha', errors.password?.message)}
            autoComplete="current-password"
            className="h-11"
            {...register('password')}
          />
        </FormField>

        <Controller
          control={control}
          name="rememberMe"
          render={({ field }) => (
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="lembrar"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                onBlur={field.onBlur}
                aria-describedby="lembrar-dica"
              />
              <Label htmlFor="lembrar" className="text-sm font-medium">
                Lembrar de mim
              </Label>
              <span id="lembrar-dica" className="sr-only">
                Mantém a sessão por 30 dias neste navegador.
              </span>
            </div>
          )}
        />

        <Button type="submit" size="lg" disabled={busy} className="mt-1 h-11 rounded-xl text-[15px] font-semibold">
          {login.isPending ? 'Entrando...' : cooldown.active ? `Aguarde ${cooldown.secondsLeft}s` : 'Entrar'}
        </Button>
      </form>

      {status.data?.registrationOpen && (
        <p className="text-center text-sm text-muted-foreground">
          Primeiro acesso?{' '}
          <Link
            to="/cadastro"
            className="font-semibold text-lavender-700 underline-offset-4 hover:underline dark:text-lavender-300"
          >
            Criar conta
          </Link>
        </p>
      )}
    </LayoutAuth>
  );
}

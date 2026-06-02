import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/auth.context';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Container,
  Card,
  Logo,
  Title,
  Subtitle,
  Form,
  InputGroup,
  Label,
  Input,
  Button,
  ErrorMessage,
  ErrorAlert,
} from './styles';

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

type LoginData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      setLoading(true);
      setError('');
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch {
      setError('E-mail ou senha inválidos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Logo>⛪</Logo>
        <Title>IgrejaGestTec</Title>
        <Subtitle>Gestão financeira e espiritual para igrejas</Subtitle>

        {error && <ErrorAlert>{error}</ErrorAlert>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label>E-mail</Label>
            <Input
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
              $hasError={!!errors.email}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>Senha</Label>
            <Input
              type="password"
              placeholder="••••••"
              {...register('password')}
              $hasError={!!errors.password}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </InputGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

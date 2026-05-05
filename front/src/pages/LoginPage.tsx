import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const { login, loading, error } = useAuth();
  const isLoading = useAuthRedirect(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: 'Email é obrigatório' });
      return;
    }
    if (!password) {
      setErrors({ password: 'Senha é obrigatória' });
      return;
    }

    try {
      await login({ email, password });
    } catch (err) {
      // Erro já está no state
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-600 mb-2">🏥</h1>
          <h2 className="text-2xl font-bold text-gray-800">NutriClínica</h2>
          <p className="text-gray-600 mt-2">Sua clínica de nutrição online</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            isLoading={loading}
            className="w-full"
            variant="primary"
          >
            Entrar
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600">
            Não tem conta?{' '}
            <a href="/register" className="text-green-600 hover:underline font-medium">
              Registre-se aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

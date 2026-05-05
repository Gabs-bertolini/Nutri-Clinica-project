import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

export function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'PATIENT' | 'NUTRITIONIST'>('PATIENT');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});
  const { register, loading, error } = useAuth();
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

    if (!name) {
      setErrors({ name: 'Nome é obrigatório' });
      return;
    }
    if (!email) {
      setErrors({ email: 'Email é obrigatório' });
      return;
    }
    if (!password || password.length < 6) {
      setErrors({ password: 'Senha deve ter no mínimo 6 caracteres' });
      return;
    }

    try {
      await register({ name, email, password, role });
      navigate('/dashboard');
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
          <p className="text-gray-600 mt-2">Crie sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Conta
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'PATIENT' | 'NUTRITIONIST')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="PATIENT">Paciente</option>
              <option value="NUTRITIONIST">Nutricionista</option>
            </select>
          </div>

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
            Registrar
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600">
            Já tem conta?{' '}
            <a href="/login" className="text-green-600 hover:underline font-medium">
              Faça login aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

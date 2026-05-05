import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { consultationService } from '../services/consultationService';
import { doubtService } from '../services/doubtService';
import type { Consultation, Doubt } from '../types';

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    consultations: 0,
    doubts: 0,
  });
  const [recentConsultations, setRecentConsultations] = useState<Consultation[]>([]);
  const [recentDoubts, setRecentDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [consultations, doubts] = await Promise.all([
        consultationService.getAll(),
        doubtService.getAll(),
      ]);

      setStats({
        consultations: consultations.length,
        doubts: doubts.length,
      });

      // Pegar os 3 mais recentes
      setRecentConsultations(consultations.slice(0, 3));
      setRecentDoubts(doubts.slice(0, 3));
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl text-gray-600">Carregando dashboard...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-8">
          <h1 className="text-3xl font-bold mb-2">
            Bem-vindo, {user?.name}! 👋
          </h1>
          <p className="text-green-100">
            {user?.role === 'PATIENT'
              ? 'Acompanhe suas consultas e dúvidas'
              : 'Gerencie seus pacientes e consultas'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Total de Consultas" icon="📅">
            <div className="text-4xl font-bold text-green-600">
              {stats.consultations}
            </div>
            <p className="text-gray-600 mt-2">Consultas agendadas</p>
          </Card>

          <Card title="Total de Dúvidas" icon="❓">
            <div className="text-4xl font-bold text-blue-600">
              {stats.doubts}
            </div>
            <p className="text-gray-600 mt-2">Dúvidas registradas</p>
          </Card>
        </div>

        {/* Recent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Consultas Recentes" icon="📋">
            {recentConsultations.length > 0 ? (
              <div className="space-y-3">
                {recentConsultations.map((consultation) => (
                  <div
                    key={consultation.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">
                          {new Date(consultation.date).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Status: {consultation.status}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                        {consultation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma consulta registrada</p>
            )}
          </Card>

          <Card title="Dúvidas Recentes" icon="💬">
            {recentDoubts.length > 0 ? (
              <div className="space-y-3">
                {recentDoubts.map((doubt) => (
                  <div
                    key={doubt.id}
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-medium text-gray-800">{doubt.title}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {doubt.answerText ? '✅ Respondida' : '⏳ Aguardando resposta'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Nenhuma dúvida registrada</p>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

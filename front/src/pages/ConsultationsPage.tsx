import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { consultationService } from '../services/consultationService';
import type { Consultation } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function ConsultationsPage() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    nutritionistId: '',
    date: '',
    notes: '',
  });

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await consultationService.getAll();
      setConsultations(data);
    } catch (err) {
      setError('Erro ao carregar consultas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await consultationService.create({
        patientId: formData.patientId,
        nutritionistId: formData.nutritionistId,
        date: formData.date,
        notes: formData.notes,
      });
      setShowForm(false);
      setFormData({ patientId: '', nutritionistId: '', date: '', notes: '' });
      loadConsultations();
    } catch (err) {
      setError('Erro ao criar consulta');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta consulta?')) {
      try {
        await consultationService.delete(id);
        loadConsultations();
      } catch (err) {
        setError('Erro ao deletar consulta');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl text-gray-600">Carregando consultas...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">📅 Consultas</h1>
          {user?.role === 'NUTRITIONIST' && (
            <Button
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? 'secondary' : 'primary'}
            >
              {showForm ? 'Cancelar' : 'Nova Consulta'}
            </Button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {showForm && (
          <Card title="Agendar Consulta" icon="➕">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="ID do Paciente"
                type="text"
                value={formData.patientId}
                onChange={(e) =>
                  setFormData({ ...formData, patientId: e.target.value })
                }
                required
              />
              <Input
                label="ID do Nutricionista"
                type="text"
                value={formData.nutritionistId}
                onChange={(e) =>
                  setFormData({ ...formData, nutritionistId: e.target.value })
                }
                required
              />
              <Input
                label="Data e Hora"
                type="datetime-local"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
              />
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas
                </label>
                <textarea
                  placeholder="Anotações sobre a consulta"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                />
              </div>
              <Button type="submit" variant="primary">
                Agendar
              </Button>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          {consultations.length > 0 ? (
            consultations.map((consultation) => (
              <Card key={consultation.id} title={`Consulta - ${consultation.id.slice(0, 8)}`}>
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-600">
                        📅 {new Date(consultation.date).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(consultation.date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-gray-600">
                        👤 Paciente: {consultation.patient?.user?.name || 'N/A'}
                      </p>
                      <p className="text-gray-600">
                        👨‍⚕️ Nutricionista: {consultation.nutritionist?.name || 'N/A'}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        consultation.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-700'
                          : consultation.status === 'SCHEDULED'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {consultation.status}
                    </span>
                  </div>
                  {consultation.notes && (
                    <p className="text-gray-700 mt-2">
                      <strong>Notas:</strong> {consultation.notes}
                    </p>
                  )}
                  {user?.role === 'NUTRITIONIST' && (
                    <Button
                      onClick={() => handleDelete(consultation.id)}
                      variant="danger"
                      className="mt-4"
                    >
                      Deletar
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhuma consulta agendada</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

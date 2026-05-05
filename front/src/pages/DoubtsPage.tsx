import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { doubtService } from '../services/doubtService';
import type { Doubt } from '../types';
import { useAuth } from '../contexts/AuthContext';

export function DoubtsPage() {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    question: '',
    isPublic: true,
  });
  const [answerData, setAnswerData] = useState('');

  useEffect(() => {
    loadDoubts();
  }, []);

  const loadDoubts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await doubtService.getAll();
      setDoubts(data);
    } catch (err) {
      setError('Erro ao carregar dúvidas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await doubtService.create({
        title: formData.title,
        question: formData.question,
        isPublic: formData.isPublic,
      });
      setShowForm(false);
      setFormData({ title: '', question: '', isPublic: true });
      loadDoubts();
    } catch (err) {
      setError('Erro ao criar dúvida');
      console.error(err);
    }
  };

  const handleAnswer = async (doubtId: string) => {
    if (!answerData.trim()) return;
    try {
      await doubtService.update(doubtId, { answerText: answerData });
      setAnswerData('');
      setEditingId(null);
      loadDoubts();
    } catch (err) {
      setError('Erro ao responder dúvida');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja deletar esta dúvida?')) {
      try {
        await doubtService.delete(id);
        loadDoubts();
      } catch (err) {
        setError('Erro ao deletar dúvida');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl text-gray-600">Carregando dúvidas...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">❓ Dúvidas</h1>
          {user?.role === 'PATIENT' && (
            <Button
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? 'secondary' : 'primary'}
            >
              {showForm ? 'Cancelar' : 'Nova Dúvida'}
            </Button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {showForm && (
          <Card title="Enviar Dúvida" icon="✉️">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Título"
                type="text"
                placeholder="Título da sua dúvida"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <textarea
                placeholder="Descreva sua dúvida em detalhes"
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={5}
                required
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) =>
                    setFormData({ ...formData, isPublic: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="isPublic" className="ml-2 text-gray-700">
                  Tornar pública (outros pacientes podem ver)
                </label>
              </div>
              <Button type="submit" variant="primary">
                Enviar Dúvida
              </Button>
            </form>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-4">
          {doubts.length > 0 ? (
            doubts.map((doubt) => (
              <Card key={doubt.id} title={doubt.title} icon="💬">
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-700">{doubt.question}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {doubt.isPublic ? '🌍 Pública' : '🔒 Privada'}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {doubt.answerText ? '✅ Respondida' : '⏳ Pendente'}
                      </span>
                    </div>
                  </div>

                  {doubt.answerText && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <p className="text-sm font-medium text-green-700 mb-2">
                        Resposta de {doubt.nutritionist?.name}:
                      </p>
                      <p className="text-gray-700">{doubt.answerText}</p>
                    </div>
                  )}

                  {user?.role === 'NUTRITIONIST' && !doubt.answerText && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      {editingId === doubt.id ? (
                        <div className="space-y-3">
                          <textarea
                            placeholder="Digite sua resposta"
                            value={answerData}
                            onChange={(e) => setAnswerData(e.target.value)}
                            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAnswer(doubt.id)}
                              variant="primary"
                            >
                              Responder
                            </Button>
                            <Button
                              onClick={() => {
                                setEditingId(null);
                                setAnswerData('');
                              }}
                              variant="secondary"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          onClick={() => setEditingId(doubt.id)}
                          variant="primary"
                        >
                          Responder Dúvida
                        </Button>
                      )}
                    </div>
                  )}

                  {(user?.role === 'PATIENT' || user?.id === doubt.patient?.userId) && (
                    <Button
                      onClick={() => handleDelete(doubt.id)}
                      variant="danger"
                      className="mt-2"
                    >
                      Deletar
                    </Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhuma dúvida registrada</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

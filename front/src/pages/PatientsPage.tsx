import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Card } from '../components/Card';
import type { Patient } from '../types';
import { patientService } from '../services/patientService';

export function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await patientService.getAll();
      setPatients(data);
    } catch (err) {
      setError('Erro ao carregar pacientes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-xl text-gray-600">Carregando pacientes...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">👥 Meus Pacientes</h1>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patients.length > 0 ? (
            patients.map((patient) => (
              <Card
                key={patient.id}
                title={patient.user?.name || 'Paciente'}
                icon="👤"
              >
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">
                    📧 <strong>Email:</strong> {patient.user?.email}
                  </p>
                  {patient.birthDate && (
                    <p className="text-gray-600">
                      🎂 <strong>Data de Nascimento:</strong>{' '}
                      {new Date(patient.birthDate).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                  {patient.gender && (
                    <p className="text-gray-600">
                      👥 <strong>Gênero:</strong> {patient.gender}
                    </p>
                  )}
                  {patient.contact && (
                    <p className="text-gray-600">
                      📞 <strong>Contato:</strong> {patient.contact}
                    </p>
                  )}
                  <p className="text-gray-500 text-xs">
                    ID: {patient.id.slice(0, 8)}...
                  </p>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                Você não tem pacientes registrados
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

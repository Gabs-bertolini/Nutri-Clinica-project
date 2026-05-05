import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          🏥 NutriClínica
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex gap-4">
            <Link
              to="/dashboard"
              className="hover:text-green-200 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/consultations"
              className="hover:text-green-200 transition-colors"
            >
              Consultas
            </Link>
            <Link
              to="/doubts"
              className="hover:text-green-200 transition-colors"
            >
              Dúvidas
            </Link>
            {user?.role === 'NUTRITIONIST' && (
              <Link
                to="/patients"
                className="hover:text-green-200 transition-colors"
              >
                Pacientes
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm opacity-90">
              {user?.name} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

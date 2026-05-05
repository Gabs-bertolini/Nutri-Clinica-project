import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ConsultationsPage } from './pages/ConsultationsPage';
import { DoubtsPage } from './pages/DoubtsPage';
import { PatientsPage } from './pages/PatientsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/consultations"
            element={
              <ProtectedRoute>
                <ConsultationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doubts"
            element={
              <ProtectedRoute>
                <DoubtsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/patients"
            element={
              <ProtectedRoute requiredRole="NUTRITIONIST">
                <PatientsPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect to dashboard by default */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

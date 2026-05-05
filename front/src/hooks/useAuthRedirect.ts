import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function useAuthRedirect(requireAuth: boolean = true) {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        navigate('/login');
      } else if (!requireAuth && isAuthenticated) {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, loading, requireAuth, navigate]);

  return loading;
}

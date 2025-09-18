import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { API_LOGIN } from '../utils/Constants.jsx';
import { ErrorTemplate } from './Templates.jsx';

const ProtectedRoute = ({ children }) => {
  const { token, loading, error } = useAuth();

  useEffect(() => {
    if (!loading && !token && !error) {
      window.location.replace(API_LOGIN);
    }
  }, [loading, token, error]);

  if (error) {
    return <ErrorTemplate message={String(error)} />;
  }

  if (!token) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

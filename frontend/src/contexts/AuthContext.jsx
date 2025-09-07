import { createContext, useContext, useState, useEffect } from 'react';
import RandomUtils from '../utils/RandomUtils.jsx';
import { API_AUTH, API_URL } from '../utils/Constants.jsx';

const AuthContext = createContext();

/**
 * Authentication provider component that manages user authentication and association status
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Authentication provider with context
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isAssos, setIsAssos] = useState(false);
  const [assoName, setAssoName] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [authResult, assoResult] = await Promise.all([
          RandomUtils.fetchData(API_AUTH),
          RandomUtils.fetchData(API_URL + '/api/user/is_association'),
        ]);

        if (authResult.data) {
          setToken(authResult.data);
        }
        if (assoResult.data) {
          setIsAssos(assoResult.data.is_asso);
          setAssoName(assoResult.data.asso);
        }

        setError(authResult.error || assoResult.error);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <AuthContext.Provider value={{ token, loading, error, isAssos, assoName }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context
 * @returns {Object} Authentication context value containing token, loading, error, isAssos, and assoName
 */
export const useAuth = () => useContext(AuthContext);

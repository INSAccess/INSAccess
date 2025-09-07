import { createContext, useContext, useState, useEffect } from 'react';
import RandomUtils from '../utils/RandomUtils.jsx';
import { API_AUTH, API_URL } from '../utils/Constants.jsx';

const AuthContext = createContext();

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
          RandomUtils.fetchData(API_URL + '/api/is_association'),
        ]);

        if (authResult.data) {
          setToken(authResult.data);
        }
        if (assoResult.data) {
          setIsAssos(assoResult.data.is_asso);
          setAssoName(assoResult.data.assoName);
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

export const useAuth = () => useContext(AuthContext);

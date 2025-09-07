import { createContext, useContext, useState, useEffect } from 'react';
import RandomUtils from '../utils/RandomUtils.jsx';
import { API_AUTH } from '../utils/Constants.jsx';

const AuthContext = createContext();

/**
 * Helper function: retry with exponential backoff
 * @param {string} path - API endpoint to fetch
 * @param {number} retries - Number of attempts
 * @param {number} delay - Initial delay in ms
 * @returns {Promise<{data: any, error: string|null}>}
 */
async function fetchWithRetry(path, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    const result = await RandomUtils.fetchData(path);
    if (!result.error) return result;

    // wait with exponential backoff before retrying
    await new Promise((res) => setTimeout(res, delay * Math.pow(2, i)));
  }
  return { data: null, error: 'Backend unavailable' };
}

/**
 * Authentication provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Authentication provider with context
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const authResult = await fetchWithRetry(API_AUTH);

        if (!cancelled) {
          if (authResult.data) setToken(authResult.data);
          setError(authResult.error || null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access authentication context
 * @returns {Object} Authentication context value containing token, loading, and error
 */
export const useAuth = () => useContext(AuthContext);

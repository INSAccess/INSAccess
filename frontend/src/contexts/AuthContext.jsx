import { createContext, useContext, useState, useEffect } from "react";
import RandomUtils from '../utils/RandomUtils.jsx'
import { API_AUTH } from '../utils/Constants.jsx'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
          const result = await RandomUtils.fetchData(API_AUTH);
          if (result.data){
            setToken(result.data);
          }
          setError(result.error);
          setLoading(false);
        };
    
        loadData();
    }, []);

    return (
        <AuthContext.Provider value={{ token, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
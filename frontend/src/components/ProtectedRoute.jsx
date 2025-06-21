import { useAuth } from "../contexts/AuthContext.jsx";
import { API_LOGIN } from '../utils/Constants.jsx'
import { ErrorTemplate, Loading } from './Templates.jsx'

/**
 * Component handling the access to the main page. Redirects the user if the authentification fails, or displays an error message
 * @component
 * @returns {JSX.Element} 
 */
const ProtectedRoute = ({ children }) => {
    const { token, loading, error } = useAuth();

    const urlLogin = API_LOGIN

    if (loading) {
        return <Loading />
    } else if (!token){
        window.location.replace(urlLogin)
    }

    if (token){
        return children;
    }

    if (error){
        return <ErrorTemplate message={error}/>
    }
};

export default ProtectedRoute;

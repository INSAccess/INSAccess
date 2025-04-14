import { useAuth } from "../contexts/AuthContext.jsx";
import { API_LOGIN } from '../utils/Constants.jsx'
import { Error, Loading } from './Templates.jsx'

const ProtectedRoute = ({ children }) => {
    const { token, loading, error } = useAuth();

    const url_login = API_LOGIN


    if (loading) {
        return <Loading />
    } else if (!token){
        window.location.replace(url_login)
    }

    if (token){
        return children;
    }

    if (error){
        return <Error message={error}/>
    }
};

export default ProtectedRoute;
